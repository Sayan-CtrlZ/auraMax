"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function GlobalLoader({ isVisible = false, message = "Preparing Your Aura", subMessage = "Elevating luxury experiences" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF6F0] flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="relative">
        {/* Animated glowing rings */}
        <div className="absolute -inset-4 rounded-full border border-brand-rose/20 animate-[spin_4s_linear_infinite]" />
        <div className="absolute -inset-8 rounded-full border border-brand-purple/20 animate-[spin_5s_linear_infinite_reverse]" />
        
        {/* Center Logo */}
        <div className="w-24 h-24 rounded-full bg-white shadow-xl border border-stone-100 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-rose/10 via-transparent to-brand-purple/10 animate-pulse" />
          <img loading="lazy" 
            src="/logo_for_header.webp" 
            alt="AuraMax Loading" 
            className="w-16 h-auto object-contain animate-pulse" 
          />
        </div>
        
        {/* Floating sparkles */}
        <Sparkles className="absolute -top-4 -right-4 text-brand-gold animate-bounce" size={20} />
        <Sparkles className="absolute -bottom-2 -left-4 text-brand-rose animate-bounce delay-150" size={16} />
      </div>

      <div className="mt-12 space-y-3 text-center">
        <h2 className="text-xl font-serif text-stone-800 tracking-wide flex items-center justify-center space-x-1">
          <span>{message}</span>
          <span className="flex space-x-1 ml-1">
            <span className="animate-[bounce_1s_infinite_0ms] text-brand-rose">.</span>
            <span className="animate-[bounce_1s_infinite_200ms] text-brand-purple">.</span>
            <span className="animate-[bounce_1s_infinite_400ms] text-brand-gold">.</span>
          </span>
        </h2>
        <p className="text-sm text-stone-500 font-light tracking-wide animate-pulse">
          {subMessage}
        </p>
      </div>
    </div>
  );
}
