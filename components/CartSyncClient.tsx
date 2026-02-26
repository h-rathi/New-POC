"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useProductStore } from "@/app/_zustand/store";

export default function CartSyncClient() {
  const { data: session, status } = useSession();
  const products = useProductStore((s) => s.products);
  const clearCart = useProductStore((s) => s.clearCart);
  const addToCart = useProductStore((s) => s.addToCart);
  const calculateTotals = useProductStore((s) => s.calculateTotals);
  const syncedRef = useRef(false);

  useEffect(() => {
    // don't attempt any network work until we know auth status
    if (status === "loading") return;

    const postCurrentCart = async () => {
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
          body: JSON.stringify({ items }),
        });
      } catch (err) {
        console.error("Cart update failed:", err);
      }
    };

    // initial hydration/merge when component first sees a non-loading status
    if (!syncedRef.current) {
      syncedRef.current = true;

      (async () => {
        try {
          // push any local products up first so DB has latest values
          if (products?.length) {
            await postCurrentCart();
          }

          // then fetch whatever the server thinks the cart is and overwrite local state
          const cartRes = await fetch("/api/cart", { method: "GET" });
          const { cart } = await cartRes.json();

          if (cart?.items && cart.items.length > 0) {
            clearCart();
            cart.items.forEach((item: any) => {
              addToCart({
                id: item.productId || item.id,
                title: item.title,
                price: item.unitPrice,
                image: item.image,
                amount: item.quantity,
              });
            });
            calculateTotals();
          } else {
            clearCart();
          }
        } catch (err) {
          console.error("Cart sync failed:", err);
        }
      })();
    } else {
      // subsequent changes should be persisted immediately
      postCurrentCart();
    }
  }, [status, products, addToCart, calculateTotals, clearCart]);

  return null;
}
