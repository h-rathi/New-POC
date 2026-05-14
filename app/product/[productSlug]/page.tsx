import {
  StockAvailabillity,
  UrgencyText,

  ProductTabs,
  SingleProductDynamicFields,
  PriceRenderer,
  
} from "@/components";
import apiClient from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";


interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{  productSlug: string, id: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  // sending API request for a single product with a given product slug
  const data = await apiClient.get(
    `/api/slugs/${paramsAwaited?.productSlug}`
  );
  const product = await data.json();

  // sending API request for more than 1 product image if it exists
  const imagesData = await apiClient.get(
    `/api/images/${paramsAwaited?.id}`
  );
  const images = await imagesData.json();

  if (!product || product.error) {
    notFound();
  }


  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
          <div className="w-full max-w-[560px]">
            <div className="relative mx-auto flex h-[320px] w-full max-w-[560px] items-center justify-center overflow-hidden rounded-lg bg-white p-4 sm:h-[420px] lg:h-[500px]">
              <Image
                src={
                  product?.mainImage
                    ? product.mainImage.startsWith('http://') || product.mainImage.startsWith('https://')
                      ? product.mainImage
                      : `/${product.mainImage}`
                    : "/product_placeholder.jpg"
                }
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 560px"
                alt="main image"
                className="object-contain p-2"
                unoptimized={product?.mainImage?.startsWith('http://') || product?.mainImage?.startsWith('https://')}
              />
            </div>
            <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
              {images?.map((imageItem: ImageItem, key: number) => (
                <div
                  key={imageItem.imageID + key}
                  className="relative h-24 w-24 overflow-hidden rounded-md bg-white p-2"
                >
                  <Image
                    src={`/${imageItem.image}`}
                    fill
                    sizes="96px"
                    alt="product thumbnail"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-y-7 text-black max-[500px]:text-center">
        
            <h1 className="text-3xl">{sanitize(product?.title)}</h1>
            <PriceRenderer 
              price={product?.price} 
              discountedPrice={product?.discountedPrice} 
              hasDiscount={product?.hasDiscount} 
              discountType={product?.discountType}
              discountValue={product?.discountValue}
              color="black" 
              fontSize="2xl" 
            />
            {product?.offerName && (
              <div className="mt-1 mb-2">
                <span className="text-blue-900 font-semibold text-base inline-block italic">
                  {product.offerName}
                </span>
              </div>
            )}
            <StockAvailabillity stock={94} inStock={product?.inStock} />
            <SingleProductDynamicFields product={product} />
            
          </div>
        </div>
        <div className="py-16">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
