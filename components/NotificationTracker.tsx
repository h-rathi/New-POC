"use client";

import { useEffect } from "react";
import { useNotificationTracking } from "@/hooks/useNotificationTracking";

export default function NotificationTracker() {
  // Activate the notification tap listener
  useNotificationTracking();

  useEffect(() => {
    // Signal to native Android that Next.js is ready to receive events
    window.websiteReady = true;
  }, []);

  // Renders nothing — purely logic
  return null;
}
