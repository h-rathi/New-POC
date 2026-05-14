// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.3 (GTM dataLayer added)
// *********************

"use client";

import Image from "next/image";
import React from "react";
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

  const handleProductClick = (
    click_source: "image" | "title" | "cta"
  ) => {
    const productClickPayload = withIsLoggedIn({
      product_id: product.id,
      product_slug: product.slug,
      product_name: product.title,
      price: product.price,
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

  return (
    <div className="flex flex-col items-center gap-y-2">
      {/* Image with Top Left Discount Pill */}
      <Link
        href={product?.slug === "Xiaomi Pad 6 Variant 4" || product?.slug === "xiaomi-pad-6-variant-4" ? `/product-landing/${product.slug}` : `/product/${product.slug}`}
        onClick={() => handleProductClick("image")}
        className="relative flex h-[250px] w-full items-center justify-center overflow-hidden bg-white p-4"
      >
        {product.discountType && product.discountValue !== undefined && (
          <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white px-2.5 py-1 rounded-full shadow-sm pointer-events-none">
            <p className="text-xs font-normal leading-none tracking-wide">
              Sale
            </p>
          </div>
        )}
        <div className="relative flex h-full w-full items-center justify-center">
          <Image
            src={
              product.mainImage
                ? product.mainImage.startsWith("http://") ||
                  product.mainImage.startsWith("https://")
                  ? product.mainImage
                  : `/${product.mainImage}`
                : "/product_placeholder.jpg"
            }
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-contain p-2"
            style={{ maxWidth: "88%", maxHeight: "88%", margin: "auto" }}
            alt={sanitize(product?.title) || "Product image"}
            unoptimized={
              product.mainImage?.startsWith("http://") ||
              product.mainImage?.startsWith("https://")
            }
          />
        </div>
      </Link>

      {/* Title */}
      <Link
        href={product?.slug === "Xiaomi Pad 6 Variant 4" || product?.slug === "xiaomi-pad-6-variant-4" ? `/product-landing/${product.slug}` : `/product/${product.slug}`}
        onClick={() => handleProductClick("title")}
        className={
          color === "black"
            ? "text-xl text-black font-normal mt-2 uppercase"
            : "text-xl text-white font-normal mt-2 uppercase"
        }
      >
        {sanitize(product.title)}
      </Link>

      {/* Price */}
      <PriceRenderer
        price={product.price}
        discountedPrice={product.discountedPrice}
        hasDiscount={product.hasDiscount || !!product.originalPrice}
        discountType={product.discountType}
        discountValue={product.discountValue}
        color={color}
        fontSize="lg"
      />

      {/* Offer Subtitle */}
      {product.offerName && (
        <div className="flex justify-center w-full mb-1 mt-1">
          <span className="text-blue-900 font-semibold text-sm inline-block truncate max-w-[90%] italic" title={product.offerName}>
            {product.offerName}
          </span>
        </div>
      )}

      {/* CTA */}
      <Link
        href={product?.slug === "Xiaomi Pad 6 Variant 4" || product?.slug === "xiaomi-pad-6-variant-4" ? `/product-landing/${product.slug}` : `/product/${product.slug}`}
        onClick={() => handleProductClick("cta")}
        className="block flex justify-center items-center w-full uppercase bg-white px-0 py-2 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2"
      >
        <p>View product</p>
      </Link>
    </div>
  );
};

export default ProductItem;