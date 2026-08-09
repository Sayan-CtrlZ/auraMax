"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/hero/slide-1.jpg", alt: "Luxurious morning skincare routine" },
  { src: "/hero/slide-2.jpg", alt: "Stylish woman in casual linen outfit" },
  { src: "/hero/slide-3.jpg", alt: "Glossy hair under warm studio lighting" },
  { src: "/hero/slide-4.jpg", alt: "Premium beauty products flatlay" },
  { src: "/hero/slide-5.jpg", alt: "Man in smart casual style guide outfit" },
  { src: "/hero/slide-6.webp", alt: "Luna skincare elixir and Aurora nourishing cream on stone" },
  { src: "/hero/slide-7.webp", alt: "Aura brand custom hangers with dusty rose shirt and velvet jacket" },
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden bg-stone-950">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            {/* Subtle dark overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Left Content Area */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full md:w-7/12 lg:w-5/12 z-20 pl-6 md:pl-16 pr-6 md:pr-0 text-left space-y-6">
        <h1 className="text-4xl md:text-6xl font-serif font-medium text-white leading-[1.15] drop-shadow-md animate-fade-in" style={{ animationDelay: "150ms" }}>
          Refine Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-rose via-brand-magenta via-brand-gold to-white font-semibold italic">
            Signature Aura
          </span>
        </h1>
        
        <p className="text-stone-200 text-sm md:text-base font-light max-w-md leading-relaxed animate-fade-in" style={{ animationDelay: "300ms" }}>
          AuraMax synthesizes advanced dermal analysis, bespoke style lookbooks, and texture-specific haircare rituals tailored exclusively to reflect your essence.
        </p>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 animate-fade-in" style={{ animationDelay: "450ms" }}>
          <a
            href="/login"
            className="bg-[#8C5E3C] hover:bg-[#704A2E] text-white text-center rounded-full px-8 py-3.5 font-semibold text-sm transition-all shadow-lg hover:shadow-[#8C5E3C]/20 active:translate-y-[1px] duration-300"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-center rounded-full px-8 py-3.5 font-semibold text-sm transition-all md:backdrop-blur-sm active:translate-y-[1px] duration-300"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-6 bg-amber-50"
                : "w-2.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
