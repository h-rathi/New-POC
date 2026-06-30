"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export const useCrashTracking = () => {
  useEffect(() => {
    // Wait for PostHog to be initialized before attaching listeners
    const attachListeners = () => {
      // Catches uncaught JS errors
      window.onerror = (message, source, lineno, colno, error) => {
        posthog.capture("app_crash", {
          crash_type: "js_error",
          error_message: message,
          error_stack: error?.stack ?? "no stack available",
          source,
          line: lineno,
          column: colno,
          platform: "android",
          occurred_at: new Date().toISOString(),
        });

        // Return false so error still shows in console during development
        return false;
      };

      // Catches unhandled promise rejections
      window.onunhandledrejection = (event: PromiseRejectionEvent) => {
        posthog.capture("app_crash", {
          crash_type: "unhandled_promise_rejection",
          error_message: event.reason?.message ?? String(event.reason),
          error_stack: event.reason?.stack ?? "no stack available",
          platform: "android",
          occurred_at: new Date().toISOString(),
        });
      };
    };

    // Small delay to ensure posthog.init() has run in Providers.tsx
    const timer = setTimeout(attachListeners, 500);

    return () => {
      clearTimeout(timer);
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);
};