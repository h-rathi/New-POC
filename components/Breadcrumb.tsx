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

const Breadcrumb = () => {
  const trackBreadcrumbClick = (
    label: string,
    destination: string,
    position: number
  ) => {
    posthog.capture("breadcrumb_clicked", {
      label,
      destination,
      position,
      component: "Breadcrumb",
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
