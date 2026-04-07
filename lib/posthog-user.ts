"use client";

import posthog from "posthog-js";

export const identifyRegisteredUser = (
  userId: string,
  registeredAt: string
) => {
  if (!userId || !registeredAt) {
    return;
  }

  posthog.identify(userId, {
    registered_at: new Date(registeredAt).toISOString(),
  });
};

export const trackSuccessfulLogin = (userId: string) => {
  if (!userId) {
    return;
  }

  posthog.identify(userId);

  const payload = {
    user_id: userId,
  };

  posthog.capture("login_successful", payload);

  // 🔹 GTM dataLayer push (NEW)
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "login_successful",
      ...payload,
    });
  }
};