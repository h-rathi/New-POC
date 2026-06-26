import posthog from 'posthog-js';
import { Capacitor } from '@capacitor/core';

// Initialize PostHog normally
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  // 1. Use the 'loaded' callback. This runs after initialization 
  // but BEFORE any pageviews or auto-events are actually sent to the server.
  loaded: (ph) => {
    // 2. Check for Capacitor natively here
    if (Capacitor.isNativePlatform()) {
      const platform = Capacitor.getPlatform(); // 'ios' or 'android'
      
      // 3. Register the library override so it attaches to everything
      ph.register({
        $lib: `capacitor-${platform}`,
        is_native_wrapper: true // (Optional) Adds a custom property for easier filtering
      });
    }
  }
});