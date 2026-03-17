"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import posthog from "posthog-js";

const ExploreOffersSection = () => {
  useEffect(() => {
    posthog.capture("explore_offers_section_viewed", {
      component: "ExploreOffersSection",
    });
  }, []);

  const handleCtaClick = () => {
    posthog.capture("explore_offers_cta_clicked", {
      cta: "view_all_deals",
      destination: "/offers",
      component: "ExploreOffersSection",
    });
  };

  return (
    <div className="py-20 bg-gray-100 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-5">
        <h2 className="text-5xl font-extrabold text-blue-600 mb-6 max-md:text-4xl text-black">
          EXPLORE OFFERS
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-md:text-lg">
          Discover our latest deals, exclusive discounts, and bundles crafted to elevate your tech experience safely and reliably.
        </p>
        <Link
          href="/offers"
          onClick={handleCtaClick}
          className="inline-block bg-blue-600 font-bold text-white px-10 py-4 text-xl hover:bg-black transition-colors w-auto rounded-md uppercase"
        >
          SHOP ALL DEALS
        </Link>
      </div>
    </div>
  );
};

export default ExploreOffersSection;
