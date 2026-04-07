// *********************
// Role of the component: Filters on shop page
// Name of the component: Filters.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.2 (Category filter + reorder)
// *********************

"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { categoryMenuList } from "@/lib/utils";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  discounted: { text: string; isChecked: boolean };
  nonDiscounted: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const categoryOptions = categoryMenuList.map((item) => ({
  id: item.id,
  label: item.title,
  value: item.href.replace("/shop/", ""),
}));

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const isLoggedIn = useIsLoggedInValue();
  const showCategoryFilter = pathname === "/shop";

  const { page } = usePaginationStore();
  const { sortBy } = useSortStore();

  const captureFilterChanged = (payload: Record<string, unknown>) => {
    const filterPayload = withIsLoggedIn(payload, isLoggedIn);

    posthog.capture("filter_changed", filterPayload);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "filter_changed",
        ...filterPayload,
      });
    }
  };

  // derive initial filter state from query parameters so manual links
  // or bookmarks carrying filter values are respected on first render
  const initialFilters = (): InputCategory => {
    const getBool = (key: string, defaultVal: boolean) => {
      const val = searchParams.get(key);
      if (val === null) return defaultVal;
      return val === "true";
    };

    const getNum = (key: string, defaultVal: number) => {
      const val = searchParams.get(key);
      const n = Number(val);
      return !isNaN(n) && val !== null ? n : defaultVal;
    };

    return {
      // default to showing in‑stock products unless user explicitly changes it
      inStock: { text: "instock", isChecked: getBool("inStock", true) },
      outOfStock: { text: "outofstock", isChecked: getBool("outOfStock", false) },
      discounted: { text: "discounted", isChecked: getBool("discounted", false) },
      nonDiscounted: { text: "nonDiscounted", isChecked: getBool("nonDiscounted", false) },
      priceFilter: { text: "price", value: getNum("price", 10000) },
      ratingFilter: { text: "rating", value: getNum("rating", 0) },
    };
  };

  const [inputCategory, setInputCategory] = useState<InputCategory>(initialFilters);

  // Category dropdown state — read initial value from URL so bookmarks / back
  // navigation work correctly.
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") ?? ""
  );

  // Sync filters to URL (unchanged)
  // when URL search params change externally we should update the
  // controlled filter state so the UI reflects them (e.g. back button,
  // bookmarked link, category selection that includes filter values).
  useEffect(() => {
    setInputCategory(initialFilters());
    setSelectedCategory(searchParams.get("category") ?? "");
  }, [searchParams]);

  useEffect(() => {
    // build from the current params object which already holds any
    // unrelated keys (category, etc) so they are preserved during the
    // replace call.
    const params = new URLSearchParams(searchParams.toString());

    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("discounted", inputCategory.discounted.isChecked.toString());
    params.set("nonDiscounted", inputCategory.nonDiscounted.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());

    // category filter — remove param entirely when no category is chosen
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    replace(`${pathname}?${params}`);
  }, [inputCategory, sortBy, page, selectedCategory, searchParams]);

  return (
    <div>
      <h3 className="text-2xl mb-2">Filters</h3>
      <div className="divider"></div>

      {/* 1 — Price */}
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Price</h3>
        <input
          type="range"
          min={0}
          max={10000}
          step={20}
          value={inputCategory.priceFilter.value}
          className="range"
          onChange={(e) => {
            const value = Number(e.target.value);

            setInputCategory({
              ...inputCategory,
              priceFilter: { text: "price", value },
            });

            captureFilterChanged({
              filter_type: "price",
              value,
              component: "Filters",
            });
          }}
        />
        <span>{`Max price: $${inputCategory.priceFilter.value}`}</span>
      </div>

      <div className="divider"></div>

      {/* 2 — Category */}
      {showCategoryFilter ? (
        <>
          <div className="flex flex-col gap-y-1 mb-2">
            <h3 className="text-xl mb-2">Category</h3>
            <select
              className="select select-bordered w-full text-base"
              value={selectedCategory}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategory(value);
                captureFilterChanged({
                  filter_type: "category",
                  value,
                  component: "Filters",
                });
              }}
            >
              <option value="">All Categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="divider"></div>
        </>
      ) : null}

      {/* 3 — Discounted Products */}
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Discounted Products</h3>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.discounted.isChecked}
              onChange={() => {
                const newValue = !inputCategory.discounted.isChecked;

                setInputCategory({
                  ...inputCategory,
                  discounted: { text: "discounted", isChecked: newValue },
                  // Exclusive logic: if we check this, uncheck the other
                  nonDiscounted: newValue ? { text: "nonDiscounted", isChecked: false } : inputCategory.nonDiscounted
                });

                captureFilterChanged({
                  filter_type: "discounted",
                  value: newValue,
                  component: "Filters",
                });
              }}
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">
              Discounted
            </span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.nonDiscounted.isChecked}
              onChange={() => {
                const newValue = !inputCategory.nonDiscounted.isChecked;

                setInputCategory({
                  ...inputCategory,
                  nonDiscounted: { text: "nonDiscounted", isChecked: newValue },
                  // Exclusive logic: if we check this, uncheck the other
                  discounted: newValue ? { text: "discounted", isChecked: false } : inputCategory.discounted
                });

                captureFilterChanged({
                  filter_type: "non_discounted",
                  value: newValue,
                  component: "Filters",
                });
              }}
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">
              Non-Discounted
            </span>
          </label>
        </div>
      </div>

      <div className="divider"></div>

      {/* 4 — Availability */}
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Availability</h3>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() => {
                const newValue = !inputCategory.inStock.isChecked;

                setInputCategory({
                  ...inputCategory,
                  inStock: { text: "instock", isChecked: newValue },
                });

                captureFilterChanged({
                  filter_type: "in_stock",
                  value: newValue,
                  component: "Filters",
                });
              }}
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">
              In stock
            </span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() => {
                const newValue = !inputCategory.outOfStock.isChecked;

                setInputCategory({
                  ...inputCategory,
                  outOfStock: { text: "outofstock", isChecked: newValue },
                });

                captureFilterChanged({
                  filter_type: "out_of_stock",
                  value: newValue,
                  component: "Filters",
                });
              }}
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">
              Out of stock
            </span>
          </label>
        </div>
      </div>

      <div className="divider"></div>

      {/* 5 — Rating */}
      <div>
        <h3 className="text-xl mb-2">Minimum Rating:</h3>
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={inputCategory.ratingFilter.value}
          onChange={(e) => {
            const value = Number(e.target.value);

            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value },
            });

            captureFilterChanged({
              filter_type: "rating",
              value,
              component: "Filters",
            });
          }}
          className="range range-info"
        />
        <div className="w-full flex justify-between text-xs px-2">
          <span>0</span><span>1</span><span>2</span>
          <span>3</span><span>4</span><span>5</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
