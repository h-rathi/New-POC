import apiClient from "@/lib/api";
import { notFound } from "next/navigation";
import React from "react";
import XiaomiPad6MLP from "@/components/XiaomiPad6MLP";

export default async function StandaloneXiaomiPadLanding() {
  // Fetch product data directly 
  const data = await apiClient.get(`/api/slugs/xiaomi-pad-6-variant-4`);
  const product = await data.json();
  
  if (!product || product.error || typeof product === 'string') {
    notFound();
  }

  return (
    <XiaomiPad6MLP product={product} />
  );
}
