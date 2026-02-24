// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic (modified by Copilot)
// Version: 1.1 – now accepts categorySlug prop and supports query fallback
// Component call: <Products categorySlug={slug} searchParams={searchParams} />
// Input parameters: { categorySlug, searchParams }
//    categorySlug - optional string extracted from the catch‑all `slug` or query
//    searchParams - raw query string parameters from the URL
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";

interface ProductsProps {
  categorySlug: string | null;
  searchParams: { [key: string]: string | string[] | undefined };
}

const Products = async ({ categorySlug, searchParams }: ProductsProps) => {
  // getting all data from URL slug and preparing everything for sending GET request
  const inStockNum = searchParams?.inStock === "true" ? 1 : 0;
  const outOfStockNum = searchParams?.outOfStock === "true" ? 1 : 0;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  let stockMode: string = "lte";
  
  // preparing inStock and out of stock filter for GET request
  // If in stock checkbox is checked, stockMode is "equals"
  if (inStockNum === 1) {
    stockMode = "equals";
  }
 // If out of stock checkbox is checked, stockMode is "lt"
  if (outOfStockNum === 1) {
    stockMode = "lt";
  }
   // If in stock and out of stock checkboxes are checked, stockMode is "lte"
  if (inStockNum === 1 && outOfStockNum === 1) {
    stockMode = "lte";
  }
   // If in stock and out of stock checkboxes aren't checked, stockMode is "gt"
  if (inStockNum === 0 && outOfStockNum === 0) {
    stockMode = "gt";
  }

  let products = [];

  try {
    // determine which category we should filter by; this value will
    // be logged so that it's easier to debug client behavior.
    let slug = categorySlug;
    if (!slug && typeof searchParams.category === "string") {
      slug = searchParams.category;
    }

    // build the url before firing the request so we can inspect it in devtools
    const url = `/api/products?filters[price][$lte]=${
      searchParams?.price || 3000
    }&filters[rating][$gte]=${
      Number(searchParams?.rating) || 0
    }&filters[inStock][$${stockMode}]=1${
      slug ? `&filters[category][$equals]=${encodeURIComponent(slug)}` : ""
    }&sort=${searchParams?.sort || 'defaultSort'}&page=${page}`;

    // debug output for developers
    console.debug('Products component fetching', url, 'slug=', slug);

    const data = await apiClient.get(url);

    if (!data.ok) {
      console.error('Failed to fetch products:', data.statusText);
      products = [];
    } else {
      const result = await data.json();
      products = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductItem key={product.id} product={product} color="black" />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;
