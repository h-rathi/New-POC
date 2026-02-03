// *********************
// Role of the component: Buy Now button that adds product to the cart and redirects to the checkout page
// Name of the component: BuyNowSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 (PostHog tracking added)
// *********************

"use client";

import { useProductStore } from "@/app/_zustand/store";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const router = useRouter();
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = () => {
    // 1️⃣ Business logic (unchanged)
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount,
    });

    calculateTotals();
    toast.success("Product added to the cart");

    // 2️⃣ Analytics — intent
    posthog.capture("buy_now_clicked", {
      product_id: product?.id,
      product_name: product?.title,
      price: product?.price,
      quantity: quantityCount,
      value: product?.price * quantityCount,
      source: "single_product_page",
    });

    // 3️⃣ Analytics — funnel step
    posthog.capture("begin_checkout", {
      trigger: "buy_now",
      cart_value: product?.price * quantityCount,
    });

    // 4️⃣ Redirect
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleAddToCart}
      className="btn w-[200px] text-lg border border-blue-500 hover:border-blue-500 border-1 font-normal bg-blue-500 text-white hover:bg-white hover:scale-110 hover:text-blue-500 transition-all uppercase ease-in max-[500px]:w-full"
    >
      Buy Now
    </button>
  );
};

export default BuyNowSingleProductBtn;
