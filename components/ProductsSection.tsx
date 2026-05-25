// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import apiClient from "@/lib/api";
import { formatProductTitle } from "@/lib/utils";

const ProductsSection = async () => {
  let products = [];
  
  try {
    const data = await apiClient.get(`/api/products?fetchAll=true`);
    
    if (data.ok) {
      const result = await data.json();
      const allProducts = Array.isArray(result) ? result : [];
      
      const groupedProductsMap = new Map<string, any>();
      
      allProducts.forEach((product: any) => {
        const groupTitle = formatProductTitle(product.title);
        const productPrice = product.discountedPrice < product.price && product.discountedPrice > 0 
          ? product.discountedPrice 
          : product.price;

        if (!groupedProductsMap.has(groupTitle)) {
          groupedProductsMap.set(groupTitle, {
            ...product,
            displayTitle: groupTitle,
            variantsList: [product],
            cheapestPrice: productPrice
          });
        } else {
          const group = groupedProductsMap.get(groupTitle);
          group.variantsList.push(product);
          
          if (productPrice < group.cheapestPrice) {
            groupedProductsMap.set(groupTitle, {
              ...product,
              displayTitle: groupTitle,
              variantsList: group.variantsList,
              cheapestPrice: productPrice
            });
          }
        }
      });

      products = Array.from(groupedProductsMap.values()).slice(0, 24); // Show up to 24 grouped products on homepage
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return (
    <div className="bg-blue-500 border-t-4 border-white">
      <div className="max-w-screen-2xl mx-auto pt-20">
        <Heading title="FEATURED PRODUCTS" />
        <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-10 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} color="white" />
            ))
          ) : (
            <div className="col-span-full text-center text-white py-10">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
