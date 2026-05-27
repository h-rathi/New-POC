"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const OfferBanner = () => {
  const isLoggedIn = useIsLoggedInValue();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const fetchLatestOffer = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
        const url = baseUrl ? `${baseUrl}/api/offers/latest` : "/api/offers/latest";

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setOffer(data);
        }
      } catch (error) {
        console.error("Failed to fetch latest offer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestOffer();
  }, []);

  useEffect(() => {
    if (!offer?.endDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(offer.endDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [offer?.endDate]);

  useEffect(() => {
    if (!offer) return;
    const viewPayload = withIsLoggedIn({
      component: "OfferBanner",
      offer_name: offer.name,
      offer_id: offer.id,
    }, isLoggedIn);

    posthog.capture("offer_banner_viewed", viewPayload);
  }, [offer, isLoggedIn]);

  const handleCtaClick = (cta: "shop_now" | "view_details") => {
    const ctaPayload = withIsLoggedIn({
      cta,
      component: "OfferBanner",
      offer_name: offer?.name,
      offer_id: offer?.id,
    }, isLoggedIn);

    posthog.capture("offer_banner_cta_clicked", ctaPayload);
  };

  if (loading) {
    return <div className="h-[500px] w-full bg-blue-500 animate-pulse" />;
  }

  if (!offer) {
    return null; // The wrapper handles the fallback to Hero if OfferBanner returns null
  }

  const discountText = offer.discountType === "PERCENTAGE" 
    ? `${offer.discountValue}% OFF` 
    : `$${offer.discountValue} OFF`;

  return (
    <div className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between relative z-10 gap-4">
        
        {/* Left: Badge & Text */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/30 shadow-sm backdrop-blur-sm">
            Limited Time Offer
          </span>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              {offer.name} <span className="text-blue-200">— Save {discountText}</span>
            </h2>
            <p className="text-blue-100 text-sm hidden md:block mt-0.5 font-medium">
              {offer.description || "Premium products at unbeatable prices."}
            </p>
          </div>
        </div>

        {/* Right: Countdown & CTAs */}
        <div className="flex items-center gap-6">
          {timeLeft && (
            <div className="hidden lg:flex items-center gap-3">
              {[
                { label: 'D', value: timeLeft.days },
                { label: 'H', value: timeLeft.hours },
                { label: 'M', value: timeLeft.minutes },
                { label: 'S', value: timeLeft.seconds },
              ].map((unit, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-black/20 rounded-md w-10 h-10 flex items-center justify-center font-bold text-lg shadow-inner border border-white/10">
                    {unit.value.toString().padStart(2, '0')}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider mt-1 text-blue-200">{unit.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Link
              href="/offers"
              onClick={() => handleCtaClick("view_details")}
              className="px-5 py-2 text-sm font-semibold rounded-full border border-blue-300 hover:bg-blue-600/50 transition-colors"
            >
              Details
            </Link>
            <Link
              href="/offers"
              onClick={() => handleCtaClick("shop_now")}
              className="px-5 py-2 text-sm font-bold rounded-full bg-white text-blue-700 hover:bg-gray-100 shadow-md hover:scale-105 transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OfferBanner;
