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

export default function CanonEOSR50MLP({ product }: MLPProps) {
  // Data mapping from backend parameters
  const attr = product?.variant_attributes || {};
  
  // Extract features dynamically or fallback to premium defaults
  const lensKit = attr.lens_kit || product?.lens_kit || "RF-S 18-45mm f/4.5-6.3 IS STM";
  const resolution = attr.resolution || product?.resolution || "24.2 Megapixel";
  const sensorType = attr.sensor_type || product?.sensor_type || "APS-C CMOS Sensor";
  const videoCapability = attr.video_capability || product?.video_capability || "Uncropped 4K 30p Video";
  const autoFocus = "Dual Pixel CMOS AF II";
  const design = "Creator-Friendly Compact Design";

  const isLoggedIn = useIsLoggedInValue();

  return (
    // Base dark theme wrapper with cinematic vibe
    <MlpAnalyticsWrapper slug="canon-eos-r50">
    <div className="w-full bg-neutral-950 text-white font-sans tracking-tight overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section data-mlp-section="hero" className="relative w-full min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden bg-neutral-950">
        {/* Glow Effects - Warm Red/White Aesthetic */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-16">
          
          {/* Hero Left (Typography) */}
          <FadeInSection className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-sm leading-tight">
              {sanitize(product?.title) || "Canon EOS R50"}
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-neutral-300">
              Capture Creativity in Every Frame.
            </h2>
            
            {/* Tagline Bullets */}
            <ul className="text-lg md:text-xl text-neutral-400 space-y-4 pt-4">
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Stunning 24MP image clarity</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Cinematic 4K video recording</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                <span>Lightweight creator-focused design</span>
              </li>
            </ul>

            {/* Premium CTA */}
            <div className="pt-8 w-full flex justify-center md:justify-start">
              <Link
                href="/product/canon-eos-r50-2"
                onClick={() => trackMlpBuyNowClick("canon-eos-r50", isLoggedIn)}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 hover:scale-105 hover:shadow-[0_0_35px_rgba(225,29,72,0.55)] overflow-hidden"
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
                  src="/canon_home.png"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={sanitize(product?.title) || "Canon EOS R50"}
                  className="object-contain drop-shadow-[0_25px_60px_rgba(239,68,68,0.25)]"
                />
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* 2. DYNAMIC TECHNICAL FEATURES SECTION */}
      <section data-mlp-section="technical_features" className="py-24 relative bg-neutral-950 z-20">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Resolution */}
            <FadeInSection delay={100} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Resolution</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{resolution}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Breathtaking detail</p>
            </FadeInSection>

            {/* Sensor */}
            <FadeInSection delay={200} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-rose-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Sensor</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">{sensorType}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Superior low-light performance</p>
            </FadeInSection>

            {/* Video */}
            <FadeInSection delay={300} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Video</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{videoCapability}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Cinematic storytelling</p>
            </FadeInSection>

            {/* Lens */}
            <FadeInSection delay={400} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] hover:border-rose-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-rose-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Optics</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{lensKit}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Versatile framing</p>
            </FadeInSection>

            {/* AutoFocus */}
            <FadeInSection delay={500} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Focus</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{autoFocus}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Track every movement</p>
            </FadeInSection>

            {/* Design */}
            <FadeInSection delay={600} className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] hover:border-rose-500/30 transition-all duration-300 ease-in-out">
              <svg className="w-10 h-10 text-rose-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <h4 className="text-neutral-400 text-sm tracking-widest uppercase mb-1">Build</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight text-wrap">{design}</p>
              <p className="text-neutral-500 text-sm group-hover:text-neutral-300 transition-colors">Go anywhere, shoot anything</p>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* 3. IMAGE QUALITY SECTION */}
      <section data-mlp-section="image_quality" className="bg-neutral-950 py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/canon_image.png" 
                fill
                alt="Image Quality" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter brightness-110 group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Flawless <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600">Visual Depth.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Experience the spectacular realism of the {resolution} {sensorType}. Vivid colors, stunning contrast, and incredible dynamic range empower you to capture the world as you truly see it.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 4. PERFORMANCE / VIDEO SECTION */}
      <section data-mlp-section="performance" className="bg-neutral-950 py-32 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row-reverse items-center gap-16">
          <FadeInSection className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-rose-500/10 blur-3xl rounded-full z-0 translate-y-4 pointer-events-none"></div>
            <div className="relative z-10 w-full aspect-square flex items-center justify-center">
              <Image 
                src="/canon_performance.png" 
                fill
                alt="Camera Performance" 
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] filter brightness-110 group-hover:scale-105 transition-all duration-700 ease-out" 
              />
            </div>
          </FadeInSection>
          <FadeInSection delay={200} className="w-full md:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Cinematic <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-600">Motion.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
              Elevate your content with {videoCapability}. The included {lensKit} lens provides the perfect focal length versatility to craft your story, giving every shot a professional cinema-quality finish.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 5. LIFESTYLE SECTION */}
      <section data-mlp-section="lifestyle" className="relative w-full min-h-[80vh] flex items-center justify-center bg-neutral-950 overflow-hidden border-t border-neutral-900">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/canon_lifestyle.png"
            fill
            alt="Lifestyle Creator"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center mt-32">
          <FadeInSection>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">Modern Storytelling.</span>
            </h2>
            <p className="text-2xl text-neutral-300 font-light max-w-2xl mx-auto drop-shadow-md">
              Whether you are vlogging on the streets or capturing timeless portraits, the Canon EOS R50 handles it effortlessly so you can focus on your creativity.
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
