"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { sanitize } from "@/lib/sanitize";

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

export default function XiaomiPad6MLP({ product }: MLPProps) {
  // Data mapping from backend parameters
  const attr = product?.variant_attributes || {};
  
  // Extract features dynamically or fallback to premium defaults
  const battery = attr.battery || attr.battery_capacity || product?.battery || "8840mAh High-Capacity";
  const storage = attr.storage || product?.storage || "256GB UFS 3.1";
  const connectivity = attr.connectivity || attr.network || product?.connectivity || "Wi-Fi 6 & Bluetooth 5.2";
  const displaySize = attr.display_size || attr.screen_size || product?.display_size || "11-inch WQHD+";
  const processor = attr.processor || attr.cpu || product?.processor || "Snapdragon 870";
  const refreshRate = attr.refresh_rate || attr.screen_refresh_rate || product?.refresh_rate || "144Hz Adaptive";

  return (
    // Base dark theme wrapper with cinematic vibe
    <div className="w-full bg-black text-white font-sans tracking-tight overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden bg-black">
        {/* Glow Effects - Blue Aesthetic */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-16">
          
          {/* Hero Left (Typography) */}
          <FadeInSection className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-sm leading-tight">
              {sanitize(product?.title) || "Xiaomi Pad 6"}
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-neutral-300">
              Designed for Entertainment. Built for Productivity.
            </h2>
            
            {/* Tagline Bullets */}
            <ul className="text-lg md:text-xl text-neutral-400 space-y-4 pt-4">
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Immersive display experience</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Powerful all-day performance</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Lightweight and portable</span>
              </li>
            </ul>

            {/* Premium CTA */}
            <div className="pt-8 w-full flex justify-center md:justify-start">
              <Link
                href="/product/Xiaomi%20Pad%206%20Variant%204"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-slate-500 to-amber-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] overflow-hidden"
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
             <div className="relative w-full max-w-2xl aspect-square animate-[float_6s_ease-in-out_infinite] z-10 flex items-center justify-center">
                <Image
                  src="/xiaomi_home.png"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={sanitize(product?.title) || "Xiaomi Pad 6"}
                  className="object-contain drop-shadow-[0_25px_60px_rgba(59,130,246,0.3)]"
                />
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* 2. DYNAMIC TECHNICAL FEATURES SECTION */}
      <section className="py-24 relative bg-black z-20">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Display Size */}
            <FadeInSection delay={100} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Screen</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{displaySize}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Vibrant visuals</p>
            </FadeInSection>

            {/* Refresh Rate */}
            <FadeInSection delay={200} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-indigo-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Smoothness</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{refreshRate}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Ultra-fluid interactions</p>
            </FadeInSection>

            {/* Processor */}
            <FadeInSection delay={300} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Power</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{processor}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Flagship processing</p>
            </FadeInSection>

            {/* Storage */}
            <FadeInSection delay={400} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-indigo-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Storage</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{storage}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Room for everything</p>
            </FadeInSection>

            {/* Battery */}
            <FadeInSection delay={500} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Endurance</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{battery}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">All-day power</p>
            </FadeInSection>

            {/* Connectivity */}
            <FadeInSection delay={600} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-indigo-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Connectivity</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{connectivity}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Blazing fast speeds</p>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* 3. DISPLAY SECTION */}
      <section className="bg-black py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/xiaomi_display.png" 
                fill
                alt="Display Experience" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Cinematic <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Clarity.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Equipped with an expansive {displaySize} screen and an ultra-fluid {refreshRate} refresh rate, every movie, game, and document comes to life with breathtaking detail and smoothness.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 4. PERFORMANCE SECTION */}
      <section className="bg-black py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row-reverse items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/xiaomi_performance.png" 
                fill
                alt="Tablet Performance" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Unleashed <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Potential.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Powered by the formidable {processor} and backed by a massive {battery} battery. Multitask effortlessly, play demanding games, and power through your entire day without missing a beat.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 5. LIFESTYLE SECTION */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-black overflow-hidden border-t border-neutral-900">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/xiaomi_lifestyle.png"
            fill
            alt="Xiaomi Lifestyle"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center mt-32">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Everyday Creativity.</span>
            </h2>
            <p className="text-2xl text-neutral-300 font-light max-w-2xl mx-auto drop-shadow-md">
              Whether you are sketching a masterpiece, analyzing data, or streaming your favorite shows, the Xiaomi Pad 6 adapts to your life effortlessly.
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
  );
}
