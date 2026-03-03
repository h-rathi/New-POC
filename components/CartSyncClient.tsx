"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useProductStore } from "@/app/_zustand/store";

export default function CartSyncClient() {
  const { status } = useSession();
  const products = useProductStore((s) => s.products);
  const clearCart = useProductStore((s) => s.clearCart);
  const addToCart = useProductStore((s) => s.addToCart);
  const calculateTotals = useProductStore((s) => s.calculateTotals);

  // tracks whether we have done the initial hydration from the server
  const hydratedRef = useRef(false);
  // prevents the products-changed effect from firing a POST when we are
  // the ones who updated the store after the initial GET
  const skipNextSyncRef = useRef(false);

  // -----------------------------------------------------------------------
  // 1. On first mount (or refresh), do a READ-ONLY GET to load the server
  //    cart.  Never POST on page load.
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (status === "loading") return;
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/cart", { method: "GET" });
        if (!res.ok) {
          console.error("Cart hydration GET failed:", res.status);
          // Don't wipe – keep whatever the user had in localStorage
          return;
        }

        const { cart } = await res.json();

        if (cart?.items && cart.items.length > 0) {
          // Flag so the products-changed effect doesn't immediately POST
          skipNextSyncRef.current = true;
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
        }
        // If the server has no cart, keep the existing localStorage cart
        // (don't clearCart!). The next user-initiated change will POST it.
      } catch (err) {
        console.error("Cart hydration failed:", err);
        // Keep existing local cart on failure
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // -----------------------------------------------------------------------
  // 2. Whenever the user explicitly changes cart *after* hydration,
  //    persist to the server via POST.
  // -----------------------------------------------------------------------
  useEffect(() => {
    // Don't sync before hydration is done
    if (!hydratedRef.current) return;

    // Skip the sync that was triggered by our own hydration write
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    const postCart = async () => {
      try {
        const items = products.map((p) => ({
          productId: p.id,
          title: p.title,
          image: p.image,
          unitPrice: p.price,
          quantity: p.amount,
        }));

        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });

        if (!res.ok) {
          console.error("Cart POST failed:", res.status, await res.text());
          // Don't wipe cart on failure!
        }
      } catch (err) {
        console.error("Cart sync POST failed:", err);
      }
    };

    postCart();
  }, [products]);

  return null;
}

