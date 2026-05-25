"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

interface ShopAnalyticsWrapperProps {
  categorySlug: string | null;
  searchParams: { [key: string]: string | string[] | undefined };
  children: React.ReactNode;
}

export default function ShopAnalyticsWrapper({ categorySlug, searchParams, children }: ShopAnalyticsWrapperProps) {
  const pathname = usePathname();
  const isLoggedIn = useIsLoggedInValue();
  const hasTrackedPageView = useRef(false);

  useEffect(() => {
    if (hasTrackedPageView.current) return;
    hasTrackedPageView.current = true;

    const payload = withIsLoggedIn({
      category: categorySlug || "all",
      page_number: searchParams?.page || 1,
      sort_by: searchParams?.sort || "defaultSort",
      filters_applied: {
        inStock: searchParams?.inStock === "true",
        outOfStock: searchParams?.outOfStock === "true",
        discounted: searchParams?.discounted === "true",
        nonDiscounted: searchParams?.nonDiscounted === "true",
        price: searchParams?.price || null,
        rating: searchParams?.rating || null,
      },
      component: "ShopPage",
    }, isLoggedIn);

    posthog.capture("shop_page_viewed", payload);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "shop_page_viewed", ...payload });
    }
  }, [isLoggedIn, pathname, categorySlug, searchParams]);

  return <>{children}</>;
}
