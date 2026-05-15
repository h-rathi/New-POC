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

export default function MacbookAirMLP({ product }: MLPProps) {
  // Data mapping from backend parameters
  const attr = product?.variant_attributes || {};
  
  // Extract features dynamically or fallback to premium defaults for the MacBook Air M3
  const processor = attr.processor || product?.processor || "Apple M3 chip";
  const ram = attr.ram || product?.ram || "8GB unified memory";
  const storage = attr.storage || product?.storage || "256GB SSD";
  const battery = attr.battery || product?.battery || "Up to 18 hours";
  const display = attr.display || product?.display || "Liquid Retina display";
  const gpu = attr.gpu || product?.gpu || "8-core GPU";
  const screenSize = attr.screen_size || product?.screen_size || "13.6-inch";

  const isLoggedIn = useIsLoggedInValue();

  return (
    // Base dark theme wrapper with cinematic Apple-like vibe
    <MlpAnalyticsWrapper slug="macbook-air-m3">
    <div className="w-full bg-black text-white font-sans tracking-tight overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section data-mlp-section="hero" className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden bg-black">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-16">
          
          {/* Hero Left (Typography) */}
          <FadeInSection className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-sm leading-tight">
              {sanitize(product?.title) || "MacBook Air"}
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-blue-200/80">
              Supercharged by M3.
            </h2>
            
            {/* Tagline Bullets */}
            <ul className="text-lg md:text-xl text-neutral-400 space-y-4 pt-4">
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Ultra-thin and lightweight</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Incredible battery life</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Next-level M3 performance</span>
              </li>
            </ul>

            {/* Premium CTA */}
            <div className="pt-8 w-full flex justify-center md:justify-start">
              <Link
                href="/product/MacBook%20Air%20M3%20Variant%206"
                onClick={() => trackMlpBuyNowClick("macbook-air-m3", isLoggedIn)}
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
             <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full scale-110 z-0"></div>
             <div className="relative w-full max-w-3xl aspect-video animate-[float_6s_ease-in-out_infinite] z-10 flex items-center justify-center">
                <Image
                  src="/macbook_home.png"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={sanitize(product?.title) || "MacBook Air M3"}
                  className="object-contain drop-shadow-[0_25px_60px_rgba(59,130,246,0.3)]"
                />
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* 2. DYNAMIC TECHNICAL FEATURES SECTION */}
      <section data-mlp-section="technical_features" className="py-24 relative bg-black z-20">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Processor */}
            <FadeInSection delay={100} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Processor</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{processor}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Boundary-breaking speed</p>
            </FadeInSection>

            {/* GPU */}
            <FadeInSection delay={200} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Graphics</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{gpu}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Stunning visual power</p>
            </FadeInSection>

            {/* RAM */}
            <FadeInSection delay={300} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Memory</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{ram}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Fluid multitasking</p>
            </FadeInSection>

            {/* Storage */}
            <FadeInSection delay={400} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Storage</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{storage}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Lightning-fast access</p>
            </FadeInSection>

            {/* Battery */}
            <FadeInSection delay={500} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Battery</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{battery}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">All-day power</p>
            </FadeInSection>

            {/* Display */}
            <FadeInSection delay={600} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Screen</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{screenSize} {display}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Brilliant clarity</p>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* 3. DISPLAY SECTION */}
      <section data-mlp-section="display" className="bg-black py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-video flex items-center justify-center">
              <Image 
                src="/macbook_display.png" 
                fill
                alt="Retina Display" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              A clear <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">masterpiece.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              The {display} supports 1 billion colors. Everything you see is remarkably rich and vibrant, with sharp text and incredible contrast.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 4. PERFORMANCE SECTION */}
      <section data-mlp-section="performance" className="bg-black py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row-reverse items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-video flex items-center justify-center">
              <Image 
                src="/macbook_performance.png" 
                fill
                alt="MacBook Performance" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Chip off the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">new block.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              The M3 chip brings unprecedented speed and capabilities. From intense video editing to seamless multitasking, it flies through workflows while remaining completely silent.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 5. LIFESTYLE SECTION */}
      <section data-mlp-section="lifestyle" className="relative w-full min-h-[80vh] flex items-center justify-center bg-black overflow-hidden border-t border-neutral-900">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/macbook_lifestyle.png"
            fill
            alt="MacBook Lifestyle"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center mt-32">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">Creativity Anywhere.</span>
            </h2>
            <p className="text-2xl text-neutral-300 font-light max-w-2xl mx-auto drop-shadow-md">
              So thin and light, it fits seamlessly into your life. The ultimate tool for getting things done, wherever inspiration strikes.
            </p>
          </FadeInSection>
        </div>
      </section>

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
