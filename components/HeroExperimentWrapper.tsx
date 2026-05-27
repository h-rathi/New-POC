"use client";

import React, { useState, useEffect } from "react";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import Hero from "./Hero";
import OfferBanner from "./OfferBanner";

const HeroExperimentWrapper = () => {
  const [mounted, setMounted] = useState(false);
  const [hasOffer, setHasOffer] = useState(true);
  const variant = useFeatureFlagVariantKey("homepage-banner");

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    const url = baseUrl ? `${baseUrl}/api/offers/latest` : "/api/offers/latest";

    fetch(url)
      .then((res) => {
        if (!res.ok) setHasOffer(false);
      })
      .catch(() => setHasOffer(false));

    setMounted(true);
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
