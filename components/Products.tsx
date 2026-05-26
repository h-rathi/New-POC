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
import { PriceRangeUpdater } from "./PriceRangeUpdater";
import { formatProductTitle } from "@/lib/utils";

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
    const url = `/api/products?filters[rating][$gte]=${Number(searchParams?.rating) || 0
      }${stockFilterParams}${discountFilterParams}${slug ? `&filters[category][$equals]=${encodeURIComponent(slug)}` : ""
      }&sort=${searchParams?.sort || 'defaultSort'}&fetchAll=true`;

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

  // Group products by normalized title
  const groupedProductsMap = new Map<string, any>();
  const selectedPriceLimit = searchParams?.price ? Number(searchParams.price) : 10000;

  let categoryMinPrice = Infinity;
  let categoryMaxPrice = 0;

  products.forEach((product: any) => {
    const groupTitle = formatProductTitle(product.title);
    const productPrice = product.discountedPrice < product.price && product.discountedPrice > 0 
      ? product.discountedPrice 
      : product.price;

    const isPriceMatch = productPrice <= selectedPriceLimit;

    if (productPrice < categoryMinPrice) categoryMinPrice = productPrice;
    if (productPrice > categoryMaxPrice) categoryMaxPrice = productPrice;

    if (!groupedProductsMap.has(groupTitle)) {
      groupedProductsMap.set(groupTitle, {
        ...product, // Start with this product as the representative
        displayTitle: groupTitle,
        variantsList: [product],
        hasMatchingVariant: isPriceMatch,
        cheapestMatchingPrice: isPriceMatch ? productPrice : Infinity,
      });
    } else {
      const group = groupedProductsMap.get(groupTitle);
      group.variantsList.push(product);
      
      if (isPriceMatch) {
        group.hasMatchingVariant = true;
        
        // If this matching product is cheaper than the current cheapest matching product
        if (productPrice < group.cheapestMatchingPrice) {
          groupedProductsMap.set(groupTitle, {
            ...product,
            displayTitle: groupTitle,
            variantsList: group.variantsList,
            hasMatchingVariant: true,
            cheapestMatchingPrice: productPrice,
          });
        }
      }
    }
  });

  // Only keep groups that have at least one variant within the selected price range
  finalProducts = Array.from(groupedProductsMap.values()).filter(group => group.hasMatchingVariant);
  const hasMore = finalProducts.length > page * 12;
  const paginatedProducts = finalProducts.slice((page - 1) * 12, page * 12);

  if (categoryMinPrice === Infinity) categoryMinPrice = 0;

  return (
    <>
      <PaginationSync hasMore={hasMore} />
      <PriceRangeUpdater minPrice={categoryMinPrice} maxPrice={categoryMaxPrice} />
      <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product: any, index: number) => (
            <ProductItem key={product.id} product={product} color="black" position={index + 1} pageType="shop" />
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
