"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const SCROLL_DEPTH_STEPS = [20, 40, 60, 80, 100];

export default function ScrollDepthTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedDepthsRef = useRef<Set<number>>(new Set());
  const isLoggedIn = useIsLoggedInValue();

  const routeKey = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    trackedDepthsRef.current = new Set();

    const getScrollDepth = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScrollable = documentHeight - viewportHeight;

      if (maxScrollable <= 0) {
        return 100;
      }

      return Math.min(
        100,
        Math.round((window.scrollY / maxScrollable) * 100)
      );
    };

    const captureDepths = () => {
      const currentDepth = getScrollDepth();

      SCROLL_DEPTH_STEPS.forEach((depth) => {
        if (
          currentDepth >= depth &&
          !trackedDepthsRef.current.has(depth)
        ) {
          trackedDepthsRef.current.add(depth);

          const payload = withIsLoggedIn({
            scroll_depth_percentage: depth,
            page_path: pathname,
            page_query: searchParams?.toString() || "",
            page_url: window.location.href,
            page_title: document.title,
          }, isLoggedIn);

          posthog.capture("scroll_depth", payload);

          // 🔹 GTM dataLayer push (NEW)
          if (typeof window !== "undefined") {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "scroll_depth",
              ...payload,
            });
          }
        }
      });
    };

    const handleScroll = () => {
      captureDepths();
    };

    captureDepths();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    const timeoutId = window.setTimeout(captureDepths, 300);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.clearTimeout(timeoutId);
    };
  }, [isLoggedIn, pathname, routeKey, searchParams]);

  return null;
}