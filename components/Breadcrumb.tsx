// *********************
// Role of the component: Component that displays current page location in the application 
// Name of the component: Breadcrumb.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 (PostHog tracking added)
// *********************

"use client";

import Link from "next/link";
import React from "react";
import { FaHouse } from "react-icons/fa6";
import posthog from "posthog-js";
import { useSession } from "next-auth/react";

const Breadcrumb = () => {
  const { data: session } = useSession();
  const trackBreadcrumbClick = (
    label: string,
    destination: string,
    position: number
  ) => {
    const effectiveSessionId = (session as any)?.sessionId ?? null;
    const userId = session?.user?.id ?? null;

    posthog.capture("breadcrumb_clicked", {
      label,
      destination,
      position,
      component: "Breadcrumb",
      sessionId: effectiveSessionId,
      userId,
    });
  };

  return (
    <div className="text-lg breadcrumbs pb-10 py-5 max-sm:text-base">
      <ul>
        <li>
          <Link
            href="/"
            onClick={() => trackBreadcrumbClick("Home", "/", 1)}
          >
            <FaHouse className="mr-2" />
            Home
          </Link>
        </li>

        <li>
          <Link
            href="/shop"
            onClick={() => trackBreadcrumbClick("Shop", "/shop", 2)}
          >
            Shop
          </Link>
        </li>

        <li>
          <Link
            href="/shop"
            onClick={() =>
              trackBreadcrumbClick("All products", "/shop", 3)
            }
          >
            All products
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
