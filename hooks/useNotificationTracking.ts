"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export const useNotificationTracking = () => {
  useEffect(() => {
    function handleNotificationTap(event: Event) {
      const customEvent = event as CustomEvent;
      const { title, body, campaign_id, deep_link, notification_id } =
        customEvent.detail;

      posthog.capture("notification_clicked", {
        title,
        body,
        campaign_id,
        deep_link,
        notification_id,
        platform: "android",
        source: "fcm_push",
      });
    }

    window.addEventListener("fcm_notification_tapped", handleNotificationTap);

    return () => {
      window.removeEventListener(
        "fcm_notification_tapped",
        handleNotificationTap
      );
    };
  }, []);
};
