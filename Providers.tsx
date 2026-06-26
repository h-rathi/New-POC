"use client";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize PostHog on the client once so hooks like
    // useFeatureFlagVariantKey work throughout the app.
    if (typeof window === "undefined") return;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (key && !(posthog as any).__initialized) {
      posthog.init(key, {
        api_host: host || undefined,
      });
      // mark to avoid re-initializing in rare rerenders
      (posthog as any).__initialized = true;
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "17px",
          },
        }}
      />
      {children}
    </PostHogProvider>
  );
};

export default Providers;