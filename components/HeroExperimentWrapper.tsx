"use client";

import React, { useState, useEffect } from "react";
import posthog from "posthog-js";
import Hero from "./Hero";
import OfferBanner from "./OfferBanner";

const HeroExperimentWrapper = () => {
  const [mounted, setMounted] = useState(false);
  const [hasOffer, setHasOffer] = useState(true);
  const [variant, setVariant] = useState<string | boolean | undefined>(undefined);

  useEffect(() => {
    // Quick check for active offers
    fetch("/api/offers/latest")
      .then((res) => {
        if (!res.ok) setHasOffer(false);
      })
      .catch(() => setHasOffer(false));

    // Listen for feature flags
    posthog.onFeatureFlags(() => {
      setVariant(posthog.getFeatureFlag('homepage-banner'));
      setMounted(true);
    });

    // Fallback if flags take too long or fail
    const timeout = setTimeout(() => setMounted(true), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (!mounted) {
    return <div className="h-[700px] w-full bg-blue-500 animate-pulse" />;
  }

  if (!hasOffer) {
    return <Hero />;
  }

  if (variant === 'test') {
    return <OfferBanner />;
  } else {
    // It's a good idea to let control variant always be the default behaviour,
    // so if something goes wrong with flag evaluation, you don't break your app.
    return <Hero />;
  }
};

export default HeroExperimentWrapper;
