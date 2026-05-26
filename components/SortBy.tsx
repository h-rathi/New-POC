// *********************
// Role of the component: SortBy
// Name of the component: SortBy.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.2 (GTM dataLayer added)
// *********************

"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const SortBy = () => {
  const { sortBy, changeSortBy } = useSortStore();
  const isLoggedIn = useIsLoggedInValue();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sortQuery = searchParams.get("sort");
    const shouldApplyFeatureFlag =
      sortBy === "defaultSort" &&
      (sortQuery === null || sortQuery === "defaultSort");

    if (!shouldApplyFeatureFlag) return;

    const featureFlag = posthog.getFeatureFlag("default-product-sort");
    const defaultSortBy = featureFlag === "test" ? "lowPrice" : "highPrice";

    changeSortBy(defaultSortBy);
  }, [searchParams, sortBy, changeSortBy]);

  const handleSortChange = (newSort: string) => {
    if (newSort !== sortBy) {
      const sortPayload = withIsLoggedIn({
        from_sort: sortBy,
        to_sort: newSort,
        component: "SortBy",
      }, isLoggedIn);

      posthog.capture("sort_changed", sortPayload);

      // 🔹 GTM dataLayer push (NEW)
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "sort_changed",
          ...sortPayload,
        });
      }
    }

    changeSortBy(newSort);
  };

  return (
    <div className="flex items-center gap-x-5 max-lg:flex-col max-lg:w-full max-lg:items-start">
      <h3 className="text-xl">Sort by:</h3>
      <select
        value={sortBy}
        onChange={(e) => handleSortChange(e.target.value)}
        className="select border-gray-400 py-2 px-2 text-base border-2 select-bordered w-40 focus:outline-none outline-none max-lg:w-full bg-white"
        name="sort"
      >
        <option value="defaultSort">Default</option>
        <option value="titleAsc">Sort A-Z</option>
        <option value="titleDesc">Sort Z-A</option>
        <option value="lowPrice">Lowest Price</option>
        <option value="highPrice">Highest Price</option>
      </select>
    </div>
  );
};

export default SortBy;