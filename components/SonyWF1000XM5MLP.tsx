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

export default function SonyWF1000XM5MLP({ product }: MLPProps) {
  // Data mapping from backend parameters
  const attr = product?.variant_attributes || {};
  
  // Extract features dynamically or fallback to premium defaults
  const batteryLife = attr.battery_life || product?.battery_life || "Up to 24 hours";
  const driverSize = attr.driver_size || product?.driver_size || "8.4mm Dynamic Driver X";
  const noiseCancellation = attr.noise_cancellation || product?.noise_cancellation || "Dual Feedback Mics";
  const waterResistance = attr.water_resistance || product?.water_resistance || "IPX4 Water Resistant";
  const bluetooth = attr.bluetooth || product?.bluetooth || "Bluetooth 5.3";
  const charging = attr.charging || product?.charging || "Qi Wireless Charging";

  return (
    // Base dark theme wrapper with cinematic vibe
    <div className="w-full bg-neutral-950 text-white font-sans tracking-tight overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden bg-neutral-950">
        {/* Glow Effects - Silver/Blue Aesthetic */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-slate-300/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-16">
          
          {/* Hero Left (Typography) */}
          <FadeInSection className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-sm leading-tight">
              {sanitize(product?.title) || "Sony WF-1000XM5"}
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-neutral-300">
              Silence the World. Hear Every Detail.
            </h2>
            
            {/* Tagline Bullets */}
            <ul className="text-lg md:text-xl text-neutral-400 space-y-4 pt-4">
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Industry-leading noise cancellation</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Immersive Hi-Res audio</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Lightweight all-day comfort</span>
              </li>
            </ul>

            {/* Premium CTA */}
            <div className="pt-8 w-full flex justify-center md:justify-start">
              <Link
                href="/product/Sony%20WF-1000XM5%20Variant%203"
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
             <div className="absolute inset-0 bg-slate-400/20 blur-[120px] rounded-full scale-110 z-0"></div>
             <div className="relative w-full max-w-2xl aspect-square animate-[float_6s_ease-in-out_infinite] z-10 flex items-center justify-center">
                <Image
                  src="/sonybuds_home.png"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={sanitize(product?.title) || "Sony WF-1000XM5"}
                  className="object-contain drop-shadow-[0_25px_60px_rgba(203,213,225,0.2)]"
                />
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* 2. DYNAMIC TECHNICAL FEATURES SECTION */}
      <section className="py-24 relative bg-neutral-950 z-20">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Drivers */}
            <FadeInSection delay={100} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(203,213,225,0.15)] hover:border-slate-400/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Acoustics</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{driverSize}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Rich, detailed vocals</p>
            </FadeInSection>

            {/* ANC */}
            <FadeInSection delay={200} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(203,213,225,0.15)] hover:border-slate-400/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Silence</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{noiseCancellation}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Cancel out the world</p>
            </FadeInSection>

            {/* Battery */}
            <FadeInSection delay={300} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(203,213,225,0.15)] hover:border-slate-400/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Battery</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{batteryLife}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Uninterrupted playback</p>
            </FadeInSection>

            {/* Bluetooth */}
            <FadeInSection delay={400} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Connectivity</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{bluetooth}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Multipoint connection</p>
            </FadeInSection>

            {/* Charging */}
            <FadeInSection delay={500} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(203,213,225,0.15)] hover:border-slate-400/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Power</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{charging}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Effortless power-ups</p>
            </FadeInSection>

            {/* Durability */}
            <FadeInSection delay={600} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Durability</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{waterResistance}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Everyday protection</p>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* 3. AUDIO QUALITY SECTION */}
      <section className="bg-neutral-950 py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-slate-500/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/sonybuds_audio.png" 
                fill
                alt="Audio Quality" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Astonishing <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">Sound Quality.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Experience the breathtaking fidelity of {driverSize}. High-Resolution Audio Wireless combined with edge-AI upscale compressed digital music in real time, restoring the high-range sound lost in compression.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 4. PERFORMANCE SECTION */}
      <section className="bg-neutral-950 py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row-reverse items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/sonybuds_performance.png" 
                fill
                alt="Battery Performance" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Unmatched <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">Endurance.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Listen for hours on end with {batteryLife}. When you need a quick boost, just 3 minutes of {charging} gives you up to 60 minutes of playtime. Plus, {noiseCancellation} ensures absolute silence in any environment.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 5. LIFESTYLE SECTION */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-neutral-950 overflow-hidden border-t border-neutral-900">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/sonybuds_lifestyle.png"
            fill
            alt="Buds Lifestyle"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center mt-32">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-blue-300">Pure Listening.</span>
            </h2>
            <p className="text-2xl text-neutral-300 font-light max-w-2xl mx-auto drop-shadow-md">
              From your morning commute to deep focus sessions. Featuring an ergonomic design and soft-fit ear tips for continuous all-day comfort.
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
