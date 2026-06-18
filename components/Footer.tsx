// *********************
// Role of the component: Footer component
// Name of the component: Footer.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.2 (PostHog cross-platform test button added)
// *********************

"use client";

import { navigation } from "@/lib/utils";
import { track } from "@/lib/track";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import apiClient from "@/lib/api";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

// ─── Types ───────────────────────────────────────────────────────────────────
type FooterSection = "About Us" | "Buying" | "Support";

// ─── Main Component ───────────────────────────────────────────────────────────
const Footer = () => {
  const [activeOffers, setActiveOffers] = useState<{ id: string; name: string }[]>([]);
  const isLoggedIn = useIsLoggedInValue();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSection, setDrawerSection] = useState<FooterSection | null>(null);
  const [eventStatus, setEventStatus] = useState<"idle" | "firing" | "success" | "error">("idle");
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiClient
      .get("/api/offers?mode=list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActiveOffers(data);
        }
      })
      .catch((err) => console.error("Failed to fetch active offers for footer:", err));
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
        setEventStatus("idle");
      }
    };
    if (drawerOpen) {
      document.addEventListener("mousedown", handleOutside);
    }
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [drawerOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setEventStatus("idle");
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const openDrawer = (section: FooterSection) => {
    setDrawerSection(section);
    setEventStatus("idle");
    setDrawerOpen(true);
  };

  // ─── Existing footer link tracker ────────────────────────────────────────
  const trackFooterClick = (label: string, href: string, section: string) => {
    const payload = withIsLoggedIn(
      {
        label,
        destination: href,
        section,
        component: "Footer",
      },
      isLoggedIn
    );

    posthog.capture("footer_link_clicked", payload);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "footer_link_clicked",
        ...payload,
      });
    }
  };

  // ─── Dummy test event handler ─────────────────────────────────────────────
  const handleFireTestEvent = async () => {
    setEventStatus("firing");
    try {
      await track("footer_section_test_event", {
        section: drawerSection,
        component: "Footer",
        triggered_from: "test_button",
        platform: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
        timestamp: new Date().toISOString(),
        dummy_payload: {
          message: "This is a dummy test event",
          value: 42,
          tags: ["footer", "test", drawerSection?.toLowerCase().replace(" ", "_") ?? "unknown"],
        },
      });
      setEventStatus("success");
    } catch (err) {
      console.error("Test event failed:", err);
      setEventStatus("error");
    }
  };

  // ─── Section header button (clickable heading) ────────────────────────────
  const SectionHeading = ({
    label,
    section,
  }: {
    label: string;
    section: FooterSection;
  }) => (
    <button
      type="button"
      onClick={() => openDrawer(section)}
      className="text-base font-bold leading-6 text-blue-600 hover:text-blue-800 transition-colors duration-150 text-left group flex items-center gap-1"
      aria-haspopup="dialog"
      aria-expanded={drawerOpen && drawerSection === section}
      id={`footer-section-${section.toLowerCase().replace(" ", "-")}`}
    >
      {label}
      <span
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs text-blue-400"
        aria-hidden="true"
      >
        ↗
      </span>
    </button>
  );

  // ─── Status label for the test button ────────────────────────────────────
  const statusLabel: Record<typeof eventStatus, string> = {
    idle: "🚀 Fire Test Event",
    firing: "⏳ Firing…",
    success: "✅ Event Fired!",
    error: "❌ Error — check console",
  };

  const statusColor: Record<typeof eventStatus, string> = {
    idle: "#2563eb",
    firing: "#6b7280",
    success: "#16a34a",
    error: "#dc2626",
  };

  return (
    <>
      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-white" aria-labelledby="footer-heading">
        <div>
          <h2 id="footer-heading" className="sr-only">
            Footer
          </h2>

          <div className="mx-auto max-w-screen-2xl px-6 lg:px-8 pt-24 pb-14">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <Image
                src="/logo v1.png"
                alt="Singitronic logo"
                width={250}
                height={250}
                className="h-auto w-auto"
              />

              <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  {/* Sale */}
                  <div>
                    <h3 className="text-lg font-bold leading-6 text-blue-600">Sale</h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.sale.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => trackFooterClick(item.name, item.href, "Sale")}
                            className="text-sm leading-6 text-black hover:text-gray-700"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      {activeOffers.map((offer) => (
                        <li key={offer.id}>
                          <Link
                            href={`/offers?offerId=${offer.id}`}
                            onClick={() =>
                              trackFooterClick(
                                offer.name,
                                `/offers?offerId=${offer.id}`,
                                "Sale"
                              )
                            }
                            className="text-sm leading-6 text-black hover:text-gray-700"
                          >
                            {offer.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* About Us — clickable heading */}
                  <div className="mt-10 md:mt-0">
                    <SectionHeading label="About Us" section="About Us" />
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.about.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => trackFooterClick(item.name, item.href, "About Us")}
                            className="text-sm leading-6 text-black hover:text-gray-700"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="md:grid md:grid-cols-2 md:gap-8">
                  {/* Buying — clickable heading */}
                  <div>
                    <SectionHeading label="Buying" section="Buying" />
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.buy.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => trackFooterClick(item.name, item.href, "Buying")}
                            className="text-sm leading-6 text-black hover:text-gray-700"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Support — clickable heading */}
                  <div className="mt-10 md:mt-0">
                    <SectionHeading label="Support" section="Support" />
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.help.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => trackFooterClick(item.name, item.href, "Support")}
                            className="text-sm leading-6 text-black hover:text-gray-700"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Overlay ────────────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(2px)",
            zIndex: 49,
            transition: "opacity 0.2s",
          }}
        />
      )}

      {/* ─── Slide-up Drawer ────────────────────────────────────────────────── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${drawerSection} test panel`}
        id="footer-test-drawer"
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: drawerOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(110%)",
          transition: "transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)",
          zIndex: 50,
          width: "min(480px, 95vw)",
          background: "#ffffff",
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
          padding: "28px 28px 36px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 9999,
            background: "#d1d5db",
            alignSelf: "center",
            marginBottom: 4,
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
              Analytics Test Panel
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
              {drawerSection}
            </h2>
          </div>
          <button
            onClick={() => { setDrawerOpen(false); setEventStatus("idle"); }}
            aria-label="Close panel"
            id="footer-drawer-close"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "#f3f4f6",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "#6b7280",
              transition: "background 0.15s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
          Click the button below to fire a dummy <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 4, fontSize: 12 }}>footer_section_test_event</code> via the cross-platform <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 4, fontSize: 12 }}>track()</code> utility.
          Works on both <strong>desktop</strong> (PostHog JS) and <strong>mobile</strong> (Capacitor native).
        </p>

        {/* Payload preview */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Payload preview</p>
          <pre style={{ fontSize: 11, color: "#334155", margin: 0, lineHeight: 1.7, overflowX: "auto" }}>
{`{
  event: "footer_section_test_event",
  section: "${drawerSection}",
  component: "Footer",
  triggered_from: "test_button",
  dummy_payload: {
    message: "This is a dummy test event",
    value: 42
  }
}`}
          </pre>
        </div>

        {/* Fire button */}
        <button
          id="footer-fire-test-event-btn"
          onClick={handleFireTestEvent}
          disabled={eventStatus === "firing"}
          style={{
            padding: "14px 0",
            borderRadius: 12,
            border: "none",
            background: statusColor[eventStatus],
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 700,
            cursor: eventStatus === "firing" ? "not-allowed" : "pointer",
            transition: "background 0.25s, transform 0.1s",
            letterSpacing: "0.02em",
            boxShadow: eventStatus === "idle" ? "0 4px 14px rgba(37,99,235,0.35)" : "none",
            transform: eventStatus === "firing" ? "scale(0.98)" : "scale(1)",
          }}
        >
          {statusLabel[eventStatus]}
        </button>

        {eventStatus === "success" && (
          <p style={{ fontSize: 12, color: "#16a34a", textAlign: "center", margin: 0 }}>
            ✓ Check your PostHog dashboard (or native plugin logs) to confirm the event arrived.
          </p>
        )}
      </div>
    </>
  );
};

export default Footer;
