// *********************
// Role of the component: IntroducingSection with the text "Introducing Singitronic"
// Name of the component: IntroducingSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.2 (GTM dataLayer added + correct event)
// *********************

"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import posthog from "posthog-js";
import { useFeatureFlagVariantKey } from 'posthog-js/react';
import { useRouter } from 'next/navigation';
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const IntroducingSection = () => {
  const isLoggedIn = useIsLoggedInValue();

  // Track section impression once
  useEffect(() => {
    const viewPayload = withIsLoggedIn({
      component: "IntroducingSection",
    }, isLoggedIn);

    posthog.capture("introducing_section_viewed", viewPayload);

    // 🔹 GTM dataLayer push (NEW)
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "introducing_section_viewed",
        ...viewPayload,
      });
    }
  }, [isLoggedIn]);

  const variant = useFeatureFlagVariantKey('test1');
  const router = useRouter();

  const handleClick = () => {
    const ctaPayload = withIsLoggedIn({
      cta: "shop_now",
      destination: "/shop",
      component: "IntroducingSection",
    }, isLoggedIn);

    // ✅ Updated event name
    posthog.capture("introducing_section_cta_clicked", ctaPayload);

    // 🔹 GTM dataLayer push (NEW)
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "introducing_section_cta_clicked",
        ...ctaPayload,
      });
    }

    router.push('/shop');
  };

  return (
    <div className="py-20 pt-24 bg-gradient-to-l from-white to-blue-600">
      <div className="text-center flex flex-col gap-y-5 items-center">
        <h2 className="text-white text-8xl font-extrabold text-center mb-2 max-md:text-6xl max-[480px]:text-4xl">
          INTRODUCING{" "}
          <span className="text-black">SINGI</span>
          <span className="text-blue-600">TRONIC</span>
        </h2>

        <div>
          <p className="text-white text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base">
            Buy the latest electronics.
          </p>
          <p className="text-white text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base">
            The best electronics for tech lovers.
          </p>

          <button
            onClick={handleClick}
            className={`block font-bold px-12 py-3 text-xl hover:bg-gray-100 w-96 mt-2 max-md:text-lg max-md:w-72 max-[480px]:w-60 mx-auto ${variant === 'test' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
          >
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroducingSection;