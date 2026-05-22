// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.3 (GTM dataLayer added)
// *********************

"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { sanitize } from "@/lib/sanitize";
import { PriceRenderer } from "@/components";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  const isLoggedIn = useIsLoggedInValue();
  const [selectedVariant, setSelectedVariant] = useState<any>(product);

  const getPrice = (v: any) => (v.discountedPrice < v.price && v.discountedPrice > 0) ? v.discountedPrice : v.price;
  const minPrice = getPrice(product);
  const currentPrice = getPrice(selectedVariant);
  const showOnwards = currentPrice === minPrice && (product as any).variantsList && (product as any).variantsList.length > 1;

  const handleProductClick = (
    click_source: "image" | "title" | "cta"
  ) => {
    const productClickPayload = withIsLoggedIn({
      product_id: selectedVariant.id,
      product_slug: selectedVariant.slug,
      product_name: selectedVariant.title,
      price: selectedVariant.price,
      currency: "USD",
      click_source,
      source: "product_grid",
      component: "ProductItem",
    }, isLoggedIn);

    posthog.capture("product_clicked", productClickPayload);

      // 🔹 GTM dataLayer push (NEW)
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "product_clicked",
          ...productClickPayload,
        });
      }
    };
  
    const handleVariantSwatchClick = (targetVariant: any, targetColor: string) => {
      // Do NOT fire tracking when user clicks already-selected swatch
      if (selectedVariant.id === targetVariant.id) return;
  
      let previousColor = "";
      if (selectedVariant._colorStr) {
        previousColor = selectedVariant._colorStr;
      } else if (selectedVariant.variant_attributes) {
        let attrs = selectedVariant.variant_attributes;
        if (typeof attrs === 'string') {
          try { attrs = JSON.parse(attrs); } catch (e) {}
        }
        if (typeof attrs === 'object' && attrs !== null) {
          const colorKey = Object.keys(attrs).find(k => k.toLowerCase() === 'color');
          if (colorKey) previousColor = attrs[colorKey];
        }
      }
  
      const plpVariantPayload = withIsLoggedIn({
        current_displayed_product_slug: selectedVariant.slug,
        target_variant_slug: targetVariant.slug,
        product_group_title: (product as any).displayTitle || product.title.replace(/\s+Variant\s+\d+$/i, "").trim(),
        selected_color: targetColor,
        category: (product as any).category?.name || "",
        previous_selected_color: previousColor,
        product_title: targetVariant.title,
        price: targetVariant.price,
        component: "ProductItem",
        source: "plp_variant_swatch"
      }, isLoggedIn);
  
      posthog.capture("plp_variant_selected", plpVariantPayload);
  
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "plp_variant_selected",
          ...plpVariantPayload,
        });
      }
  
      setSelectedVariant(targetVariant);
    };
  
    return (
      <div className="flex flex-col items-center gap-y-2">
      {/* Image with Top Left Discount Pill */}
      <Link
        href={selectedVariant?.slug === "Xiaomi Pad 6 Variant 4" || selectedVariant?.slug === "xiaomi-pad-6-variant-4" ? `/product-landing/${selectedVariant.slug}` : `/product/${selectedVariant.slug}`}
        onClick={() => handleProductClick("image")}
        className="relative flex h-[250px] w-full items-center justify-center overflow-hidden bg-white p-4"
      >
        {selectedVariant.discountType && selectedVariant.discountValue !== undefined && (
          <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white px-2.5 py-1 rounded-full shadow-sm pointer-events-none">
            <p className="text-xs font-normal leading-none tracking-wide">
              Sale
            </p>
          </div>
        )}
        <div className="relative flex h-full w-full items-center justify-center">
          <Image
            src={
              selectedVariant.mainImage
                ? selectedVariant.mainImage.startsWith("http://") ||
                  selectedVariant.mainImage.startsWith("https://")
                  ? selectedVariant.mainImage
                  : `/${selectedVariant.mainImage}`
                : "/product_placeholder.jpg"
            }
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-contain p-2"
            style={{ maxWidth: "88%", maxHeight: "88%", margin: "auto" }}
            alt={sanitize(selectedVariant?.title) || "Product image"}
            unoptimized={
              selectedVariant.mainImage?.startsWith("http://") ||
              selectedVariant.mainImage?.startsWith("https://")
            }
          />
        </div>
      </Link>

      {/* Title */}
      <Link
        href={selectedVariant?.slug === "Xiaomi Pad 6 Variant 4" || selectedVariant?.slug === "xiaomi-pad-6-variant-4" ? `/product-landing/${selectedVariant.slug}` : `/product/${selectedVariant.slug}`}
        onClick={() => handleProductClick("title")}
        className={
          color === "black"
            ? "text-xl text-black font-normal mt-2 uppercase text-center"
            : "text-xl text-white font-normal mt-2 uppercase text-center"
        }
      >
        {sanitize((product as any).displayTitle || product.title)}
      </Link>

      {/* Variant Preview */}
      {(product as any).variantsList && (product as any).variantsList.length > 1 && (() => {
        const uniqueColorVariantsMap = new Map();
        (product as any).variantsList.forEach((v: any) => {
          let colorStr = null;
          if (v.variant_attributes) {
            let attrs = v.variant_attributes;
            if (typeof attrs === 'string') {
              try { attrs = JSON.parse(attrs); } catch (e) {}
            }
            if (typeof attrs === 'object' && attrs !== null) {
              const colorKey = Object.keys(attrs).find(k => k.toLowerCase() === 'color');
              if (colorKey) colorStr = attrs[colorKey];
            }
          }
          if (colorStr && !uniqueColorVariantsMap.has(colorStr.toLowerCase())) {
            uniqueColorVariantsMap.set(colorStr.toLowerCase(), { ...v, _colorStr: colorStr });
          }
        });
        const colorVariants = Array.from(uniqueColorVariantsMap.values());
        colorVariants.sort((a: any, b: any) => {
          const priceA = getPrice(a);
          const priceB = getPrice(b);
          if (priceA === priceB) {
            return a.id === product.id ? -1 : (b.id === product.id ? 1 : 0);
          }
          return priceA - priceB;
        });

        if (colorVariants.length <= 1) return null;

        return (
          <div className="flex flex-col items-center mt-1">
            <div className="flex gap-1.5 mt-0.5">
              {colorVariants.map((v: any, idx: number) => {
                const colorStr = v._colorStr;
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button 
                    key={idx} 
                    title={colorStr} 
                    onClick={(e) => {
                      e.preventDefault();
                      handleVariantSwatchClick(v, colorStr);
                    }}
                    className={`w-4 h-4 rounded-full border shadow-sm transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 border-blue-500' : 'border-gray-300 hover:scale-110'}`} 
                    style={{ backgroundColor: colorStr.toLowerCase().replace(/ /g, '') }} 
                  />
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Price */}
      <div className="flex items-center justify-center gap-1.5">
        <PriceRenderer
          price={selectedVariant.price}
          discountedPrice={selectedVariant.discountedPrice}
          hasDiscount={selectedVariant.hasDiscount || !!selectedVariant.originalPrice}
          discountType={selectedVariant.discountType}
          discountValue={selectedVariant.discountValue}
          color={color}
          fontSize="lg"
        />
        {showOnwards && (
          <span className="text-sm font-medium text-gray-500 italic mt-0.5">onwards</span>
        )}
      </div>

      {/* Offer Subtitle */}
      {selectedVariant.offerName && (
        <div className="flex justify-center w-full mb-1 mt-1">
          <span className="text-blue-900 font-semibold text-sm inline-block truncate max-w-[90%] italic" title={selectedVariant.offerName}>
            {selectedVariant.offerName}
          </span>
        </div>
      )}

      {/* CTA */}
      <Link
        href={selectedVariant?.slug === "Xiaomi Pad 6 Variant 4" || selectedVariant?.slug === "xiaomi-pad-6-variant-4" ? `/product-landing/${selectedVariant.slug}` : `/product/${selectedVariant.slug}`}
        onClick={() => handleProductClick("cta")}
        className="block flex justify-center items-center w-full uppercase bg-white px-0 py-2 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2"
      >
        <p>View product</p>
      </Link>
    </div>
  );
};

export default ProductItem;