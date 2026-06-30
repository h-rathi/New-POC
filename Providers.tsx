"use client";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useCrashTracking } from "@/hooks/useCrashTracking"; // ADD THIS

const Providers = ({ children }: { children: React.ReactNode }) => {

  useCrashTracking(); // ADD THIS — runs after posthog.init

  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (key && !(posthog as any).__initialized) {
      posthog.init(key, {
        api_host: host || undefined,
      });
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