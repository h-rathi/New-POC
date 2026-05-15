"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { sanitize } from "@/lib/sanitize";
import MlpAnalyticsWrapper, { trackMlpBuyNowClick } from "@/components/MlpAnalyticsWrapper";
import { useIsLoggedInValue } from "@/lib/posthog-auth";

interface Product {
  id: string;
  title: string;
  mainImage: string;
  variant_attributes?: any;
  [key: string]: any;
}

interface MLPProps {
  product: Product;
}

// Inter-sectional Fade In Wrapper
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

export default function LenovoThinkPadX1MLP({ product }: MLPProps) {
  // Data mapping from backend parameters
  const attr = product?.variant_attributes || {};
  
  // Extract features dynamically or fallback to premium defaults
  const processor = attr.processor || product?.processor || "AMD Ryzen™ 7 PRO";
  const ram = attr.ram || product?.ram || "32GB LPDDR5x";
  const storage = attr.storage || product?.storage || "1TB PCIe Gen4 SSD";
  const screenSize = attr.screen_size || product?.screen_size || "14-inch WUXGA";
  
  // Hardcoded premium features
  const durability = "Military-Grade Durability";
  const aiProductivity = "AI-Powered Productivity";

  const isLoggedIn = useIsLoggedInValue();

  return (
    // Base dark theme wrapper with professional enterprise vibe
    <MlpAnalyticsWrapper slug="lenovo-thinkpad-x1">
    <div className="w-full bg-neutral-950 text-white font-sans tracking-tight overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section data-mlp-section="hero" className="relative w-full min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden bg-neutral-950">
        {/* Glow Effects - ThinkPad Red & Dark Gray Aesthetic */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neutral-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-16">
          
          {/* Hero Left (Typography) */}
          <FadeInSection className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-sm leading-tight">
              {sanitize(product?.title) || "Lenovo ThinkPad X1"}
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-neutral-300">
              Built for Professionals Who Move Fast.
            </h2>
            
            {/* Tagline Bullets */}
            <ul className="text-lg md:text-xl text-neutral-400 space-y-4 pt-4">
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Powerful Ryzen 7 performance</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Lightweight premium design</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Enterprise-grade productivity</span>
              </li>
            </ul>

            {/* Premium CTA */}
            <div className="pt-8 w-full flex justify-center md:justify-start">
              <Link
                href="/product/Lenovo%20ThinkPad%20X1%20Variant%208"
                onClick={() => trackMlpBuyNowClick("lenovo-thinkpad-x1", isLoggedIn)}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-blue-600 to-slate-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Buy Now
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
              </Link>
            </div>
          </FadeInSection>

          {/* Hero Right (Floating Image with Glow) */}
          <FadeInSection delay={200} className="w-full md:w-7/12 flex justify-center items-center relative">
             <div className="absolute inset-0 bg-red-600/10 blur-[120px] rounded-full scale-110 z-0"></div>
             <div className="relative w-full max-w-2xl aspect-video animate-[float_6s_ease-in-out_infinite] z-10 flex items-center justify-center">
                <Image
                  src="/thinkpad_home.png"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={sanitize(product?.title) || "Lenovo ThinkPad X1"}
                  className="object-contain drop-shadow-[0_25px_60px_rgba(220,38,38,0.2)]"
                />
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* 2. DYNAMIC TECHNICAL FEATURES SECTION */}
      <section data-mlp-section="technical_features" className="py-24 relative bg-neutral-950 z-20">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Processor */}
            <FadeInSection delay={100} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:border-red-600/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Processor</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{processor}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Unmatched processing power</p>
            </FadeInSection>

            {/* RAM */}
            <FadeInSection delay={200} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:border-red-600/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-neutral-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Memory</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{ram}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Seamless multitasking</p>
            </FadeInSection>

            {/* Storage */}
            <FadeInSection delay={300} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:border-red-600/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Storage</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{storage}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Lightning-fast access</p>
            </FadeInSection>

            {/* Display */}
            <FadeInSection delay={400} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:border-red-600/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-neutral-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Display</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{screenSize}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Vibrant professional colors</p>
            </FadeInSection>

            {/* Durability */}
            <FadeInSection delay={500} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:border-red-600/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Durability</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{durability}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Tested for extremes</p>
            </FadeInSection>

            {/* AI Productivity */}
            <FadeInSection delay={600} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:border-red-600/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-neutral-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Smart Features</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{aiProductivity}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Optimizes your workflow</p>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* 3. DISPLAY / PRODUCTIVITY SECTION */}
      <section data-mlp-section="display" className="bg-neutral-950 py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-neutral-600/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-video flex items-center justify-center">
              <Image 
                src="/thinkpad_display.png" 
                fill
                alt="Workspace Display" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Expansive <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Workspace.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              The {screenSize} display delivers sharp details and rich colors, expanding your vertical workspace. Perfect for crunching data, reading long documents, and immersive multitasking.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 4. PERFORMANCE SECTION */}
      <section data-mlp-section="performance" className="bg-neutral-950 py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row-reverse items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-video flex items-center justify-center">
              <Image 
                src="/thinkpad_performance.png" 
                fill
                alt="ThinkPad Performance" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Enterprise <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 to-neutral-500">Excellence.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Equipped with {processor}, paired with {ram} and ultra-fast {storage}, the ThinkPad X1 accelerates your workflow securely, reliably, and consistently. 
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 5. LIFESTYLE SECTION */}
      <section data-mlp-section="lifestyle" className="relative w-full min-h-[80vh] flex items-center justify-center bg-neutral-950 overflow-hidden border-t border-neutral-900">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/thinkpad_lifestyle.png"
            fill
            alt="ThinkPad Lifestyle"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center mt-32">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
              Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Modern Workflows.</span>
            </h2>
            <p className="text-2xl text-neutral-300 font-light max-w-2xl mx-auto drop-shadow-md">
              From the corner office to the airport lounge, trust the device that defines professional mobility and elite productivity.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Required CSS Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3%); }
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
      `}} />

    </div>
    </MlpAnalyticsWrapper>
  );
}
