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

export default function CanonPrinterMLP({ product }: MLPProps) {
  // Data mapping from backend parameters
  const attr = product?.variant_attributes || {};
  
  // Extract features dynamically or fallback to premium defaults
  const printSpeed = attr.print_speed || product?.print_speed || "10.8 ipm (Black) / 6.0 ipm (Color)";
  const connectivity = attr.connectivity || product?.connectivity || "Wireless & High-Speed USB";
  const functionType = attr.function_type || product?.function_type || "Print, Scan, Copy";
  const printTechnology = attr.print_technology || product?.print_technology || "Refillable Ink Tank System";
  
  // Hardcoded premium features
  const efficiency = "High-Volume Printing";
  const integration = "Smart Workspace Integration";

  const isLoggedIn = useIsLoggedInValue();

  return (
    // Base dark theme wrapper with professional workspace vibe
    <MlpAnalyticsWrapper slug="canon-pixma-g3020">
    <div className="w-full bg-neutral-950 text-white font-sans tracking-tight overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section data-mlp-section="hero" className="relative w-full min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden bg-neutral-950">
        {/* Glow Effects - Red/Cyan Aesthetic */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-16">
          
          {/* Hero Left (Typography) */}
          <FadeInSection className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-sm leading-tight">
              {sanitize(product?.title) || "Canon Pixma G3020"}
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-neutral-300">
              Precision Printing for Modern Workspaces.
            </h2>
            
            {/* Tagline Bullets */}
            <ul className="text-lg md:text-xl text-neutral-400 space-y-4 pt-4">
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>High-speed professional printing</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Reliable laser print technology</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Designed for efficient workflows</span>
              </li>
            </ul>

            {/* Premium CTA */}
            <div className="pt-8 w-full flex justify-center md:justify-start">
              <Link
                href="/product/canon-pixma-g3020-1"
                onClick={() => trackMlpBuyNowClick("canon-pixma-g3020", isLoggedIn)}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] overflow-hidden"
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
             <div className="absolute inset-0 bg-cyan-500/20 blur-[120px] rounded-full scale-110 z-0"></div>
             {/* Using max-w-lg to compress image size as requested previously */}
             <div className="relative w-full max-w-lg aspect-square animate-[float_6s_ease-in-out_infinite] z-10 flex items-center justify-center">
                <Image
                  src="/canonprinter_home.png"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={sanitize(product?.title) || "Canon Pixma G3020"}
                  className="object-contain drop-shadow-[0_25px_60px_rgba(6,182,212,0.25)]"
                />
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* 2. DYNAMIC TECHNICAL FEATURES SECTION */}
      <section data-mlp-section="technical_features" className="py-24 relative bg-neutral-950 z-20">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Print Speed */}
            <FadeInSection delay={100} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-cyan-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Speed</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{printSpeed}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Fast professional output</p>
            </FadeInSection>

            {/* Print Technology */}
            <FadeInSection delay={200} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Technology</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{printTechnology}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Vibrant professional results</p>
            </FadeInSection>

            {/* Connectivity */}
            <FadeInSection delay={300} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-cyan-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Connectivity</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{connectivity}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Seamless wireless performance</p>
            </FadeInSection>

            {/* Function Type */}
            <FadeInSection delay={400} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Function</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{functionType}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">All-in-one productivity</p>
            </FadeInSection>

            {/* Efficiency */}
            <FadeInSection delay={500} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-cyan-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Productivity</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{efficiency}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Designed for heavy workloads</p>
            </FadeInSection>

            {/* Smart Workspace */}
            <FadeInSection delay={600} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Ecosystem</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{integration}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Seamless modern office fit</p>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* 3. PRINT QUALITY SECTION */}
      <section data-mlp-section="print_quality" className="bg-neutral-950 py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-cyan-600/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/canonprinter_quality.png" 
                fill
                alt="Print Quality" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Flawless <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">Precision.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Powered by an advanced {printTechnology}, the Pixma G3020 ensures every document and photograph features brilliant color, sharp text, and unmatched depth.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 4. PERFORMANCE / CONNECTIVITY SECTION */}
      <section data-mlp-section="performance" className="bg-neutral-950 py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row-reverse items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/canonprinter_performance.png" 
                fill
                alt="Printer Performance" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Smart <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600">Connectivity.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              With {connectivity} capabilities and {printSpeed} print speeds, your workspace stays efficiently connected. Experience a true {functionType} ecosystem that never limits your workflow.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 5. LIFESTYLE SECTION */}
      <section data-mlp-section="lifestyle" className="relative w-full min-h-[80vh] flex items-center justify-center bg-neutral-950 overflow-hidden border-t border-neutral-900">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/canonprinter_lifestyle.png"
            fill
            alt="Workspace Lifestyle"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center mt-32">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">Smarter Productivity.</span>
            </h2>
            <p className="text-2xl text-neutral-300 font-light max-w-2xl mx-auto drop-shadow-md">
              From robust office environments to modern remote setups, the Canon Pixma G3020 is designed to elevate your professional standards.
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
