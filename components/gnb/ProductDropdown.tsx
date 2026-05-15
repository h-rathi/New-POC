"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

interface ProductDropdownProps {
  category: string;
  isActive?: boolean;
  onClose?: () => void;
}

const mlpCategoryLinks: Record<string, { title: string; slug: string; tagline: string; glow: string }[]> = {
  laptops: [
    { title: "MacBook Air M3", slug: "macbook-air-m3", tagline: "Power meets portability", glow: "hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] hover:border-blue-200" },
    { title: "ThinkPad X1", slug: "lenovo-thinkpad-x1", tagline: "Enterprise grade performance", glow: "hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] hover:border-blue-200" }
  ],
  tablets: [
    { title: "Xiaomi Pad 6", slug: "xiaomi-pad-6", tagline: "Immersive entertainment", glow: "hover:shadow-[0_8px_30px_rgba(107,114,128,0.12)] hover:border-gray-300" },
    { title: "Lenovo Tab P12", slug: "lenovo-tab-p12", tagline: "Pro-level productivity", glow: "hover:shadow-[0_8px_30px_rgba(107,114,128,0.12)] hover:border-gray-300" }
  ],
  cameras: [
    { title: "Sony Alpha a6400", slug: "sony-alpha-a6400", tagline: "Capture the moment", glow: "hover:shadow-[0_8px_30px_rgba(234,88,12,0.12)] hover:border-orange-200" },
    { title: "Canon EOS R50", slug: "canon-eos-r50", tagline: "Next-gen creator tool", glow: "hover:shadow-[0_8px_30px_rgba(234,88,12,0.12)] hover:border-orange-200" }
  ],
  earbuds: [
    { title: "Sony WF-1000XM5", slug: "sony-wf-1000xm5", tagline: "Premium noise cancellation", glow: "hover:shadow-[0_8px_30px_rgba(147,51,234,0.12)] hover:border-purple-200" },
    { title: "OnePlus Buds Pro 3", slug: "oneplus-buds-pro-3", tagline: "Masterful audio", glow: "hover:shadow-[0_8px_30px_rgba(8,145,178,0.12)] hover:border-cyan-200" }
  ],
  printers: [
    { title: "Brother HL-L2321D", slug: "brother-hl-l2321d", tagline: "Fast & reliable printing", glow: "hover:shadow-[0_8px_30px_rgba(8,145,178,0.12)] hover:border-cyan-200" },
    { title: "Canon Pixma G3020", slug: "canon-pixma-g3020", tagline: "Smart productivity", glow: "hover:shadow-[0_8px_30px_rgba(8,145,178,0.12)] hover:border-cyan-200" }
  ]
};

export default function ProductDropdown({ category, isActive = false, onClose }: ProductDropdownProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Add limit and sort to pull consistent results across visits
        const url = `/api/products?filters[category][$equals]=${encodeURIComponent(category.toLowerCase())}&limit=5&sort=defaultSort`;
        const data = await apiClient.get(url);
        
        if (data.ok) {
          const result = await data.json();
          if (isMounted) {
            if (Array.isArray(result)) {
               // Ensure maximum of 4 items for grid-cols-4
               setProducts(result.slice(0, 4));
            } else {
               setProducts([]);
            }
          }
        } else {
          if (isMounted) setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching dynamic products for category:", category, error);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [category]);

  const handleNavigateAll = () => {
    if (onClose) onClose();
    router.push(`/shop?category=${encodeURIComponent(category.toLowerCase())}`);
  };

  const isLoggedIn = useIsLoggedInValue();

  const handleProductClick = (productName: string, productSlug: string) => {
    const payload = withIsLoggedIn({
      product_name: productName,
      product_slug: productSlug,
      category,
      destination_type: "PDP",
      component: "GNB_MegaMenu",
    }, isLoggedIn);

    posthog.capture("gnb_product_clicked", payload);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "gnb_product_clicked", ...payload });
    }

    if (onClose) onClose();
  };

  const handleMlpClick = (productName: string, slug: string) => {
    const payload = withIsLoggedIn({
      product_name: productName,
      slug,
      category,
      destination_type: "MLP",
      component: "GNB_ExplorePremium",
    }, isLoggedIn);

    posthog.capture("gnb_mlp_clicked", payload);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "gnb_mlp_clicked", ...payload });
    }

    if (onClose) onClose();
  };

  const premiumLinks = mlpCategoryLinks[category.toLowerCase()] || [];

  return (
    <div className={`absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 transform z-50 ${isActive ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}>
      <div className="max-w-screen-2xl mx-auto px-16 max-md:px-6 py-10">
        <div className="grid grid-cols-6 gap-8">
          
          {/* Main Content Area (4 Columns for Products) */}
          <div className="col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-6">
                Featured {category}
              </h3>
              
              {loading ? (
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex flex-col animate-pulse">
                      <div className="h-[140px] bg-gray-100 rounded-lg mb-4 w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {products.map((product) => {
                    const productHref = `/product/${product.slug}`;
                    return (
                    <Link 
                      key={product.id} 
                      href={productHref}
                      onClick={() => handleProductClick(sanitize(product.title) || '', product.slug || '')}
                      className="flex flex-col group/card rounded-xl hover:bg-gray-50 transition-all p-3 border border-transparent hover:border-gray-100"
                    >
                      <div className="relative h-[120px] w-full mb-4 overflow-hidden bg-white rounded-lg flex items-center justify-center mix-blend-multiply">
                         <Image
                           src={
                             product.mainImage
                               ? product.mainImage.startsWith("http://") ||
                                 product.mainImage.startsWith("https://")
                                 ? product.mainImage
                                 : `/${product.mainImage}`
                               : "/product_placeholder.jpg"
                           }
                           fill
                           sizes="150px"
                           className="object-contain p-2 group-hover/card:scale-105 transition-transform duration-300 transform-gpu"
                           alt={sanitize(product?.title) || "Product image"}
                           unoptimized={
                             product.mainImage?.startsWith("http://") ||
                             product.mainImage?.startsWith("https://")
                           }
                         />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1 line-clamp-1">{product.manufacturer || category}</p>
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover/card:text-blue-600 transition-colors">
                          {sanitize(product.title)}
                        </h4>
                      </div>
                    </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 bg-gray-50/50 rounded-xl flex items-center justify-center border border-dashed border-gray-200 h-full">
                  <p className="text-gray-500 font-medium">No products available for {category}</p>
                </div>
              )}
            </div>
            
            {/* View All CTA at the bottom center */}
            <div className="mt-8 flex justify-center border-t border-gray-100 pt-6">
              <button 
                 onClick={handleNavigateAll}
                 className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-2 group/btn"
              >
                View All {category}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Premium Experiences Area (2 Columns) */}
          <div className="col-span-2 flex flex-col bg-blue-50/30 p-8 rounded-2xl relative overflow-hidden min-h-[200px] border border-blue-100">
             <div className="relative z-10 w-full h-full flex flex-col">
               <h3 className="text-xs font-bold text-blue-900 tracking-widest uppercase mb-6 flex items-center">
                 Explore Premium
                 <div className="flex-1 h-[1px] bg-blue-200 ml-4"></div>
               </h3>
               
               {premiumLinks.length > 0 ? (
                 <div className="flex flex-col gap-4 mt-2 h-full justify-center">
                    {premiumLinks.map((link, idx) => (
                      <Link 
                        key={idx}
                        href={`/${category.toLowerCase()}/${link.slug}`}
                        onClick={() => handleMlpClick(link.title, link.slug)}
                        className={`group relative flex items-center p-4 rounded-2xl bg-white border border-blue-100/50 shadow-sm transition-all duration-300 pointer-events-auto hover:-translate-y-1 hover:scale-[1.02] ${link.glow} overflow-hidden`}
                      >
                        {/* Text Content */}
                        <div className="flex flex-col z-10 flex-1">
                          <span className="text-gray-900 font-bold tracking-tight transition-colors group-hover:text-blue-700">
                            {link.title}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5 font-medium">
                            {link.tagline}
                          </span>
                        </div>

                        {/* Arrow Icon */}
                        <svg className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-blue-600 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>

                        {/* Subtle Background Hover */}
                        <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 transition-colors duration-300 z-0"></div>
                      </Link>
                    ))}
                 </div>
               ) : (
                 <p className="text-sm text-gray-500 mt-4 italic">More experiences coming soon.</p>
               )}
               
               {/* Ambient decorative circle */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

