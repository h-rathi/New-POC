"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { sanitize } from "@/lib/sanitize";
import { formatProductTitle, isLightColor } from "@/lib/utils";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price?: number;
  rating?: number;
  mainImage: string;
  variant_attributes?: any;
  [key: string]: any;
}

interface FeaturedProductProps {
  product: Product;
}

// Reusable Fade-in on Scroll Wrapper
const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    
    if (domRef.current) observer.observe(domRef.current);
    
    const currentRef = domRef.current;
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const FeaturedProduct: React.FC<FeaturedProductProps> = ({ product }) => {
  const isLoggedIn = useIsLoggedInValue();
  const [selectedVariant, setSelectedVariant] = useState<any>(product);
  const domRef = useRef<HTMLElement>(null);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    if (hasTrackedImpression.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedImpression.current) {
            hasTrackedImpression.current = true;
            const impressionPayload = withIsLoggedIn({
              product_slug: selectedVariant.slug || "unknown",
              product_title: selectedVariant.title || "unknown",
              category: selectedVariant.category?.name || "unknown",
              price: selectedVariant.price || 0,
              component: "FeaturedProduct",
            }, isLoggedIn);
            
            posthog.capture("featured_product_impression", impressionPayload);
            if (typeof window !== "undefined") {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ event: "featured_product_impression", ...impressionPayload });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, [selectedVariant, isLoggedIn]);

  const handleProductClick = (click_source: string) => {
    const clickPayload = withIsLoggedIn({
      product_slug: selectedVariant.slug || "unknown",
      product_title: selectedVariant.title || "unknown",
      destination_url: `/product/${selectedVariant.slug}`,
      click_source,
      price: selectedVariant.price || 0,
      component: "FeaturedProduct",
    }, isLoggedIn);
    
    posthog.capture("featured_product_clicked", clickPayload);
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "featured_product_clicked", ...clickPayload });
    }
  };

  const handleVariantSwatchClick = (targetVariant: any, targetColor: string) => {
    if (selectedVariant.id === targetVariant.id) return;
    let previousColor = "";
    if (selectedVariant._colorStr) {
      previousColor = selectedVariant._colorStr;
    } else if (selectedVariant.variant_attributes) {
      let attrs = selectedVariant.variant_attributes;
      if (typeof attrs === 'string') {
        try { attrs = JSON.parse(attrs); } catch (e) {}
      }
      if (typeof attrs === 'object' && attrs !== null) {
        const colorKey = Object.keys(attrs).find(k => k.toLowerCase() === 'color');
        if (colorKey) previousColor = attrs[colorKey];
      }
    }

    const variantPayload = withIsLoggedIn({
      current_displayed_product_slug: selectedVariant.slug || "unknown",
      target_variant_slug: targetVariant.slug || "unknown",
      product_group_title: (product as any).displayTitle || product.title.replace(/\s+Variant\s+\d+$/i, "").trim(),
      selected_color: targetColor,
      previous_selected_color: previousColor,
      product_title: targetVariant.title || "unknown",
      price: targetVariant.price || 0,
      category: targetVariant.category?.name || "unknown",
      source: "featured_variant_swatch",
      component: "FeaturedProduct",
    }, isLoggedIn);

    posthog.capture("featured_variant_selected", variantPayload);
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "featured_variant_selected", ...variantPayload });
    }
    setSelectedVariant(targetVariant);
  };

  const imageUrl = selectedVariant.mainImage
    ? selectedVariant.mainImage.startsWith("http://") || selectedVariant.mainImage.startsWith("https://")
      ? selectedVariant.mainImage
      : `/${selectedVariant.mainImage}`
    : "/product_placeholder.jpg";

  // Data mapping from backend (falling back to realistic defaults if the data isn't seeded)
  const attr = product.variant_attributes || {};
  const battery = attr.battery || product.battery || "8840 mAh";
  const storage = attr.storage || product.storage || "Up to 256GB";
  const connectivity = attr.connectivity || product.connectivity || "Wi-Fi 6 + Bluetooth 5.2";
  const display = attr.displaySize || product.displaySize || attr.display || "11-inch 144Hz WQHD+";

  return (
    <div className="w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 1. HERO SECTION */}
      <section ref={domRef} className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-white">
        {/* Abstract Soft Background Gradients */}
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-bl from-blue-50/80 via-white to-white opacity-80 z-0"></div>
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl z-0 pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-24">
          {/* LEFT: Text Content */}
          <FadeInSection className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-widest uppercase">
              Pro Performance
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              {sanitize(formatProductTitle(product.title)) || "Xiaomi Pad 6"}
            </h1>
            <h2 className="text-2xl md:text-3xl font-light text-slate-600">
              Unleash your potential.
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-lg">
              {product.description || "Experience the next evolution in premium tablets. Unbeatable power meets a breathtaking display, crafted to expand what you can do every day."}
            </p>

            {/* Variant Selector (if available) */}
            {(product as any).variantsList && (product as any).variantsList.length > 1 && (() => {
              let selectedColorStr: string | null = null;
              if (selectedVariant.variant_attributes) {
                let attrs = selectedVariant.variant_attributes;
                if (typeof attrs === 'string') {
                  try { attrs = JSON.parse(attrs); } catch (e) {}
                }
                if (typeof attrs === 'object' && attrs !== null) {
                  const colorKey = Object.keys(attrs).find(k => k.toLowerCase() === 'color');
                  if (colorKey) selectedColorStr = attrs[colorKey];
                }
              }

              const uniqueColorVariantsMap = new Map();
              (product as any).variantsList.forEach((v: any) => {
                let colorStr = null;
                if (v.variant_attributes) {
                  let attrs = v.variant_attributes;
                  if (typeof attrs === 'string') {
                    try { attrs = JSON.parse(attrs); } catch (e) {}
                  }
                  if (typeof attrs === 'object' && attrs !== null) {
                    const colorKey = Object.keys(attrs).find(k => k.toLowerCase() === 'color');
                    if (colorKey) colorStr = attrs[colorKey];
                  }
                }
                if (colorStr && !uniqueColorVariantsMap.has(colorStr.toLowerCase())) {
                  uniqueColorVariantsMap.set(colorStr.toLowerCase(), { ...v, _colorStr: colorStr });
                }
              });
              const colorVariants = Array.from(uniqueColorVariantsMap.values());
              if (colorVariants.length <= 1) return null;

              return (
                <div className="flex flex-col items-start mt-4 gap-2">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Color</span>
                  <div className="flex gap-2 mt-1">
                    {colorVariants.map((v: any, idx: number) => {
                      const colorStr = v._colorStr;
                      const isSelected = (selectedColorStr && colorStr) 
                        ? selectedColorStr.toLowerCase() === colorStr.toLowerCase() 
                        : selectedVariant.id === v.id;
                      const isLight = isLightColor(colorStr);
                      return (
                        <button 
                          key={idx} 
                          title={colorStr} 
                          onClick={() => handleVariantSwatchClick(v, colorStr)}
                          className={`w-6 h-6 rounded-full transition-all duration-300 shadow-sm
                            ${isLight ? 'border border-gray-300' : 'border border-gray-200'}
                            ${isSelected ? `ring-2 ring-blue-500 ring-offset-2 scale-110 ${isLight ? '' : 'border-blue-500'}` : 'hover:scale-110'}
                          `} 
                          style={{ backgroundColor: colorStr.toLowerCase().replace(/ /g, '') }} 
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* CTA */}
            <div className="mt-8">
              <Link
                href={`/product/${selectedVariant?.slug}`}
                onClick={() => handleProductClick("cta")}
                className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                View Product
              </Link>
            </div>
          </FadeInSection>

          {/* RIGHT: Large Image */}
          <FadeInSection delay={200} className="w-full md:w-7/12 flex justify-center items-center">
            <div className="relative w-full max-w-xl aspect-square flex items-center justify-center">
              {/* Product floating effect via Tailwind animation */}
              <Link href={`/product/${selectedVariant?.slug}`} onClick={() => handleProductClick("image")} className="relative w-[85%] h-[85%] animate-[wiggle_6s_ease-in-out_infinite] block">
                <Image
                  src={imageUrl}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={sanitize(formatProductTitle(selectedVariant.title)) || "Featured product"}
                  className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] z-20 cursor-pointer"
                  unoptimized={imageUrl.startsWith("http://")}
                />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 2. FEATURE HIGHLIGHTS (CORE SECTION) */}
      <section className="py-24 bg-slate-50 relative z-20">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <FadeInSection>
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800">
                Power meets Elegance
              </h3>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Battery */}
            <FadeInSection delay={100} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default border border-slate-100">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-green-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{battery}</h4>
              <p className="text-slate-500 font-medium text-sm mb-1">Battery Life</p>
              <p className="text-slate-400 text-sm">Power that lasts all day.</p>
            </FadeInSection>

            {/* Storage */}
            <FadeInSection delay={200} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default border border-slate-100">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{storage}</h4>
              <p className="text-slate-500 font-medium text-sm mb-1">Ample Storage</p>
              <p className="text-slate-400 text-sm">Keep everything you love.</p>
            </FadeInSection>

            {/* Connectivity */}
            <FadeInSection delay={300} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default border border-slate-100">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{connectivity}</h4>
              <p className="text-slate-500 font-medium text-sm mb-1">Fast Connectivity</p>
              <p className="text-slate-400 text-sm">Stay connected anywhere.</p>
            </FadeInSection>

            {/* Display */}
            <FadeInSection delay={400} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default border border-slate-100">
              <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mb-6 text-rose-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2 text-wrap">{display}</h4>
              <p className="text-slate-500 font-medium text-sm mb-1">Immersive Display</p>
              <p className="text-slate-400 text-sm">See the world in vibrant colors.</p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 3. FEATURE DEEP DIVES */}
      <section className="bg-white py-16">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col space-y-32">
          
          {/* Section 1: Display */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <FadeInSection className="w-full md:w-1/2 rounded-3xl overflow-hidden bg-slate-100 aspect-[4/3] relative group shadow-lg">
              <Image 
                src={imageUrl} 
                fill 
                alt="Display view" 
                className="object-cover object-left-top scale-125 group-hover:scale-110 transition-transform duration-700 ease-out z-10" 
                unoptimized={imageUrl.startsWith("http://")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-20"></div>
            </FadeInSection>
            <FadeInSection delay={200} className="w-full md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">A display that pulls you in.</h2>
              <p className="text-xl text-slate-500 font-light max-w-lg leading-relaxed">
                Experience ultra-smooth scrolling, deep contrasts, and lifelike colors on a screen that feels like window to another world. Perfectly calibrated for your viewing pleasure.
              </p>
            </FadeInSection>
          </div>

          {/* Section 2: Performance / Battery (Alternate) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
             <FadeInSection className="w-full md:w-1/2 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-100 aspect-[4/3] flex items-center justify-center relative shadow-lg group">
                <Image 
                  src={imageUrl} 
                  fill 
                  alt="Performance view" 
                  className="object-contain p-12 group-hover:scale-105 transition-transform duration-700 ease-out z-10 filter drop-shadow-xl" 
                  unoptimized={imageUrl.startsWith("http://")}
                />
            </FadeInSection>
            <FadeInSection delay={200} className="w-full md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Do more. Charge less.</h2>
              <p className="text-xl text-slate-500 font-light max-w-lg leading-relaxed">
                Powered by a next-gen processor and massive battery capability, this tablet outlasts your longest days. From heavy gaming to intense multitasking, it barely breaks a sweat.
              </p>
            </FadeInSection>
          </div>

          {/* Section 3: Connectivity */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <FadeInSection className="w-full md:w-1/2 rounded-3xl overflow-hidden bg-slate-900 aspect-[4/3] relative shadow-lg group flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 to-slate-900 z-0"></div>
               <Image 
                  src={imageUrl} 
                  fill 
                  alt="Connectivity view" 
                  className="object-contain p-16 rotate-12 group-hover:rotate-0 transition-transform duration-700 ease-out z-10" 
                  unoptimized={imageUrl.startsWith("http://")}
                />
            </FadeInSection>
            <FadeInSection delay={200} className="w-full md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Uncompromised versatility.</h2>
              <p className="text-xl text-slate-500 font-light max-w-lg leading-relaxed">
                Stay seamlessly connected to your ecosystem. With blazing fast Wi-Fi integrations and optional cellular versatility, you can transform any spot into your workspace.
              </p>
            </FadeInSection>
          </div>

        </div>
      </section>

      {/* 4. STATIC TABLET BENEFITS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 text-center">
          <FadeInSection>
            <h2 className="text-4xl font-bold text-slate-900 mb-16 tracking-tight">Why Tablets Are Perfect for You</h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            
            <FadeInSection delay={100} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 transition-transform hover:scale-110 duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Productivity</h3>
              <p className="text-slate-500 max-w-xs text-center font-light leading-relaxed">Replace your laptop for everyday tasks with seamless multitasking and robust apps.</p>
            </FadeInSection>

            <FadeInSection delay={200} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-6 transition-transform hover:scale-110 duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Entertainment</h3>
              <p className="text-slate-500 max-w-xs text-center font-light leading-relaxed">Your personal portable theater. Experience games and movies like never before.</p>
            </FadeInSection>

            <FadeInSection delay={300} className="flex flex-col items-center">
               <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-6 transition-transform hover:scale-110 duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Learning</h3>
              <p className="text-slate-500 max-w-xs text-center font-light leading-relaxed">The ultimate companion for students. Read, annotate, and learn on an expansive display.</p>
            </FadeInSection>

            <FadeInSection delay={400} className="flex flex-col items-center">
               <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 transition-transform hover:scale-110 duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gaming</h3>
              <p className="text-slate-500 max-w-xs text-center font-light leading-relaxed">Immersive, lag-free gameplay with console-level graphics in your hands anywhere.</p>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* 5. LIFESTYLE SECTION */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[150%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Fits right into your life.</h2>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">From the boardroom to the living room, it seamlessly adapts to what you need.</p>
          </FadeInSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Scene 1 */}
             <FadeInSection delay={100} className="rounded-3xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 flex flex-col space-y-6 hover:bg-slate-800 transition-colors duration-300">
               <div className="h-64 relative w-full rounded-xl overflow-hidden bg-slate-700">
                  <Image src={imageUrl} fill alt="Work on the go" className="object-cover opacity-80" unoptimized={imageUrl.startsWith("http://")}/>
               </div>
               <h3 className="text-2xl font-semibold">Work on the go</h3>
               <p className="text-slate-400 font-light">With lightweight design and robust specs, grab it and turn any cafe into your office in seconds without missing a beat.</p>
             </FadeInSection>

             {/* Scene 2 */}
             <FadeInSection delay={250} className="rounded-3xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 flex flex-col space-y-6 hover:bg-slate-800 transition-colors duration-300">
               <div className="h-64 relative w-full rounded-xl overflow-hidden bg-slate-700">
                 <Image src={imageUrl} fill alt="Watching content" className="object-cover scale-125 object-bottom opacity-80" unoptimized={imageUrl.startsWith("http://")}/>
               </div>
               <h3 className="text-2xl font-semibold">Cinematic escapes</h3>
               <p className="text-slate-400 font-light">Binge-watch your favorite shows with high-fidelity audio and vivid imagery that make the real world fade away effortlessly.</p>
             </FadeInSection>

             {/* Scene 3 */}
             <FadeInSection delay={400} className="rounded-3xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 flex flex-col space-y-6 hover:bg-slate-800 transition-colors duration-300">
               <div className="h-64 relative w-full rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center p-8">
                 <Image src={imageUrl} fill alt="Reading" className="object-contain opacity-80 scale-110 rotate-[-15deg]" unoptimized={imageUrl.startsWith("http://")}/>
               </div>
               <h3 className="text-2xl font-semibold">Immersive reading</h3>
               <p className="text-slate-400 font-light">Whether it's the morning news, complex textbooks, or a thrilling novel, the low-blue-light display keeps your eyes completely rested.</p>
             </FadeInSection>

          </div>
        </div>
      </section>
      
      {/* Dynamic Keyframes for float animation (applied globally but scoped effectively) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wiggle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3%); }
        }
      `}} />
    </div>
  );
};

export default FeaturedProduct;
