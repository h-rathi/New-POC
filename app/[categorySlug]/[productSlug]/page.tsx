import apiClient from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import React from "react";

// Import all premium MLP components
import XiaomiPad6MLP from "@/components/XiaomiPad6MLP";
import SonyAlphaMLP from "@/components/SonyAlphaMLP";
import MacbookAirMLP from "@/components/MacbookAirMLP";
import OnePlusBudsMLP from "@/components/OnePlusBudsMLP";
import SonyWF1000XM5MLP from "@/components/SonyWF1000XM5MLP";
import CanonEOSR50MLP from "@/components/CanonEOSR50MLP";
import LenovoThinkPadX1MLP from "@/components/LenovoThinkPadX1MLP";
import LenovoTabP12MLP from "@/components/LenovoTabP12MLP";
import BrotherPrinterMLP from "@/components/BrotherPrinterMLP";
import CanonPrinterMLP from "@/components/CanonPrinterMLP";

interface CategoryProductPageProps {
  params: Promise<{ categorySlug: string; productSlug: string; id: string }>;
}

// Centralized configuration mapping SEO-friendly slugs to premium components
const mlpProducts: Record<string, React.FC<any>> = {
  "xiaomi-pad-6": XiaomiPad6MLP,
  "macbook-air-m3": MacbookAirMLP,
  "sony-alpha-a6400": SonyAlphaMLP,
  "oneplus-buds-pro-3": OnePlusBudsMLP,
  "sony-wf-1000xm5": SonyWF1000XM5MLP,
  "canon-eos-r50": CanonEOSR50MLP,
  "lenovo-thinkpad-x1": LenovoThinkPadX1MLP,
  "lenovo-tab-p12": LenovoTabP12MLP,
  "brother-hl-l2321d": BrotherPrinterMLP,
  "canon-pixma-g3020": CanonPrinterMLP,
};

const CategoryProductPage = async ({ params }: CategoryProductPageProps) => {
  const paramsAwaited = await params;
  const decodedSlug = decodeURIComponent(paramsAwaited?.productSlug || "").toLowerCase();

  // 1. Look up the MLP Component by exact slug
  const MlpComponent = mlpProducts[decodedSlug];

  // 2. Fallback routing for non-MLP products
  if (!MlpComponent) {
    // This route (/:category/:slug) is STRICTLY for premium MLPs.
    // Standard PDP products should redirect to /product/:slug to maintain clean separation.
    redirect(`/product/${paramsAwaited?.productSlug}`);
  }

  // 3. Product Fetching for dynamic attributes
  let product = null;
  try {
    const data = await apiClient.get(`/api/slugs/${paramsAwaited?.productSlug}`);
    product = await data.json();
    if (product && product.error) {
      product = null;
    }
  } catch (error) {
    // If the product isn't in the DB yet, we still render the MLP using premium fallbacks.
  }

  // 4. Render the cinematic landing page
  return <MlpComponent product={product || {}} />;
};

export default CategoryProductPage;
