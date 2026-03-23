// *********************
// Role of the component: Component that displays current page location in the application 
// Name of the component: Breadcrumb.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 (PostHog tracking added)
// *********************

"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHouse } from "react-icons/fa6";
import posthog from "posthog-js";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { getIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";
import { sanitize } from "@/lib/sanitize";
import { formatCategoryName } from "@/utils/categoryFormating";
import { formatTitle } from "@/lib/utils";

const Breadcrumb = () => {
  const { data: session } = useSession();
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const isLoggedIn = getIsLoggedInValue(session);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create guest session if user is not logged in
  useEffect(() => {
    if (!session) {
      let guestId = localStorage.getItem("guestSessionId");

      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestSessionId", guestId);
      }

      setGuestSessionId(guestId);
    }
  }, [session]);

  const trackBreadcrumbClick = (
    label: string,
    destination: string,
    position: number
  ) => {
    const effectiveSessionId =
      (session as any)?.sessionId ?? guestSessionId ?? null;

    const userId = session?.user?.id ?? null;

    posthog.capture("breadcrumb_clicked", withIsLoggedIn({
      label,
      destination,
      position,
      component: "Breadcrumb",
      sessionId: effectiveSessionId,
      userId,
    }, isLoggedIn));
  };

  const getLastCrumb = () => {
    if (pathname === "/offers") {
      return {
        label: "Offers",
        href: "/offers",
      };
    }

    if (pathname === "/shop") {
      const selectedCategory = searchParams.get("category");

      if (selectedCategory) {
        return {
          label: formatTitle(sanitize(formatCategoryName(selectedCategory))),
          href: `/shop?${searchParams.toString()}`,
        };
      }

      return {
        label: "All Products",
        href: "/shop",
      };
    }

    if (pathname.startsWith("/shop/")) {
      const categorySlug = pathname.split("/").filter(Boolean)[1];

      if (categorySlug) {
        return {
          label: formatTitle(sanitize(formatCategoryName(categorySlug))),
          href: pathname,
        };
      }
    }

    return null;
  };

  const lastCrumb = getLastCrumb();

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

        {lastCrumb ? (
          <li>
            <Link
              href={lastCrumb.href}
              onClick={() =>
                trackBreadcrumbClick(lastCrumb.label, lastCrumb.href, 3)
              }
            >
              {lastCrumb.label}
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default Breadcrumb;
