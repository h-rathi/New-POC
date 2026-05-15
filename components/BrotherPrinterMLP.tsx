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

export default function BrotherPrinterMLP({ product }: MLPProps) {
  // Data mapping from backend parameters
  const attr = product?.variant_attributes || {};
  
  // Extract features dynamically or fallback to premium defaults
  const printSpeed = attr.print_speed || product?.print_speed || "Up to 30 ppm";
  const connectivity = attr.connectivity || product?.connectivity || "High-Speed USB 2.0";
  const functionType = attr.function_type || product?.function_type || "Single Function Monochrome";
  const printTechnology = attr.print_technology || product?.print_technology || "Electrophotographic Laser";
  
  // Hardcoded premium features
  const efficiency = "High Efficiency Printing";
  const design = "Compact Office Design";

  const isLoggedIn = useIsLoggedInValue();

  return (
    // Base dark theme wrapper with professional workspace vibe
    <MlpAnalyticsWrapper slug="brother-hl-l2321d">
    <div className="w-full bg-neutral-950 text-white font-sans tracking-tight overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section data-mlp-section="hero" className="relative w-full min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden bg-neutral-950">
        {/* Glow Effects - Cyan/White Aesthetic */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-slate-300/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-16">
          
          {/* Hero Left (Typography) */}
          <FadeInSection className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-sm leading-tight">
              {sanitize(product?.title) || "Brother HL-L2321D"}
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-neutral-300">
              Designed for Fast, Reliable Printing.
            </h2>
            
            {/* Tagline Bullets */}
            <ul className="text-lg md:text-xl text-neutral-400 space-y-4 pt-4">
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Efficient everyday printing</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Compact workspace-friendly design</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Reliable performance for productivity</span>
              </li>
            </ul>

            {/* Premium CTA */}
            <div className="pt-8 w-full flex justify-center md:justify-start">
              <Link
                href="/product/brother-hl-l2321d-1"
                onClick={() => trackMlpBuyNowClick("brother-hl-l2321d", isLoggedIn)}
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
             <div className="relative w-full max-w-lg aspect-square animate-[float_6s_ease-in-out_infinite] z-10 flex items-center justify-center">
                <Image
                  src="/printer_home.png"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={sanitize(product?.title) || "Brother HL-L2321D"}
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
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{printSpeed}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Less waiting, more doing</p>
            </FadeInSection>

            {/* Print Technology */}
            <FadeInSection delay={200} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Technology</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{printTechnology}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Crisp and professional results</p>
            </FadeInSection>

            {/* Connectivity */}
            <FadeInSection delay={300} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-cyan-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Connectivity</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{connectivity}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Reliable wired performance</p>
            </FadeInSection>

            {/* Function Type */}
            <FadeInSection delay={400} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Function</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{functionType}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Dedicated printing focus</p>
            </FadeInSection>

            {/* Efficiency */}
            <FadeInSection delay={500} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-cyan-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Productivity</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{efficiency}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Keep your workflow moving</p>
            </FadeInSection>

            {/* Design */}
            <FadeInSection delay={600} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Footprint</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{design}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Fits perfectly anywhere</p>
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
                src="/printer_quality.png" 
                fill
                alt="Print Quality" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Uncompromising <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">Clarity.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Powered by advanced {printTechnology}, the HL-L2321D ensures every document features crisp, sharp text and excellent graphics. Delivering professional quality that stands out.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 4. PERFORMANCE / CONNECTIVITY SECTION */}
      <section data-mlp-section="performance" className="bg-neutral-950 py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row-reverse items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-slate-500/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/printer_performance.png" 
                fill
                alt="Printer Performance" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Seamless <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Productivity.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              With a rapid {printSpeed} output and dependable {connectivity}, your workspace stays efficient and moving. Experience a true {functionType} powerhouse that never slows you down.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 5. LIFESTYLE SECTION */}
      <section data-mlp-section="lifestyle" className="relative w-full min-h-[80vh] flex items-center justify-center bg-neutral-950 overflow-hidden border-t border-neutral-900">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/printer_lifestyle.png"
            fill
            alt="Office Lifestyle"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center mt-32">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">Everyday Productivity.</span>
            </h2>
            <p className="text-2xl text-neutral-300 font-light max-w-2xl mx-auto drop-shadow-md">
              From busy home offices to bustling small business environments, the Brother HL-L2321D is the quiet, compact engine driving your success.
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
