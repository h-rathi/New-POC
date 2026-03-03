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
        include: { items: true },
      });
    } else if (cartToken) {
      cart = await prisma.cart.findFirst({
        where: { cartToken },
        include: { items: true },
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
      // This should not happen now, but protect anyway
      return NextResponse.json(
        { error: "Unable to determine cart owner. Please clear cookies and try again." },
        { status: 400 }
      );
    }

    // Replace items: delete existing then recreate from client payload
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    const createData = items.map((it) => ({
      cartId: cart.id,
      productId: it.productId ?? it.id ?? null,
      title: it.title ?? "",
      image: it.image ?? null,
      unitPrice: Math.round(Number(it.unitPrice ?? it.price ?? 0)),
      quantity: Math.max(1, Number(it.quantity ?? it.amount ?? 1)),
      metadata: it.metadata ?? null,
    }));

    if (createData.length) {
      await prisma.cartItem.createMany({ data: createData });
    }

    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
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

