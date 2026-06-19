// *********************
// Role: Cross-platform analytics event tracker
// Name: track.ts
// posthog-js handles both web and native (Capacitor).
// On native, $lib is set to 'capacitor-ios' or 'capacitor-android'
// via posthog.register() in instrumentation-client.js.
// *********************

import posthog from 'posthog-js';

export async function track(eventName: string, properties: Record<string, unknown> = {}) {
  posthog.capture(eventName, properties);
}
