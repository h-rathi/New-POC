import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function findOrCreateCart({ userId, cartToken }: { userId?: string | null; cartToken?: string | null }) {
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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id ?? null;
    const cartToken = (session as any)?.sessionId ?? null;

    let cart = null;
    if (userId) {
      cart = await prisma.cart.findFirst({ where: { userId }, include: { items: true } });
    } else if (cartToken) {
      cart = await prisma.cart.findFirst({ where: { cartToken }, include: { items: true } });
    }

    return NextResponse.json({ cart });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: any[] = body.items ?? [];

    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id ?? null;
    const cartToken = body.cartToken ?? (session as any)?.sessionId ?? null;

    const cart = await findOrCreateCart({ userId, cartToken });
    if (!cart) throw new Error("Unable to determine cart owner");

    // Replace items: simple approach - delete existing items and recreate from client
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

    const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: true } });
    return NextResponse.json({ cart: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
