import posthog from 'posthog-js';
import { Capacitor } from '@capacitor/core';

// 1. Initialize PostHog normally
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-11-30'
});

// 2. If running natively via Capacitor, override the $lib super property
//    so events are tagged with 'capacitor-ios' or 'capacitor-android'
if (Capacitor.isNativePlatform()) {
  const platform = Capacitor.getPlatform(); // 'ios' or 'android'
  posthog.register({
    $lib: `capacitor-${platform}`,
  });
}