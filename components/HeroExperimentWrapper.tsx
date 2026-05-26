"use client";

import React, { useState, useEffect } from "react";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import Hero from "./Hero";
import OfferBanner from "./OfferBanner";

const HeroExperimentWrapper = () => {
  const [mounted, setMounted] = useState(false);
  const [hasOffer, setHasOffer] = useState(true);

  // The variant from PostHog ('control' or 'test')
  // We use the 'homepage-banner' key.
  const variant = useFeatureFlagVariantKey("homepage-banner");

  useEffect(() => {
    setMounted(true);
    // Check if an offer exists quickly so we don't render a blank test variant
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const url = `${base}/api/offers/latest`;

    fetch(url)
      .then((res) => {
        if (!res.ok) setHasOffer(false);
      })
      .catch(() => setHasOffer(false));
  }, []);

  // Prevent hydration mismatch by returning a placeholder or nothing until mounted
  if (!mounted) return <div className="h-[700px] w-full bg-blue-500 animate-pulse" />;

  // If no offer exists, fallback to Hero regardless of experiment
  if (!hasOffer) {
    return <Hero />;
  }

  // A/B test routing
  if (variant === "test") {
    return <OfferBanner />;
  }

  // Default to control
  return <Hero />;
};

export default HeroExperimentWrapper;
