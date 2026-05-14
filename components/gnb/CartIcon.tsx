"use client";

import Link from "next/link";
import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

export default function CartIcon() {
  const { allQuantity } = useProductStore();
  const isLoggedIn = useIsLoggedInValue();

  const handleCartClick = () => {
    posthog.capture("cart_icon_clicked", withIsLoggedIn({
      action: "GNB_interaction",
      cart_quantity: allQuantity,
      component: "CartIcon",
      destination: "/cart",
    }, isLoggedIn));
  };

  return (
    <Link
      href="/cart"
      onClick={handleCartClick}
      className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-gray-800 group-hover:scale-105 transition-transform duration-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
      {allQuantity > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-600 rounded-full border border-white">
          {allQuantity}
        </span>
      )}
    </Link>
  );
}
