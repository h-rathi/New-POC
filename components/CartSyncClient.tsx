"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useProductStore } from "@/app/_zustand/store";

export default function CartSyncClient() {
  const { data: session, status } = useSession();
  const products = useProductStore((s) => s.products);
  const clearCart = useProductStore((s) => s.clearCart);
  const syncedRef = useRef(false);

  useEffect(() => {
    // only run once per session auth
    if (status === "authenticated" && !syncedRef.current && products?.length) {
      syncedRef.current = true;
      (async () => {
        try {
          const items = products.map((p) => ({
            productId: p.id,
            title: p.title,
            image: p.image,
            unitPrice: p.price,
            quantity: p.amount,
          }));

          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items, cartToken: (session as any)?.sessionId }),
          });

          // clear local guest cart after successful merge to DB
          clearCart();
        } catch (err) {
          // swallow errors silently; leave guest cart intact
          console.error("Cart sync failed:", err);
        }
      })();
    }
  }, [status]);

  return null;
}
