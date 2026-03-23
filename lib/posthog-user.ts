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
  posthog.capture("login_successful", {
    user_id: userId,
  });
};
