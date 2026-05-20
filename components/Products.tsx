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
import PaginationSync from "./PaginationSync";

interface ProductsProps {
  categorySlug: string | null;
  searchParams: { [key: string]: string | string[] | undefined };
}

const Products = async ({ categorySlug, searchParams }: ProductsProps) => {
  // getting all data from URL slug and preparing everything for sending GET request
  // determine checkbox states as booleans (simpler than numeric flags)
  const inStockChecked = searchParams?.inStock === "true";
  const outOfStockChecked = searchParams?.outOfStock === "true";
  const discountedChecked = searchParams?.discounted === "true";
  const nonDiscountedChecked = searchParams?.nonDiscounted === "true";
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  // build a filter segment for the stock field.  The API is simpler when we
  // omit the `inStock` filter entirely (yielding all products) when both
  // options are selected or when none are selected.  Individual cases map to:
  //   inStock only   => inStock > 0
  //   outOfStock only=> inStock == 0
  // others         => no constraint
  let stockFilterParams = "";
  if (inStockChecked && !outOfStockChecked) {
    stockFilterParams = "&filters[inStock][$gt]=0";
  } else if (!inStockChecked && outOfStockChecked) {
    stockFilterParams = "&filters[inStock][$equals]=0";
  }

  let discountFilterParams = "";
  if (discountedChecked && !nonDiscountedChecked) {
    discountFilterParams = "&filters[hasDiscount][$equals]=true";
  } else if (!discountedChecked && nonDiscountedChecked) {
    discountFilterParams = "&filters[hasDiscount][$equals]=false";
  }

  let products = [];

  // determine which category we should filter by; this value will
  // be logged so that it's easier to debug client behavior.
  let slug = categorySlug;
  if (!slug && typeof searchParams.category === "string") {
    slug = searchParams.category;
  }

  try {
    // build the url before firing the request so we can inspect it in devtools
    const url = `/api/products?filters[price][$lte]=${searchParams?.price || 10000
      }&filters[rating][$gte]=${Number(searchParams?.rating) || 0
      }${stockFilterParams}${discountFilterParams}${slug ? `&filters[category][$equals]=${encodeURIComponent(slug)}` : ""
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

  let finalProducts = products;

  // Only group variants if we are NOT on a specific category page
  if (!slug) {
    // Helper to normalize title
    const getVariantGroupTitle = (title: string) => {
      if (!title) return "";
      return title.replace(/\s+Variant\s+\d+$/i, "").trim();
    };

    // Group products by normalized title
    const groupedProductsMap = new Map<string, any>();

    products.forEach((product: any) => {
      const groupTitle = getVariantGroupTitle(product.title);
      if (!groupedProductsMap.has(groupTitle)) {
        groupedProductsMap.set(groupTitle, {
          ...product,
          displayTitle: groupTitle,
          variantsList: [product],
        });
      } else {
        const group = groupedProductsMap.get(groupTitle);
        group.variantsList.push(product);
        
        // Prefer cheapest variant as representative
        const currentPrice = product.discountedPrice < product.price ? product.discountedPrice : product.price;
        const groupMinPrice = group.discountedPrice < group.price ? group.discountedPrice : group.price;
        
        if (currentPrice < groupMinPrice) {
          // Swap representative to the cheapest, but keep the accumulated variantsList
          groupedProductsMap.set(groupTitle, {
            ...product,
            displayTitle: groupTitle,
            variantsList: group.variantsList,
          });
        }
      }
    });

    finalProducts = Array.from(groupedProductsMap.values());
  }

  return (
    <>
      <PaginationSync hasMore={products.length >= 12} />
      <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
        {finalProducts.length > 0 ? (
          finalProducts.map((product: any) => (
            <ProductItem key={product.id} product={product} color="black" />
          ))
        ) : (
          <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
            No products found for specified query
          </h3>
        )}
      </div>
    </>
  );
};

export default Products;
