import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read the guest cart token from the `cart_token` cookie if present. */
function getCartTokenFromCookies(req: NextRequest): string | null {
  return req.cookies.get("cart_token")?.value ?? null;
}

/** Set (or refresh) the `cart_token` cookie on the response. */
function setCartTokenCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set("cart_token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

async function findOrCreateCart({
  userId,
  cartToken,
}: {
  userId?: string | null;
  cartToken?: string | null;
}) {
  let cart = null;
  if (userId) {
    cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }
  } else if (cartToken) {
    cart = await prisma.cart.findFirst({ where: { cartToken } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { cartToken } });
    }
  }
  return cart;
}

// read-only lookup (does not create)
async function findCart({
  userId,
  cartToken,
}: {
  userId?: string | null;
  cartToken?: string | null;
}) {
  if (userId) {
    return prisma.cart.findFirst({ where: { userId } });
  }
  if (cartToken) {
    return prisma.cart.findFirst({ where: { cartToken } });
  }
  return null;
}

// ---------------------------------------------------------------------------
// GET /api/cart – read-only, never mutates
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id ?? null;
    let cartToken = getCartTokenFromCookies(req);

    console.log("[GET /api/cart]", { userId, cartToken: cartToken ? "present" : "missing" });

    let cart = null;
    if (userId) {
      cart = await prisma.cart.findFirst({
        where: { userId },
        include: { items: { where: { isRemoved: false } } },
      });
    } else if (cartToken) {
      cart = await prisma.cart.findFirst({
        where: { cartToken },
        include: { items: { where: { isRemoved: false } } },
      });
    }

    // If there is no identifier at all we simply return an empty cart – never 500
    const res = NextResponse.json({ cart: cart ?? null });

    // If a guest already has a token, refresh the cookie expiry
    if (!userId && cartToken) {
      setCartTokenCookie(res, cartToken);
    }

    return res;
  } catch (err: any) {
    console.error("[GET /api/cart] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error while reading cart" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/cart – upsert items
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    // --- Parse body safely ---------------------------------------------------
    let body: any;
    try {
      body = await req.json();
    } catch {
      console.warn("[POST /api/cart] invalid or empty JSON body");
      return NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 }
      );
    }

    const items: any[] = Array.isArray(body?.items) ? body.items : [];

    // --- Determine cart owner ------------------------------------------------
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id ?? null;
    let cartToken = body.cartToken ?? getCartTokenFromCookies(req) ?? null;

    // For guests that have never had a token, mint one
    if (!userId && !cartToken) {
      cartToken = crypto.randomUUID();
      console.log("[POST /api/cart] minted new guest cartToken:", cartToken);
    }

    console.log("[POST /api/cart]", {
      userId,
      cartToken: cartToken ? "present" : "missing",
      itemCount: items.length,
    });

    const cart = await findOrCreateCart({ userId, cartToken });
    if (!cart) {
      return NextResponse.json(
        { error: "Unable to determine cart owner. Please clear cookies and try again." },
        { status: 400 }
      );
    }

    // fetch all existing items (including those previously removed)
    const existingItems = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    const existingByProduct: Record<string, typeof existingItems[0]> = {};
    existingItems.forEach((it) => {
      if (it.productId) existingByProduct[it.productId] = it;
    });

    // mark everything as removed by default; we'll flip back when we see it again
    if (existingItems.length) {
      await prisma.cartItem.updateMany({
        where: { cartId: cart.id },
        data: { isRemoved: true },
      });
    }

    // process incoming items: upsert quantity and un-remove
    for (const it of items) {
      const productId = it.productId ?? it.id ?? null;
      if (!productId) continue;

      const quantity = Math.max(1, Number(it.quantity ?? it.amount ?? 1));
      const data = {
        cartId: cart.id,
        productId,
        title: it.title ?? "",
        image: it.image ?? null,
        unitPrice: Math.round(Number(it.unitPrice ?? it.price ?? 0)),
        quantity,
        metadata: it.metadata ?? null,
        isRemoved: false,
      } as any;

      if (existingByProduct[productId]) {
        // update existing row (could have been marked removed above)
        await prisma.cartItem.update({
          where: { id: existingByProduct[productId].id },
          data,
        });
      } else {
        // new item
        await prisma.cartItem.create({ data });
      }
    }

    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { where: { isRemoved: false } } },
    });

    const res = NextResponse.json({ cart: updated });

    // Persist the guest token cookie so the next GET can find the same cart
    if (!userId && cartToken) {
      setCartTokenCookie(res, cartToken);
    }

    return res;
  } catch (err: any) {
    console.error("[POST /api/cart] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error while saving cart" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/cart – remove entire cart and its items (used after checkout)
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id ?? null;
    const cartToken = getCartTokenFromCookies(req) ?? (session as any)?.sessionId ?? null;

    const cart = await findCart({ userId, cartToken });
    if (!cart) {
      // nothing to clear
      return NextResponse.json({ success: true });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.delete({ where: { id: cart.id } });

    // clear cookie for guest
    const res = NextResponse.json({ success: true });
    if (!userId && cartToken) {
      res.cookies.set("cart_token", "", { maxAge: 0, path: "/" });
    }
    return res;
  } catch (err: any) {
    console.error("[DELETE /api/cart] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error while clearing cart" },
      { status: 500 }
    );
  }
}

