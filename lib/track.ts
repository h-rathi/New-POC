// *********************
// Role: Cross-platform analytics event tracker
// Name: track.ts
// Supports both Capacitor native (mobile) and web (PostHog JS)
// *********************

import { Capacitor } from "@capacitor/core";
import posthog from "posthog-js";

export async function track(eventName: string, properties: Record<string, unknown> = {}) {
  if (Capacitor.isNativePlatform()) {
    await (window as any).Capacitor.Plugins.PostHog.capture({
      event: eventName,
      properties,
    });
  } else {
    posthog.capture(eventName, properties);
  }
}
