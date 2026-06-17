// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.3 (Native PostHog Android tracking added)
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

    if (Capacitor.isNativePlatform()) {
      Posthog.capture({
        event: "hero_viewed",
        properties: {
          component: "Hero",
          platform: "android"
        }
      });
    } else {
      posthog.capture("hero_viewed", heroViewPayload);
    }

    // GTM dataLayer push
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
    const ctaPayload = withIsLoggedIn({
      cta: "buy_now",
      component: "Hero",
    }, isLoggedIn);

    // GTM dataLayer push
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "hero_cta_clicked",
        ...ctaPayload,
      });
    }

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

    if (Capacitor.isNativePlatform()) {
      // Android app — use native PostHog SDK
      await Posthog.capture({
        event: "hero_cta_clicked",
        properties: { cta: "buy_now", component: "Hero", platform: "android" }
      });
      await Posthog.capture({
        event: "buy_now_clicked",
        properties: {
          product_id: "bose-qc-45",
          product_name: "Bose QuietComfort 45",
          price: price,
          quantity: quantityCount,
          value: price * quantityCount,
          source: "hero_section",
          platform: "android"
        }
      });
      await Posthog.capture({
        event: "begin_checkout",
        properties: { trigger: "buy_now", cart_value: price * quantityCount, platform: "android" }
      });
    } else {
      // Browser — use web PostHog SDK
      const buyNowPayload = withIsLoggedIn({
        product_id: "bose-qc-45",
        product_name: "Bose QuietComfort 45",
        price: price,
        quantity: quantityCount,
        value: price * quantityCount,
        source: "hero_section",
      }, isLoggedIn);

      posthog.capture("hero_cta_clicked", ctaPayload);
      posthog.capture("buy_now_clicked", buyNowPayload);
      posthog.capture("begin_checkout", withIsLoggedIn({
        trigger: "buy_now",
        cart_value: price * quantityCount,
      }, isLoggedIn));
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

    if (Capacitor.isNativePlatform()) {
      await Posthog.capture({
        event: "hero_cta_clicked",
        properties: { cta: "learn_more", component: "Hero", platform: "android" }
      });
    } else {
      posthog.capture("hero_cta_clicked", ctaPayload);
    }

    router.push("/product/bose-qc45-5");
  };

  return (
    <div className="min-h-[500px] w-full bg-blue-500 h-auto overflow-hidden relative">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 items-center px-4 gap-x-6 gap-y-8 max-w-screen-2xl mx-auto py-10 w-full">

        {/* Left: Text & CTAs */}
        <div className="flex flex-col gap-y-6 sm:gap-y-8 max-lg:order-last col-span-12 lg:col-span-7 h-full justify-center">
          <h1 className="text-2xl text-white font-extrabold tracking-tight leading-[1.1] w-full pr-4">
            BOSE QUIETCOMFORT 45
          </h1>

          <p className="text-blue-50 text-sm font-light w-full pr-4 leading-relaxed">
            Iconic quiet. Comfort. And sound.
            The first noise cancelling headphones are back, with world-class quiet, lightweight materials, and proprietary acoustic technology for deep, clear audio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-auto bg-white text-blue-600 font-bold px-6 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg shadow-xl hover:bg-gray-50 hover:scale-105 transition-all uppercase ease-in"
            >
              BUY NOW
            </button>

            <button
              onClick={handleLearnMore}
              className="w-full sm:w-auto bg-blue-600 border border-blue-400 text-white font-bold px-6 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-all uppercase ease-in"
            >
              LEARN MORE
            </button>
          </div>
        </div>

        {/* Right: Floating Product Image */}
        <div className="col-span-12 lg:col-span-5 w-full flex justify-center items-center h-full">
          <div className="relative w-full max-w-[220px] sm:max-w-[280px] mx-auto">
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