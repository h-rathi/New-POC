"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

// Centralized MLP metadata — maps slug to product info for analytics
const MLP_METADATA: Record<string, { productName: string; category: string; destinationPdp: string }> = {
  "macbook-air-m3": { productName: "MacBook Air M3", category: "laptops", destinationPdp: "/product/MacBook%20Air%20M3%20Variant%206" },
  "lenovo-thinkpad-x1": { productName: "ThinkPad X1", category: "laptops", destinationPdp: "/product/Lenovo%20ThinkPad%20X1%20Variant%208" },
  "xiaomi-pad-6": { productName: "Xiaomi Pad 6", category: "tablets", destinationPdp: "/product/Xiaomi%20Pad%206%20Variant%204" },
  "lenovo-tab-p12": { productName: "Lenovo Tab P12", category: "tablets", destinationPdp: "/product/Lenovo%20Tab%20P12%20Variant%201" },
  "sony-alpha-a6400": { productName: "Sony Alpha a6400", category: "cameras", destinationPdp: "/product/sony-a6400-2" },
  "canon-eos-r50": { productName: "Canon EOS R50", category: "cameras", destinationPdp: "/product/canon-eos-r50-2" },
  "sony-wf-1000xm5": { productName: "Sony WF-1000XM5", category: "earbuds", destinationPdp: "/product/Sony%20WF-1000XM5%20Variant%203" },
  "oneplus-buds-pro-3": { productName: "OnePlus Buds Pro 3", category: "earbuds", destinationPdp: "/product/OnePlus%20Buds%20Pro%203%20Variant%207" },
  "brother-hl-l2321d": { productName: "Brother HL-L2321D", category: "printers", destinationPdp: "/product/brother-hl-l2321d-1" },
  "canon-pixma-g3020": { productName: "Canon Pixma G3020", category: "printers", destinationPdp: "/product/canon-pixma-g3020-1" },
};

interface MlpAnalyticsWrapperProps {
  slug: string;
  children: React.ReactNode;
}

export default function MlpAnalyticsWrapper({ slug, children }: MlpAnalyticsWrapperProps) {
  const pathname = usePathname();
  const isLoggedIn = useIsLoggedInValue();
  const hasTrackedPageView = useRef(false);
  const trackedSections = useRef<Set<string>>(new Set());

  const meta = MLP_METADATA[slug] || {
    productName: slug,
    category: "unknown",
    destinationPdp: "",
  };

  // ─── mlp_page_viewed (fires once on mount) ───
  useEffect(() => {
    if (hasTrackedPageView.current) return;
    hasTrackedPageView.current = true;

    const payload = withIsLoggedIn({
      product_name: meta.productName,
      category: meta.category,
      slug,
      route: pathname,
      component: "MLP",
    }, isLoggedIn);

    posthog.capture("mlp_page_viewed", payload);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "mlp_page_viewed", ...payload });
    }
  }, [isLoggedIn, meta.productName, meta.category, slug, pathname]);

  // ─── mlp_section_viewed (IntersectionObserver for data-mlp-section elements) ───
  useEffect(() => {
    trackedSections.current = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = (entry.target as HTMLElement).dataset.mlpSection;
            if (sectionName && !trackedSections.current.has(sectionName)) {
              trackedSections.current.add(sectionName);

              const payload = withIsLoggedIn({
                product_name: meta.productName,
                category: meta.category,
                section_name: sectionName,
                component: "MLP",
              }, isLoggedIn);

              posthog.capture("mlp_section_viewed", payload);

              if (typeof window !== "undefined") {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ event: "mlp_section_viewed", ...payload });
              }
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    // Observe all elements with data-mlp-section attribute
    const sections = document.querySelectorAll("[data-mlp-section]");
    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isLoggedIn, meta.productName, meta.category]);

  return <>{children}</>;
}

// ─── Exported helper: mlp_buy_now_clicked ───
// Called directly by the CTA onClick handler inside each MLP component
export function trackMlpBuyNowClick(
  slug: string,
  isLoggedIn: "yes" | "no"
) {
  const meta = MLP_METADATA[slug] || {
    productName: slug,
    category: "unknown",
    destinationPdp: "",
  };

  const payload = withIsLoggedIn({
    product_name: meta.productName,
    category: meta.category,
    destination_pdp: meta.destinationPdp,
    source: "MLP Hero CTA",
    component: "MLP",
  }, isLoggedIn);

  posthog.capture("mlp_buy_now_clicked", payload);

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "mlp_buy_now_clicked", ...payload });
  }
}
