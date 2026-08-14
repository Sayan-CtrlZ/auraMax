"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useResultStore } from "@/store/useResultStore";
import { Sparkles, Activity, ShieldCheck, Heart, ArrowRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";

export default function DashboardView() {
  const { user } = useAuth();
  const { history, fetchHistory } = useResultStore();
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const fetchUserHistory = async () => {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        await fetchHistory(token);
      }
    };
    fetchUserHistory();
  }, [user]);

  const getGreetingName = () => {
    if (!user || (!user.name && !user.displayName)) return "User";
    const name = user.displayName || user.name;
    return name.split(" ")[0];
  };

  const getCategoryGradient = (category) => {
    switch (category?.toLowerCase()) {
      case "skincare":
        return "bg-gradient-to-r from-amber-500/5 to-transparent hover:from-amber-500/10";
      case "fashion":
        return "bg-gradient-to-r from-brand-rose/5 to-transparent hover:from-brand-rose/10";
      case "hair":
        return "bg-gradient-to-r from-brand-purple/5 to-transparent hover:from-brand-purple/10";
      default:
        return "hover:bg-stone-50/80";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "skincare":
        return <img loading="lazy" src="/icon-skincare.webp" alt="Skincare" className="w-full h-full object-cover" />;
      case "fashion":
        return <img loading="lazy" src="/icon-fashion.webp" alt="Fashion" className="w-full h-full object-cover" />;
      case "hair":
        return <img loading="lazy" src="/icon-hair.webp" alt="Hair" className="w-full h-full object-cover" />;
      default:
        return <img loading="lazy" src="/icon-activity.webp" alt="Activity" className="w-full h-full object-cover" />;
    }
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] relative overflow-hidden text-stone-900 pb-16">
      
      {/* Background Watermarks matching LandingPage */}
      <div 
        className="fixed left-0 top-0 bottom-0 w-full md:w-1/2 bg-[url('/bg_features_unisex.webp')] bg-[length:700px] bg-no-repeat bg-[position:-120px_120px] opacity-[0.25] pointer-events-none mix-blend-multiply\" 
        style={{ maskImage: 'radial-gradient(ellipse at 10% 20%, black 10%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 10% 20%, black 10%, transparent 70%)' }}
      />
      <div 
        className="fixed right-0 top-0 bottom-0 w-full md:w-1/2 bg-[url('/bg_features_unisex.webp')] bg-[length:700px] bg-no-repeat bg-right-top opacity-[0.25] pointer-events-none mix-blend-multiply\" 
        style={{ maskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 70%)' }}
      />

      <div className="relative z-10 pt-28 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        
        {/* Elegant Greeting (Removed Black Banner) */}
        <div className="text-center md:text-left max-w-2xl space-y-4 pt-4">

          <h1 className="text-4xl md:text-6xl font-serif font-medium text-stone-900 leading-[1.1] tracking-tight">
            {greeting}, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-gold font-semibold">{getGreetingName()}</span>
          </h1>
          <p className="text-stone-800 text-sm md:text-base font-normal max-w-md md:max-w-lg mx-auto md:mx-0">
            Let&apos;s analyze your skin condition, design your signature look, or curate your weekly hair ritual.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900 border-b border-stone-200/50 pb-4">AI Consultations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Skincare Card */}
            <div className="group relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-3xl border-4 border-amber-400/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-amber-400 flex flex-col h-full">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl -mr-10 -mb-10 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative w-full h-48 overflow-hidden bg-stone-100/50 border-b-2 border-amber-400/20">
                <img loading="lazy" src="/artwork-skincare.webp" alt="AI Skincare Scan" className="w-full h-full object-cover transition-transform duration-700 transform-gpu will-change-transform group-hover:scale-110" />
              </div>
              <div className="p-6 md:p-8 pt-0 flex flex-col justify-between flex-grow relative z-10">
                <div className="space-y-3">
                  <div className="w-14 h-14 -mt-7 relative z-20 rounded-2xl overflow-hidden shadow-md border border-white shrink-0">
                    <img loading="lazy" src="/icon-skincare.webp" alt="Skincare Icon" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800 group-hover:text-amber-700 transition-colors pt-2">AI Skincare Scan</h3>
                    <p className="text-sm text-stone-500 font-light mt-2 leading-relaxed">
                      Identify hydration metrics, acne spots, and skin barriers from a single photo. Get a tailored morning and evening skincare calendar.
                    </p>
                  </div>
                </div>
                <Link 
                  href="/skincare" 
                  className="mt-8 inline-flex items-center justify-between w-full px-5 py-3.5 bg-gradient-to-r from-amber-500/5 to-transparent hover:from-amber-500/10 hover:to-yellow-400/5 text-amber-700/80 hover:text-amber-800 border border-amber-500/10 hover:border-amber-500/20 rounded-2xl text-sm font-medium transition-all shadow-sm group/link md:backdrop-blur-md"
                >
                  <span>Launch Skincare Scan</span>
                  <div className="bg-white/60 text-amber-700/70 rounded-full p-1.5 flex items-center justify-center shadow-sm group-hover/link:bg-white/90 group-hover/link:text-amber-700 group-hover/link:shadow group-hover/link:translate-x-1 transition-all">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </div>
            </div>

            {/* Fashion Card */}
            <div className="group relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-3xl border-4 border-brand-rose/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-brand-rose flex flex-col h-full">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-rose/15 rounded-full blur-3xl -mr-10 -mb-10 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative w-full h-48 overflow-hidden bg-stone-100/50 border-b-2 border-brand-rose/20">
                <img loading="lazy" src="/artwork-fashion.webp" alt="AI Outfit Curator" className="w-full h-full object-cover transition-transform duration-700 transform-gpu will-change-transform group-hover:scale-110" />
              </div>
              <div className="p-6 md:p-8 pt-0 flex flex-col justify-between flex-grow relative z-10">
                <div className="space-y-3">
                  <div className="w-14 h-14 -mt-7 relative z-20 rounded-2xl overflow-hidden shadow-md border border-white shrink-0">
                    <img loading="lazy" src="/icon-fashion.webp" alt="Fashion Icon" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800 group-hover:text-brand-rose transition-colors pt-2">AI Outfit Curator</h3>
                    <p className="text-sm text-stone-500 font-light mt-2 leading-relaxed">
                      Select a vibe, occasions, and color palettes. Receive beautiful outfit guides consisting of tops, pants, shoes, and layering options.
                    </p>
                  </div>
                </div>
                <Link 
                  href="/fashion" 
                  className="mt-8 inline-flex items-center justify-between w-full px-5 py-3.5 bg-gradient-to-r from-brand-rose/5 to-transparent hover:from-brand-rose/10 hover:to-pink-400/5 text-brand-rose/80 hover:text-brand-rose border border-brand-rose/10 hover:border-brand-rose/20 rounded-2xl text-sm font-medium transition-all shadow-sm group/link md:backdrop-blur-md"
                >
                  <span>Curate Outfits</span>
                  <div className="bg-white/60 text-brand-rose/70 rounded-full p-1.5 flex items-center justify-center shadow-sm group-hover/link:bg-white/90 group-hover/link:text-brand-rose group-hover/link:shadow group-hover/link:translate-x-1 transition-all">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </div>
            </div>

            {/* Hair Card */}
            <div className="group relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-3xl border-4 border-brand-purple/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-brand-purple flex flex-col h-full">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-purple/15 rounded-full blur-3xl -mr-10 -mb-10 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative w-full h-48 overflow-hidden bg-stone-100/50 border-b-2 border-brand-purple/20">
                <img loading="lazy" src="/artwork-hair.webp" alt="AI Hair Planner" className="w-full h-full object-cover transition-transform duration-700 transform-gpu will-change-transform group-hover:scale-110" />
              </div>
              <div className="p-6 md:p-8 pt-0 flex flex-col justify-between flex-grow relative z-10">
                <div className="space-y-3">
                  <div className="w-14 h-14 -mt-7 relative z-20 rounded-2xl overflow-hidden shadow-md border border-white shrink-0">
                    <img loading="lazy" src="/icon-hair.webp" alt="Hair Icon" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800 group-hover:text-brand-purple transition-colors pt-2">AI Hair Planner</h3>
                    <p className="text-sm text-stone-500 font-light mt-2 leading-relaxed">
                      Map hair type (wavy, curly, coily) and scalp hydration concerns. Receive a custom weekly hair washing calendar and product suggestions.
                    </p>
                  </div>
                </div>
                <Link 
                  href="/hair" 
                  className="mt-8 inline-flex items-center justify-between w-full px-5 py-3.5 bg-gradient-to-r from-brand-purple/5 to-transparent hover:from-brand-purple/10 hover:to-purple-400/5 text-brand-purple/80 hover:text-brand-purple border border-brand-purple/10 hover:border-brand-purple/20 rounded-2xl text-sm font-medium transition-all shadow-sm group/link md:backdrop-blur-md"
                >
                  <span>Generate Hair Plan</span>
                  <div className="bg-white/60 text-brand-purple/70 rounded-full p-1.5 flex items-center justify-center shadow-sm group-hover/link:bg-white/90 group-hover/link:text-brand-purple group-hover/link:shadow group-hover/link:translate-x-1 transition-all">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="group relative overflow-hidden bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-gold/10 rounded-full blur-2xl -ml-8 -mb-8" />
            <div className="relative z-10 flex items-center space-x-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 border-white shrink-0 group-hover:scale-105 transition-transform duration-500">
                <img loading="lazy" src="/icon-activity-1.webp" alt="Activity" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] text-brand-purple font-bold uppercase tracking-widest mb-1">Scans & Guides</p>
                <div className="flex items-baseline space-x-1.5">
                  <h3 className="text-3xl font-serif font-medium text-stone-900">{history.length}</h3>
                  <span className="text-sm text-stone-500 font-light">Saved</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl -ml-8 -mb-8" />
            <div className="relative z-10 flex items-center space-x-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 border-white shrink-0 group-hover:scale-105 transition-transform duration-500">
                <img loading="lazy" src="/icon-skincare.webp" alt="Skincare" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-1">Skin Aura</p>
                <div className="flex items-baseline space-x-1.5">
                  <h3 className="text-xl font-serif font-medium text-stone-900 mt-1">
                    {history.filter(h => h.category === "skincare").length > 0 ? "Radiant & Clear" : "Pending Scan"}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-magenta/10 rounded-full blur-2xl -ml-8 -mb-8" />
            <div className="relative z-10 flex items-center space-x-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 border-white shrink-0 group-hover:scale-105 transition-transform duration-500">
                <img loading="lazy" src="/icon-fashion.webp" alt="Fashion" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] text-brand-rose font-bold uppercase tracking-widest mb-1">Style Wardrobe</p>
                <div className="flex items-baseline space-x-1.5">
                  <h3 className="text-xl font-serif font-medium text-stone-900 mt-1">
                    {history.filter(h => h.category === "fashion").length > 0 ? "Active Curator" : "No Outfits"}
                  </h3>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Recent Activity Section */}
        <div className="space-y-6 pt-6">
          <div className="flex items-end justify-between border-b border-stone-200/50 pb-4">
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900">Recent Activity</h2>
            <Link href="/history" className="text-xs text-brand-purple hover:underline font-medium flex items-center space-x-1">
              <span>View full history</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          
          <div className="bg-white/80 md:backdrop-blur-md rounded-2xl border border-stone-200/50 shadow-sm overflow-hidden">
            {history.length > 0 ? (
              <div className="divide-y divide-stone-100">
                {history.slice(0, 3).map((item) => (
                  <div key={item.id} className={cn("p-5 flex items-center justify-between transition-colors", getCategoryGradient(item.category))}>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200/50 shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-stone-800">{item.title || "AI Consultation"}</h4>
                        <p className="text-xs text-stone-400 font-light mt-0.5">{formatTimestamp(item.timestamp)}</p>
                      </div>
                    </div>
                    <Link 
                      href="/history" 
                      className="text-xs px-4 py-2 border border-stone-200 rounded-full text-stone-600 hover:bg-stone-100 hover:text-stone-900 font-medium transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-stone-200 mx-auto">
                  <img loading="lazy" src="/icon-activity-1.webp" alt="Activity" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-stone-800">No analyses yet</h4>
                  <p className="text-sm text-stone-500 font-light mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Take your first skincare scan, outfit curation, or hair checkup to see details logged here.
                  </p>
                </div>
                <div className="pt-4">
                  <Link 
                    href="/skincare" 
                    className="inline-flex items-center space-x-2 bg-stone-900 text-white hover:bg-stone-800 text-sm px-6 py-2.5 rounded-full font-medium transition-colors"
                  >
                    <span>Analyze Skin Now</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

