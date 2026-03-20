// *********************
// Role of the component: Wishlist icon with quantity located in the header
// Name of the component: HeartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 (PostHog tracking added)
// *********************

"use client";

import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa6";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const HeartElement = ({ wishQuantity }: { wishQuantity: number }) => {
  const isLoggedIn = useIsLoggedInValue();

  const handleWishlistClick = () => {
    posthog.capture("wishlist_icon_clicked", withIsLoggedIn({
      action: "GNB_interaction",
      wishlist_quantity: wishQuantity,
      destination: "/wishlist",
      component: "HeartElement",
    }, isLoggedIn));
  };

  return (
    <div className="relative">
      <Link href="/wishlist" onClick={handleWishlistClick}>
        <FaHeart className="text-2xl text-black" />
        <span className="block w-6 h-6 font-bold bg-blue-600 text-white rounded-full flex justify-center items-center absolute top-[-17px] right-[-22px]">
          {wishQuantity}
        </span>
      </Link>
    </div>
  );
};

export default HeartElement;
