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

export default function OnePlusBudsMLP({ product }: MLPProps) {
  // Data mapping from backend parameters
  const attr = product?.variant_attributes || {};
  
  // Extract features dynamically or fallback to premium defaults
  const caseType = attr.case_type || product?.case_type || "Matte Finish Pebble Case";
  const driverSize = attr.driver_size || product?.driver_size || "11mm Dynamic Drivers";
  const batteryLife = attr.battery_life || product?.battery_life || "Up to 38 hours";
  const waterResistance = attr.water_resistance || product?.water_resistance || "IP55 Rating";

  return (
    // Base dark theme wrapper with cinematic OnePlus vibe
    <div className="w-full bg-black text-white font-sans tracking-tight overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden bg-black">
        {/* Glow Effects - OnePlus aesthetic (Red & Cyan) */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-16">
          
          {/* Hero Left (Typography) */}
          <FadeInSection className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-sm leading-tight">
              {sanitize(product?.title) || "OnePlus Buds Pro 3"}
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-neutral-300">
              Hear Every Detail.
            </h2>
            
            {/* Tagline Bullets */}
            <ul className="text-lg md:text-xl text-neutral-400 space-y-4 pt-4">
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Immersive Hi-Fi sound</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Long-lasting battery</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Seamless wireless experience</span>
              </li>
            </ul>

            {/* Premium CTA */}
            <div className="pt-8 w-full flex justify-center md:justify-start">
              <Link
                href="/product/OnePlus%20Buds%20Pro%203%20Variant%207"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] overflow-hidden"
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
             <div className="absolute inset-0 bg-red-500/20 blur-[120px] rounded-full scale-110 z-0"></div>
             <div className="relative w-full max-w-2xl aspect-square animate-[float_6s_ease-in-out_infinite] z-10 flex items-center justify-center">
                <Image
                  src="/buds_home.png"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={sanitize(product?.title) || "OnePlus Buds Pro 3"}
                  className="object-contain drop-shadow-[0_25px_60px_rgba(239,68,68,0.3)]"
                />
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* 2. DYNAMIC TECHNICAL FEATURES SECTION */}
      <section className="py-24 relative bg-black z-20">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Drivers */}
            <FadeInSection delay={100} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Drivers</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{driverSize}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Precision crafted audio</p>
            </FadeInSection>

            {/* ANC */}
            <FadeInSection delay={200} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-cyan-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Silence</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">Active Noise Cancellation</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Block out the world</p>
            </FadeInSection>

            {/* Spatial Audio */}
            <FadeInSection delay={300} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Immersion</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">Spatial Audio Support</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">3D soundstage</p>
            </FadeInSection>

            {/* Battery */}
            <FadeInSection delay={400} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-cyan-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Battery</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{batteryLife}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Non-stop listening</p>
            </FadeInSection>

            {/* Case */}
            <FadeInSection delay={500} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Design</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{caseType}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Sleek and portable</p>
            </FadeInSection>

            {/* Durability */}
            <FadeInSection delay={600} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-cyan-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Durability</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{waterResistance}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Workout ready</p>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* 3. AUDIO QUALITY SECTION */}
      <section className="bg-black py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/buds_audio.png" 
                fill
                alt="Audio Quality" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Flawless <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Acoustics.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Equipped with {driverSize}, experience deep, resonant bass and crisp, clear treble. Every beat is rendered with pure precision, transforming how you listen to music.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 4. PERFORMANCE SECTION */}
      <section className="bg-black py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row-reverse items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/buds_performance.png" 
                fill
                alt="Battery Performance" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Unstoppable <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Energy.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Power through your longest days with {batteryLife}. When you finally run low, warp charge delivers 10 hours of playtime in just 10 minutes.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 5. LIFESTYLE SECTION */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-black overflow-hidden border-t border-neutral-900">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/buds_lifestyle.png"
            fill
            alt="Buds Lifestyle"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center mt-32">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-cyan-500">Every Moment.</span>
            </h2>
            <p className="text-2xl text-neutral-300 font-light max-w-2xl mx-auto drop-shadow-md">
              From intense workouts to deep focus sessions. Lightweight comfort that stays perfectly in place, all day long.
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
