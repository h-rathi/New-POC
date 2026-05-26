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
        const response = await fetch("/api/offers/latest");
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
    <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold tracking-wider uppercase mb-8 shadow-sm border border-white/30 hover:bg-white/30 transition-colors">
          Limited Time Offer
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight mb-6 drop-shadow-md">
          {offer.name} <br/>
          <span className="text-blue-200">Save {discountText}</span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-blue-100 font-light max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
          {offer.description || "Upgrade your world with our premium electronics. Experience the future today with unbeatable savings."}
        </p>

        {/* Countdown */}
        {timeLeft && (
          <div className="flex items-center justify-center gap-4 mb-12">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((unit, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <span className="text-blue-100 text-xs md:text-sm uppercase tracking-widest mt-2 font-medium">{unit.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/offers"
            onClick={() => handleCtaClick("shop_now")}
            className="bg-white text-blue-600 font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:bg-gray-50 hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Shop Now
          </Link>
          <Link
            href="/offers"
            onClick={() => handleCtaClick("view_details")}
            className="bg-blue-700/50 backdrop-blur-sm border border-blue-400 text-white font-bold px-10 py-4 rounded-full text-lg shadow-md hover:bg-blue-600/60 hover:scale-105 transition-all duration-300"
          >
            View Details
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default OfferBanner;
