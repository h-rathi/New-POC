// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.2 (GTM dataLayer added)
// *********************

"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import posthog from "posthog-js";
import { Capacitor } from '@capacitor/core';
import { Posthog } from '@capawesome/capacitor-posthog';
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";

const Hero = () => {
  const isLoggedIn = useIsLoggedInValue();

  // Track hero impression once
  useEffect(() => {
    const heroViewPayload = withIsLoggedIn({
      component: "Hero",
    }, isLoggedIn);

    posthog.capture("hero_viewed", heroViewPayload);

    // 🔹 GTM dataLayer push (NEW)
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "hero_viewed",
        ...heroViewPayload,
      });
    }
  }, [isLoggedIn]);

  const router = useRouter();
  const { addToCart, calculateTotals } = useProductStore();

  const handleBuyNow = async () => {
    // Analytics — Hero intent
    const ctaPayload = withIsLoggedIn({
      cta: "buy_now",
      component: "Hero",
    }, isLoggedIn);

    // GTM dataLayer push (NEW)
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "hero_cta_clicked",
        ...ctaPayload,
      });
    }

    // Reuse existing Cart logic
    const price = 255;
    const quantityCount = 1;

    addToCart({
      id: "bose-qc-45",
      slug: "bose-quietcomfort-45",
      title: "Bose QuietComfort 45",
      price: price,
      image: "https://product-analysis-poc.s3.amazonaws.com/image-assets-for-website/bose-white.jpg",
      amount: quantityCount,
      discountedPrice: price,
      hasDiscount: false,
    });

    calculateTotals();
    toast.success("Product added to the cart");

    // Standard BuyNow analytics funnel
    const buyNowPayload = withIsLoggedIn({
      product_id: "bose-qc-45",
      product_name: "Bose QuietComfort 45",
      price: price,
      quantity: quantityCount,
      value: price * quantityCount,
      source: "hero_section",
    }, isLoggedIn);

    if (typeof window !== 'undefined' && window.navigator.userAgent.includes('CapacitorJS')) {
      await Posthog.capture({ event: "hero_cta_clicked", properties: { cta: "buy_now", component: "Hero", platform: "android" } });
      await Posthog.capture({ event: "buy_now_clicked", properties: { product_id: "bose-qc-45", product_name: "Bose QuietComfort 45", price: price, quantity: quantityCount, value: price * quantityCount, source: "hero_section", platform: "android" } });
      await Posthog.capture({ event: "begin_checkout", properties: { trigger: "buy_now", cart_value: price * quantityCount, platform: "android" } });
    } else {
      posthog.capture("hero_cta_clicked", ctaPayload);
      posthog.capture("buy_now_clicked", buyNowPayload);
      posthog.capture("begin_checkout", withIsLoggedIn({ trigger: "buy_now", cart_value: price * quantityCount }, isLoggedIn));
    }

    router.push("/checkout");
  };

  const handleLearnMore = async () => {
    const ctaPayload = withIsLoggedIn({
      cta: "learn_more",
      component: "Hero",
    }, isLoggedIn);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "hero_cta_clicked",
        ...ctaPayload,
      });
    }

    if (typeof window !== 'undefined' && window.navigator.userAgent.includes('CapacitorJS')) {
      await Posthog.capture({ event: "hero_cta_clicked", properties: { cta: "learn_more", component: "Hero", platform: "android" } });
    } else {
      posthog.capture("hero_cta_clicked", ctaPayload);
    }

    router.push("/product/bose-qc45-5");
  };

  return (
    <div className="w-full bg-blue-500 min-h-[500px] lg:h-[700px] overflow-hidden relative">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-12 items-center px-4 sm:px-10 gap-x-10 max-w-screen-2xl mx-auto h-full py-12 lg:py-0 gap-y-12 lg:gap-y-0">

        {/* Left: Text & CTAs */}
        <div className="flex flex-col gap-y-6 sm:gap-y-8 order-2 lg:order-1 col-span-1 lg:col-span-7 h-full justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl text-white font-extrabold tracking-tight leading-[1.1]">
            BOSE QUIETCOMFORT 45
          </h1>

          <p className="text-blue-50 text-lg sm:text-xl font-light max-w-2xl leading-relaxed">
            Iconic quiet. Comfort. And sound. 
            The first noise cancelling headphones are back, with world-class quiet, lightweight materials, and proprietary acoustic technology for deep, clear audio.
          </p>

          <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4 mt-2">
            <button
              onClick={handleBuyNow}
              className="bg-white text-blue-600 font-bold px-12 py-4 rounded-full text-lg shadow-xl hover:bg-gray-50 hover:scale-105 transition-all uppercase ease-in"
            >
              BUY NOW
            </button>

            <button
              onClick={handleLearnMore}
              className="bg-blue-600 border border-blue-400 text-white font-bold px-12 py-4 rounded-full text-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-all uppercase ease-in"
            >
              LEARN MORE
            </button>
          </div>
        </div>

        {/* Right: Floating Product Image */}
        <div className="col-span-1 lg:col-span-5 w-full flex justify-center items-center h-full order-1 lg:order-2">
          <div className="relative w-full max-w-[350px]">
            <Image
              src="https://product-analysis-poc.s3.amazonaws.com/image-assets-for-website/bose-white.jpg"
              width={500}
              height={500}
              alt="Bose QuietComfort 45"
              className="w-full h-auto object-contain rounded-3xl animate-float drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500 cursor-pointer bg-white p-4"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;