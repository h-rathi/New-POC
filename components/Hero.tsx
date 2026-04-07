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
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

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

  const handleCtaClick = (cta: "buy_now" | "learn_more") => {
    const ctaPayload = withIsLoggedIn({
      cta,
      component: "Hero",
    }, isLoggedIn);

    posthog.capture("hero_cta_clicked", ctaPayload);

    // 🔹 GTM dataLayer push (NEW)
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "hero_cta_clicked",
        ...ctaPayload,
      });
    }

    router.push("/product/smart-watch-demo");
  };

  return (
    <div className="h-[700px] w-full bg-blue-500 max-lg:h-[900px] max-md:h-[750px]">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
        
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
          <h1 className="text-6xl text-white font-bold mb-3 max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
            THE PRODUCT OF THE FUTURE
          </h1>

          <p className="text-white max-sm:text-sm">
            Our time, reimagined.
A smartwatch that tracks your health, powers your day,
and keeps you connected—effortlessly. A powerful companion for your fitness and everyday life.
          </p>

          <div className="flex gap-x-1 max-lg:flex-col max-lg:gap-y-1">
            <button
              onClick={() => handleCtaClick("buy_now")}
              className="bg-white text-blue-600 font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-gray-100"
            >
              BUY NOW
            </button>

            <button
              onClick={() => handleCtaClick("learn_more")}
              className="bg-white text-blue-600 font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-gray-100"
            >
              LEARN MORE
            </button>
          </div>
        </div>

        <Image
          src="/watch for banner.png"
          width={400}
          height={400}
          alt="smart watch"
          className="max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default Hero;