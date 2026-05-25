"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";
import { isLightColor } from "@/lib/utils";

interface Variant {
  id: string;
  slug: string;
  title: string;
  mainImage: string;
  price: number;
  inStock: number;
  manufacturer: string;
  variant_attributes: Record<string, string> | null;
}

interface Product {
  id: string;
  slug: string;
  variant_attributes: Record<string, string> | null;
}

interface VariantSelectorProps {
  product: Product;
  variants: Variant[];
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ product, variants }) => {
  const router = useRouter();
  const isLoggedIn = useIsLoggedInValue();

  // If no variants or just itself, don't show selector
  if (!variants || variants.length <= 1) {
    return null;
  }

  // 1. Extract all available attributes and their unique values
  const attributeMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};

    variants.forEach((v) => {
      if (v.variant_attributes) {
        Object.entries(v.variant_attributes).forEach(([key, value]) => {
          if (!map[key]) {
            map[key] = new Set();
          }
          if (value) {
            map[key].add(value as string);
          }
        });
      }
    });

    const result: Record<string, string[]> = {};
    for (const key in map) {
      result[key] = Array.from(map[key]).sort((a, b) => {
        // Natural sort for numeric-like values
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB) && a.match(/^\d/) && b.match(/^\d/)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });
    }
    return result;
  }, [variants]);

  // 2. Separate into selectable variants and static specifications using heuristics
  const selectableAttributes: Record<string, string[]> = {};
  const staticAttributes: Record<string, string> = {};

  // Lightweight exclusion hints for obvious technical specifications
  const exclusionHints = ["battery", "processor", "frequency", "response", "driver", "water"];

  Object.entries(attributeMap).forEach(([key, values]) => {
    // 1. Check for exclusion hints
    const lowerKey = key.toLowerCase();
    const isExcludedByHint = exclusionHints.some(hint => lowerKey.includes(hint));

    // 2. Analyze value metrics
    const avgLength = values.reduce((sum, val) => sum + (val?.toString().length || 0), 0) / (values.length || 1);
    
    // 3. Intelligent Classification Heuristic
    const isSelector = 
      values.length > 1 &&           // Must have multiple options to select from
      !isExcludedByHint &&           // Must not be an obvious technical spec
      values.length <= 15 &&         // Value count must be reasonably small for a UI selector
      avgLength < 25;                // Values should be short, punchy options (not long descriptions)

    if (isSelector) {
      selectableAttributes[key] = values;
    } else {
      // For technical specifications, use the current product's specific value if it exists,
      // otherwise fallback to the first available value in the group.
      const currentProductValue = (product.variant_attributes || {})[key];
      if (currentProductValue || values.length > 0) {
        staticAttributes[key] = currentProductValue || values[0];
      }
    }
  });

  // 3. Handle selection logic
  const handleOptionSelect = (attributeKey: string, newValue: string) => {
    const currentAttributes = { ...(product.variant_attributes || {}) };
    currentAttributes[attributeKey] = newValue;

    const selectableKeys = Object.keys(selectableAttributes);
    const currentIndex = selectableKeys.indexOf(attributeKey);
    const primaryKeys = selectableKeys.slice(0, currentIndex + 1);

    // Try to find an exact match for all selected attributes first
    let match = variants.find(v => {
      const vAttrs = v.variant_attributes || {};
      return selectableKeys.every(key => vAttrs[key] === currentAttributes[key]);
    });

    // If no perfect match exists, auto-resolve to the nearest valid variant
    // that matches the hierarchy up to the newly selected attribute
    if (!match) {
      match = variants.find(v => {
        const vAttrs = v.variant_attributes || {};
        return primaryKeys.every(key => vAttrs[key] === currentAttributes[key]);
      });
    }

    if (match && match.slug !== product.slug) {
      const getVariantGroupTitle = (title: string) => {
        if (!title) return "";
        return title.replace(/\s+Variant\s+\d+$/i, "").trim();
      };

      const variantSelectedPayload = withIsLoggedIn({
        product_id: product.id,
        current_product_slug: product.slug,
        product_group_title: getVariantGroupTitle((product as any).title || ""),
        attribute_name: attributeKey,
        selected_option: newValue,
        target_variant_slug: match.slug,
        target_variant_id: match.id,
        component: "VariantSelector",
      }, isLoggedIn);

      posthog.capture("variant_selected", variantSelectedPayload);

      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "variant_selected",
          ...variantSelectedPayload,
        });
      }

      router.push(`/product/${match.slug}`);
    }
  };

  // If no attributes to show, render nothing
  if (Object.keys(attributeMap).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 my-6">
      
      {/* Selectable Variant Options */}
      {Object.keys(selectableAttributes).length > 0 && (
        <div className="flex flex-col gap-6">
          {Object.entries(selectableAttributes).map(([attrKey, values]) => {
            const currentValue = (product.variant_attributes || {})[attrKey];

            return (
              <div key={attrKey} className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  {attrKey} <span className="text-gray-400 font-normal">|</span> <span className="text-blue-600 font-medium normal-case">{currentValue || "Select"}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {values.map((val) => {
                    const isSelected = currentValue === val;
                    // Check if a variant exists with this value and all higher-priority attributes
                    const selectableKeys = Object.keys(selectableAttributes);
                    const attrIndex = selectableKeys.indexOf(attrKey);
                    const parentKeys = selectableKeys.slice(0, attrIndex);

                    const isStrictlyAvailable = variants.some(v => {
                      const vAttrs = v.variant_attributes || {};
                      const currentAttrs = { ...(product.variant_attributes || {}) };
                      
                      if (vAttrs[attrKey] !== val) return false;
                      
                      return parentKeys.every(k => vAttrs[k] === currentAttrs[k]);
                    });

                    const isColorAttr = attrKey.toLowerCase() === 'color';

                    if (isColorAttr) {
                      const isLight = isLightColor(val);
                      return (
                        <button
                          key={val}
                          onClick={() => handleOptionSelect(attrKey, val)}
                          disabled={!isStrictlyAvailable && !isSelected}
                          className={`
                            w-8 h-8 rounded-full transition-all duration-300 shadow-sm
                            ${isLight ? 'border border-gray-300' : 'border border-gray-200'}
                            ${isSelected 
                              ? `ring-2 ring-blue-500 ring-offset-2 scale-110 ${isLight ? '' : 'border-blue-500'}` 
                              : isStrictlyAvailable 
                                ? 'hover:scale-110' 
                                : 'opacity-30 cursor-not-allowed'}
                          `}
                          style={{ backgroundColor: val.toLowerCase().replace(/ /g, '') }}
                          title={!isStrictlyAvailable ? "This combination is currently unavailable" : val}
                        />
                      );
                    }

                    return (
                      <button
                        key={val}
                        onClick={() => handleOptionSelect(attrKey, val)}
                        disabled={!isStrictlyAvailable && !isSelected}
                        className={`
                          px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 border
                          ${isSelected 
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200/50 scale-105" 
                            : isStrictlyAvailable 
                              ? "bg-white text-gray-800 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/30 hover:shadow-sm" 
                              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"}
                        `}
                        title={!isStrictlyAvailable ? "This combination is currently unavailable" : ""}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default VariantSelector;
