import { CategoryMenu, ExploreOffersSection, IntroducingSection, ProductsSection } from "@/components";
import FeaturedProduct from "@/components/FeaturedProduct";
import apiClient from "@/lib/api";
import { notFound } from "next/navigation";
import React from "react";

interface ProductLandingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductLandingPage({ params }: ProductLandingPageProps) {
  const paramsAwaited = await params;
  
  // Fetch product data
  const data = await apiClient.get(
    `/api/slugs/${paramsAwaited?.slug}`
  );
  const product = await data.json();
  
  if (!product || product.error || typeof product === 'string') {
    notFound();
  }

  return (
    <>
      {/* Featured Product instead of Default Hero */}
      <FeaturedProduct product={product} />
      
      {/* Rest of the homepage sections */}
      <ExploreOffersSection />
      <IntroducingSection />
      <CategoryMenu />
      <ProductsSection />
    </>
  );
}
