// Minimal server-side PostHog helper using the PostHog HTTP capture endpoint.
// This avoids adding a new dependency; it attempts a best-effort POST and
// logs failures without breaking request flows.

const DEFAULT_HOST = "https://app.posthog.com";

export async function captureEvent(event: string, properties: Record<string, any>) {
  try {
    const apiKey = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? DEFAULT_HOST;

    if (!apiKey) {
      // No API key configured; don't throw — just warn.
      console.warn("PostHog capture skipped: POSTHOG_API_KEY not set");
      return;
    }

    const payload = {
      api_key: apiKey,
      event,
      properties: properties ?? {},
    };

    const url = `${host.replace(/\/$/, "")}/capture/`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("PostHog capture failed:", err);
  }
}

export default captureEvent;
