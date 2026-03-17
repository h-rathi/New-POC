// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.2 (Click-only analytics)
// *********************

"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { sanitize } from "@/lib/sanitize";
import { PriceRenderer } from "@/components";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  const handleProductClick = (
    click_source: "image" | "title" | "cta"
  ) => {
    posthog.capture("product_clicked", {
      product_id: product.id,
      product_slug: product.slug,
      product_name: product.title,
      price: product.price,
      currency: "USD", // change if needed
      click_source,
      source: "product_grid",
      component: "ProductItem",
    });
  };

  return (
    <div className="flex flex-col items-center gap-y-2">
      {/* Image with Top Left Discount Pill */}
      <Link
        href={`/product/${product.slug}`}
        onClick={() => handleProductClick("image")}
        className="relative block"
      >
        {product.discountType && product.discountValue !== undefined && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-1 rounded-full shadow-sm pointer-events-none">
            <p className="text-xs font-bold leading-none tracking-wide">
              {product.discountType === "PERCENTAGE" 
                ? `-${product.discountValue}%` 
                : `$${product.discountValue} OFF`}
            </p>
          </div>
        )}
        <Image
          src={
            product.mainImage
              ? product.mainImage.startsWith("http://") ||
                product.mainImage.startsWith("https://")
                ? product.mainImage
                : `/${product.mainImage}`
              : "/product_placeholder.jpg"
          }
          width="0"
          height="0"
          sizes="100vw"
          className="w-auto h-[300px]"
          alt={sanitize(product?.title) || "Product image"}
          unoptimized={
            product.mainImage?.startsWith("http://") ||
            product.mainImage?.startsWith("https://")
          }
        />
      </Link>

      {/* Title */}
      <Link
        href={`/product/${product.slug}`}
        onClick={() => handleProductClick("title")}
        className={
          color === "black"
            ? "text-xl text-black font-normal mt-2 uppercase"
            : "text-xl text-white font-normal mt-2 uppercase"
        }
      >
        {sanitize(product.title)}
      </Link>

      {/* Offer Subtitle (Amazon-style Red Tag) */}
      {product.offerName && (
        <span className="bg-red-600 text-white font-semibold text-[11px] px-2 py-0.5 rounded-sm mb-1 inline-block truncate max-w-[90%]" title={product.offerName}>
          {product.offerName}
        </span>
      )}

      {/* Price */}
      <PriceRenderer 
        price={product.price}
        discountedPrice={product.discountedPrice}
        hasDiscount={product.hasDiscount || !!product.originalPrice} // preserve originalPrice for backward compat if Offers page manually injected it
        color={color}
        fontSize="lg"
      />

      {/* CTA */}
      <Link
        href={`/product/${product.slug}`}
        onClick={() => handleProductClick("cta")}
        className="block flex justify-center items-center w-full uppercase bg-white px-0 py-2 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2"
      >
        <p>View product</p>
      </Link>
    </div>
  );
};

export default ProductItem;
