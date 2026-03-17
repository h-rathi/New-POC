import React from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";

const OfferedProducts = async () => {
  let products = [];
  try {
    // 1. Fetch active offers which returns: [{ productId: "uuid", discountedPrice: 8500 }]
    const offersData = await apiClient.get('/api/offers');

    if (!offersData.ok) {
      console.error('Failed to fetch offered products:', offersData.statusText);
      return (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No active offers currently available.
        </h3>
      );
    }

    const offersResult = await offersData.json();

    if (!Array.isArray(offersResult) || offersResult.length === 0) {
      return (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No active offers currently available.
        </h3>
      );
    }

    // 2. Map through returned offer results and fetch their full data in parallel
    // from the existing products API, mapping the discountedPrice manually into the price field
    const productPromises = offersResult.map(async (offer: any) => {
      try {
        const prodData = await apiClient.get(`/api/products/${offer.productId}`);
        if (prodData.ok) {
          const productResult = await prodData.json();
          // Pass the correct original and discounted price to ProductItem
          return {
            ...productResult,
            price: offer.price,
            discountedPrice: offer.discountedPrice,
            hasDiscount: true,
            offerName: offer.offerName,
            discountType: offer.discountType,
            discountValue: offer.discountValue,
          };
        }
        return null;
      } catch (err) {
        console.error(`Failed to fetch product ${offer.productId}`, err);
        return null;
      }
    });

    const fullProductsData = await Promise.all(productPromises);
    
    // Filter out any products that failed to load
    products = fullProductsData.filter(Boolean);

  } catch (error) {
    console.error('Error in OfferedProducts component:', error);
    products = [];
  }

  return (
    <>
      <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
        {products.length > 0 ? (
          products.map((product: any) => (
            <ProductItem key={product.id} product={product} color="black" />
          ))
        ) : (
          <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
            No active offers currently available.
          </h3>
        )}
      </div>
    </>
  );
};

export default OfferedProducts;
