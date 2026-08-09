"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  Check, 
  Sparkle,
  Compass,
  Zap,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import HeroSlideshow from "./HeroSlideshow";

const SAMPLE_PALETTES = [
  { id: "auramax", name: "AuraMax Theme", colors: ["#5E2B80", "#C57676", "#D254A6", "#B8963E"] },
  { id: "monochrome", name: "Obsidian", colors: ["#1A1A1A", "#555555", "#A0A0A0", "#F0F0F0"] },
  { id: "pastel", name: "Pastel Dream", colors: ["#D4E2D4", "#F4EEA9", "#FAF3F0", "#FFD3B6"] },
];

const ScrollReveal = ({ children, direction = "left", className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.15 });

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const getTranslate = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100 scale-100";
    if (direction === "left") return "-translate-x-[20vw] opacity-0 scale-95";
    if (direction === "right") return "translate-x-[20vw] opacity-0 scale-95";
    if (direction === "up") return "translate-y-[20vh] opacity-0 scale-95";
    return "opacity-0";
  };

  return (
    <div ref={domRef} className={cn("transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]", getTranslate(), className)}>
      {children}
    </div>
  );
};

export default function LandingView() {
  // Interactive feature preview states
  const [skinScanActive, setSkinScanActive] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState(SAMPLE_PALETTES[0]);
  const [activeHairDay, setActiveHairDay] = useState("Mon");

  return (
    <div className="bg-[#FAF6F0] text-stone-900 selection:bg-brand-purple/20 selection:text-brand-purple scroll-smooth">
      {/* Hero Slideshow Section */}
      <HeroSlideshow />

      {/* Features Section Wrapper */}
      <div className="relative overflow-hidden bg-[#FAF6F0]">
        {/* Scattered Botanical Accents */}
        <div className="absolute -left-64 top-0 w-[1000px] h-[1000px] bg-[url('/bg-features.webp')] bg-contain bg-no-repeat opacity-[0.15] pointer-events-none mix-blend-multiply z-0" />
        <div className="absolute -right-80 top-[30%] w-[1200px] h-[1200px] bg-[url('/bg-features-right.webp')] bg-contain bg-no-repeat opacity-[0.15] pointer-events-none mix-blend-multiply z-0" />
        <div className="absolute -left-40 bottom-10 w-[800px] h-[800px] bg-[url('/decor-accent-1.webp')] bg-contain bg-no-repeat opacity-[0.15] pointer-events-none mix-blend-multiply z-0" />
        <section id="features" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1 bg-brand-purple/5 px-3 py-1 rounded-full text-brand-purple text-xs font-semibold tracking-wider uppercase">
            <Sparkle size={12} className="fill-brand-purple text-brand-purple" />
            <span>Consultation Pillars</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-stone-900">
            Intelligent Care, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-gold font-semibold">Tailored for You</span>
          </h2>
          <p className="text-stone-800 font-light text-sm md:text-base leading-relaxed">
            AuraMax combines state-of-the-art diagnostic logic with custom lifestyle curators to design your absolute best self.
          </p>
        </div>

        {/* Interactive Features Grid */}
        <div className="flex flex-col space-y-12 md:space-y-16 max-w-5xl mx-auto">
          
          {/* Skincare Scanner Feature */}
          <ScrollReveal direction="left">
            <div className="group relative bg-white rounded-2xl border-2 border-stone-200/80 p-6 md:p-10 shadow-lg hover:shadow-2xl hover:border-brand-purple/40 transition-all duration-500 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center overflow-hidden">
            
            {/* Foreground Artifact */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-100/40 to-transparent rounded-bl-[8rem] pointer-events-none" />
            
            {/* Text Content (Left) */}
            <div className="space-y-8 relative z-10 lg:order-1 order-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between lg:justify-start lg:space-x-4">
                  <img loading="lazy" src="/icon-skincare.webp" alt="Skincare Icon" className="w-14 h-14 object-contain rounded-xl shadow-sm border border-stone-100" />
                  <span className="text-[10px] md:text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-sm">
                    Skincare
                  </span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-serif font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                    AI Skin Analyzer
                  </h3>
                  <p className="text-base text-stone-800 font-light leading-relaxed max-w-md">
                    Instantly analyze your skin&apos;s unique needs from a single photograph using our advanced AI. Receive a highly personalized, dermatologist-approved daily routine designed specifically for Indian skin tones, ensuring a flawless, healthy, and glowing complexion year-round.
                  </p>
                </div>
              </div>
              <Link 
                href="/login" 
                className="inline-flex items-center space-x-2 text-sm font-semibold text-brand-purple hover:text-brand-magenta group/link"
              >
                <span>Launch Skincare Scan</span>
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Photo Output (Right) */}
            <div 
              className="relative h-72 md:h-96 lg:h-[450px] w-full rounded-2xl bg-stone-200 border border-stone-200/50 overflow-hidden cursor-pointer group/widget lg:order-2 order-1 shadow-md"
              onMouseEnter={() => setSkinScanActive(true)}
              onMouseLeave={() => setSkinScanActive(false)}
            >
                {/* Background Photo */}
                <img loading="lazy" src="/feature-skincare.webp" alt="Skincare AI Scan" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 transform-gpu will-change-transform group-hover/widget:scale-110" />
            </div>
          </div>
          </ScrollReveal>

          {/* Outfit Curator Feature */}
          <ScrollReveal direction="right">
            <div className="group relative bg-white rounded-2xl border-2 border-stone-200/80 p-6 md:p-10 shadow-lg hover:shadow-2xl hover:border-brand-rose/40 transition-all duration-500 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center overflow-hidden">
            
            {/* Foreground Artifact */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-brand-rose/10 to-transparent rounded-tr-[8rem] pointer-events-none" />
            
            {/* Photo Output (Left Desktop, Top Mobile) */}
            <div className="relative h-72 md:h-96 lg:h-[450px] w-full rounded-2xl bg-stone-200 border border-stone-200/50 overflow-hidden cursor-pointer group/widget order-1 shadow-md">
                <img loading="lazy" src="/feature-outfit.webp" alt="Outfit Curator AI" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 transform-gpu will-change-transform group-hover/widget:scale-110" />
            </div>

            {/* Text Content (Right Desktop, Bottom Mobile) */}
            <div className="space-y-8 relative z-10 order-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between lg:justify-start lg:space-x-4">
                  <img loading="lazy" src="/icon-fashion.webp" alt="Fashion Icon" className="w-14 h-14 object-contain rounded-xl shadow-sm border border-stone-100" />
                  <span className="text-[10px] md:text-xs font-bold text-brand-rose uppercase tracking-widest bg-brand-rose/5 border border-brand-rose/10 px-3 py-1.5 rounded-sm">
                    Styling
                  </span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-serif font-medium text-stone-900 group-hover:text-brand-rose transition-colors">
                    Outfit Curator
                  </h3>
                  <p className="text-base text-stone-800 font-light leading-relaxed max-w-md">
                    Select your desired vibe and upcoming occasion. Our styling AI acts as your personal luxury curator, assembling the perfect high-end outfit with flawlessly color-matched pieces that complement your unique features and cultural aesthetics, making you stand out effortlessly.
                  </p>
                </div>
              </div>
              <Link 
                href="/login" 
                className="inline-flex items-center space-x-2 text-sm font-semibold text-brand-purple hover:text-brand-magenta group/link"
              >
                <span>Curate Fits</span>
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          </ScrollReveal>

          {/* Hair Planner Feature */}
          <ScrollReveal direction="left">
            <div className="group relative bg-white rounded-2xl border-2 border-stone-200/80 p-6 md:p-10 shadow-lg hover:shadow-2xl hover:border-brand-purple/40 transition-all duration-500 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center overflow-hidden">
            
            {/* Foreground Artifact */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-purple/10 to-transparent rounded-bl-[8rem] pointer-events-none" />
            
            {/* Text Content (Left) */}
            <div className="space-y-8 relative z-10 lg:order-1 order-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between lg:justify-start lg:space-x-4">
                  <img loading="lazy" src="/icon-hair.webp" alt="Hair Icon" className="w-14 h-14 object-contain rounded-xl shadow-sm border border-stone-100" />
                  <span className="text-[10px] md:text-xs font-bold text-brand-purple uppercase tracking-widest bg-brand-purple/5 border border-brand-purple/10 px-3 py-1.5 rounded-sm">
                    Hair Care
                  </span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-serif font-medium text-stone-900 group-hover:text-brand-purple transition-colors">
                    Hair Ritual Planner
                  </h3>
                  <p className="text-base text-stone-800 font-light leading-relaxed max-w-md">
                    Unlock the secrets of your unique hair type and porosity. Receive a meticulously crafted, custom washing and treatment schedule featuring premium recommendations for vibrant, thick, and healthy hair, specifically addressing common concerns like humidity frizz or scalp hydration.
                  </p>
                </div>
              </div>
              <Link 
                href="/login" 
                className="inline-flex items-center space-x-2 text-sm font-semibold text-brand-purple hover:text-brand-magenta group/link"
              >
                <span>Build Hair Plan</span>
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Photorealistic Output (Right) */}
            <div className="relative h-72 md:h-96 lg:h-[450px] w-full rounded-2xl bg-stone-200 border border-stone-200/50 overflow-hidden cursor-pointer group/widget lg:order-2 order-1 shadow-md">
                <img loading="lazy" src="/feature-hair.webp" alt="Hair Ritual Planner AI" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 transform-gpu will-change-transform group-hover/widget:scale-110" />
            </div>
          </div>
          </ScrollReveal>

        </div>
      </section>
      </div>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-[#FAF6F0] py-24 border-t border-b border-stone-200/30 relative overflow-hidden">
        {/* Scattered Botanical Accents */}
        <div className="absolute -left-48 top-20 w-[1000px] h-[1000px] bg-[url('/bg-process.webp')] bg-contain bg-no-repeat opacity-[0.15] pointer-events-none mix-blend-multiply z-0" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-1 bg-stone-900/5 px-3 py-1 rounded-full text-stone-800 text-xs font-semibold tracking-wider uppercase">
              <Zap size={12} className="fill-stone-800 text-stone-800" />
              <span>Diagnostic Journey</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-stone-900">
              The Luxury Process
            </h2>
            <p className="text-stone-700 font-normal text-sm md:text-base leading-relaxed">
              Experience the seamless synthesis of technology and style consultation in three elegant movements.
            </p>
          </div>

          {/* Stepper Timeline */}
          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[52px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-stone-200 via-brand-magenta/30 to-stone-200 z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="text-center space-y-4 max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center font-serif text-lg font-semibold text-stone-800 shadow-sm mx-auto relative group hover:border-brand-purple transition-all duration-300">
                  <span className="group-hover:scale-110 transition-transform">01</span>
                  {/* Subtle pulsing background */}
                  <div className="absolute inset-0.5 rounded-full border border-stone-100 hover:border-brand-purple/20" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-stone-800">Provide Input</h3>
                <p className="text-xs md:text-sm text-stone-700 font-normal leading-relaxed px-4">
                  Take a clear portrait selfie under neutral lighting, or select custom aesthetic coordinates (minimalist, bold, bohemian).
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-4 max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center font-serif text-lg font-semibold text-stone-800 shadow-sm mx-auto relative group hover:border-brand-purple transition-all duration-300">
                  <span className="group-hover:scale-110 transition-transform">02</span>
                  <div className="absolute inset-0.5 rounded-full border border-stone-100 hover:border-brand-purple/20" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-stone-800">Aura Assessment</h3>
                <p className="text-xs md:text-sm text-stone-700 font-normal leading-relaxed px-4">
                  The diagnostic engine scans dermal markers or matches occasion briefs against coordinates to construct styled guides.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-4 max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center font-serif text-lg font-semibold text-stone-800 shadow-sm mx-auto relative group hover:border-brand-purple transition-all duration-300">
                  <span className="group-hover:scale-110 transition-transform">03</span>
                  <div className="absolute inset-0.5 rounded-full border border-stone-100 hover:border-brand-purple/20" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-stone-800">Bespoke Routines</h3>
                <p className="text-xs md:text-sm text-stone-700 font-normal leading-relaxed px-4">
                  Receive personalized morning/night schedules, clothing catalogs with exact hex tones, and weekly follicle wash planners.
                </p>
              </div>

            </div>
          </div>
          
          {/* Spacer before Pricing */}
          <div className="pt-24 md:pt-32" id="pricing">
            {/* Pricing Section Backgrounds */}
            <div className="absolute -right-48 bottom-10 w-[1000px] h-[1000px] bg-[url('/bg-pricing-right.webp')] bg-contain bg-no-repeat opacity-[0.15] pointer-events-none mix-blend-multiply z-0" />
            
            <div className="space-y-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1 bg-brand-purple/5 px-3 py-1 rounded-full text-brand-purple text-xs font-semibold tracking-wider uppercase">
            <Sparkle size={12} className="fill-brand-purple text-brand-purple" />
            <span>Premium Plans</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-stone-900">
            Tailored Membership
          </h2>
          <p className="text-stone-800 font-light text-sm md:text-base leading-relaxed">
            Choose the subscription plan that aligns with your pursuit of aesthetic excellence.
          </p>
        </div>

        {/* Pricing Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Basic */}
          <div className="bg-white rounded-3xl border border-stone-200/50 p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:border-stone-300">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Essential Access</span>
                <h3 className="text-2xl font-serif font-medium text-stone-800">Aura Basic</h3>
                <p className="text-xs text-stone-400 font-light">Explore basic style profiling.</p>
              </div>
              
              <div className="flex items-baseline py-4 border-t border-b border-stone-100">
                <span className="text-3xl md:text-4xl font-serif font-semibold text-stone-800">$0</span>
                <span className="text-xs text-stone-400 ml-1 font-light">/ forever</span>
              </div>

              <ul className="space-y-3.5 text-xs text-stone-600 font-light">
                <li className="flex items-center space-x-2.5">
                  <Check size={14} className="text-stone-400" />
                  <span>3 Skincare Scans per month</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check size={14} className="text-stone-400" />
                  <span>Basic Outfit Lookbooks</span>
                </li>
                <li className="flex items-center space-x-2.5 text-stone-300 line-through decoration-stone-200">
                  <Check size={14} />
                  <span>Interactive Hair Planner</span>
                </li>
                <li className="flex items-center space-x-2.5 text-stone-300 line-through decoration-stone-200">
                  <Check size={14} />
                  <span>Full History Persistence</span>
                </li>
              </ul>
            </div>

            <Link 
              href="/login"
              className="mt-8 block text-center py-3 bg-stone-100 hover:bg-stone-200/80 text-stone-850 rounded-xl text-xs font-semibold transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Plan 2: Signature (Featured) */}
          <div className="bg-white rounded-3xl border-2 border-brand-purple p-8 shadow-md relative flex flex-col justify-between transform md:-translate-y-2 transition-all duration-300">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 to-transparent pointer-events-none rounded-3xl" />
            
            {/* Featured Badge */}
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-brand-purple to-brand-magenta text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-brand-purple">
              Recommended
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest block">Signature Experience</span>
                <h3 className="text-2xl font-serif font-medium text-stone-800">Aura Pro</h3>
                <p className="text-xs text-brand-magenta font-light">Complete diagnostic and curation suite.</p>
              </div>

              <div className="flex items-baseline py-4 border-t border-b border-brand-purple/10">
                <span className="text-3xl md:text-4xl font-serif font-semibold text-stone-800">$19</span>
                <span className="text-xs text-stone-400 ml-1 font-light">/ month</span>
              </div>

              <ul className="space-y-3.5 text-xs text-stone-600 font-light">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={14} className="text-brand-purple" />
                  <span className="font-medium text-stone-800">Unlimited Skincare Scans</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={14} className="text-brand-purple" />
                  <span className="font-medium text-stone-800">Bespoke Styling Guides (with Hex codes)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={14} className="text-brand-purple" />
                  <span>Custom 7-day hair planners</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 size={14} className="text-brand-purple" />
                  <span>Full History Logs & Modals</span>
                </li>
              </ul>
            </div>

            <Link 
              href="/login"
              className="mt-8 block text-center py-3 bg-gradient-to-r from-brand-purple to-brand-magenta hover:opacity-95 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-purple/15 transition-all"
            >
              Start Signature Pro
            </Link>
          </div>

          {/* Plan 3: Luxe */}
          <div className="bg-white rounded-3xl border border-stone-200/50 p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:border-stone-300">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">VIP Consultation</span>
                <h3 className="text-2xl font-serif font-medium text-stone-800">Haute Couture</h3>
                <p className="text-xs text-stone-400 font-light">Direct human expert style refinement.</p>
              </div>

              <div className="flex items-baseline py-4 border-t border-b border-stone-100">
                <span className="text-3xl md:text-4xl font-serif font-semibold text-stone-800">$49</span>
                <span className="text-xs text-stone-400 ml-1 font-light">/ month</span>
              </div>

              <ul className="space-y-3.5 text-xs text-stone-600 font-light">
                <li className="flex items-center space-x-2.5">
                  <Check size={14} className="text-stone-400" />
                  <span>Everything included in <strong>Pro</strong></span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check size={14} className="text-stone-400" />
                  <span>Weekly 1-on-1 human expert reviews</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check size={14} className="text-stone-400" />
                  <span>Early access to avant-garde styles</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check size={14} className="text-stone-400" />
                  <span>Deeper AI diagnostic reports</span>
                </li>
              </ul>
            </div>

            <Link 
              href="/login"
              className="mt-8 block text-center py-3 bg-brand-gold hover:opacity-90 text-white rounded-xl text-xs font-semibold transition-all animate-pulse-subtle"
            >
              Request VIP Invitation
            </Link>
          </div>

            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Modern Luxury Footer */}
      <footer className="bg-stone-950 text-stone-400 py-16 px-6 md:px-12 border-t border-stone-800/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-stone-900 pb-12">
          
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-widest font-serif text-white block">
              AuraMax
            </span>
            <p className="text-xs font-light text-stone-800 leading-relaxed max-w-[240px]">
              Advanced artificial intelligence synthesis tailored to refine skin vitality, clothing lookbooks, and hair wellness.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Consultations</h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <Link href="/login" className="hover:text-brand-magenta transition-colors">Skincare Scan</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-magenta transition-colors">Style Curator</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-magenta transition-colors">Hair Planner</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-magenta transition-colors">Saved History</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <a href="#features" className="hover:text-brand-magenta transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-magenta transition-colors">How it works</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-brand-magenta transition-colors">Pricing Options</a>
              </li>
              <li>
                <span className="text-stone-600 cursor-not-allowed">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Connect</h4>
            <div className="flex space-x-3.5 pt-1 text-stone-400">
              <a href="#" className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all" aria-label="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all" aria-label="Twitter">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all" aria-label="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
                </svg>
              </a>
            </div>
            <p className="text-[10px] text-stone-600 font-light pt-2">
              Questions? Contact style@auramax.ai
            </p>
          </div>

        </div>

        {/* Copyright block */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] font-light text-stone-600 gap-4">
          <p>© {new Date().getFullYear()} AuraMax Inc. All rights reserved.</p>
          <p className="flex space-x-4">
            <span>Designed in Paris</span>
            <span>•</span>
            <span>Secured with SSL</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
