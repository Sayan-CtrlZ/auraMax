"use client";

import { useState, useRef } from "react";
import { useResultStore } from "@/store/useResultStore";
import { Compass, UploadCloud, Image as ImageIcon, X, Loader2, ArrowRight, ShoppingBag, ExternalLink, Sparkles, Upload, ChevronDown, Trash2 } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import GlobalLoader from "@/components/shared/GlobalLoader";

// Dropdown & Option Constants
const OCCASION_OPTIONS = [
  "College", "Office", "Casual day out", "Date", "Wedding",
  "Party", "Travel", "Festival", "Workout", "Formal event"
];

const WEATHER_OPTIONS = [
  "Hot & sunny", "Hot & humid", "Mild", "Cold", "Raining"
];

const STYLE_VIBES = [
  { id: "minimal", name: "Minimal & clean" },
  { id: "streetwear", name: "Streetwear" },
  { id: "boho", name: "Boho" },
  { id: "classic", name: "Classic & formal" },
  { id: "smart_casual", name: "Smart casual" },
  { id: "trendy", name: "Trendy & bold" },
  { id: "traditional", name: "Traditional" },
  { id: "sporty", name: "Sporty" },
  { id: "cottagecore", name: "Cottagecore" },
  { id: "edgy", name: "Dark & edgy" }
];

const FIT_OPTIONS = [
  "Oversized & relaxed", "Well-fitted", "Bodycon", "Mix of both"
];

const OUTFIT_TYPES = [
  "Full outfit suggestion", "Top only", "Bottom only", "Ethnic wear", "Western wear", "Mix"
];

const BUDGET_OPTIONS = [
  "Under ₹1000", "₹1000-3000", "₹3000-7000", "₹7000+", "No limit"
];

const MOCK_RESULTS = [
  {
    id: 1,
    title: "Pre-Draped Georgette Saree",
    image: "/sangeet_saree.webp",
    links: [
      { name: "Vibrant Georgette Saree", url: "https://www.flipkart.com/kayommi-self-design-bollywood-chiffon-saree/p/itmc101305c7063e" },
      { name: "Sequin Gota-Patti Blouse", url: "#" },
      { name: "Kundan Statement Earrings", url: "#" },
      { name: "Embellished Potli Bag", url: "#" },
    ]
  },
  {
    id: 2,
    title: "Lightweight Organza Lehenga",
    image: "/sangeet_lehenga.webp",
    links: [
      { name: "Mirror Work Crop Top", url: "https://www.perniaspopupshop.com/kalista-orange-raw-silk-printed-hand-embroidered-lehenga-set-klst022531.html" },
      { name: "Layered Organza Skirt", url: "#" },
      { name: "Polki Maang Tikka", url: "#" },
      { name: "Metallic Strappy Heels", url: "#" },
    ]
  },
  {
    id: 3,
    title: "Indo-Western Co-Ord Set",
    image: "/sangeet_coord.webp",
    links: [
      { name: "Embroidered Jewel-Tone Top", url: "#" },
      { name: "Flared Silk Palazzo Pants", url: "#" },
      { name: "Oxidized Silver Choker", url: "#" },
      { name: "Platform Wedge Sandals", url: "#" },
    ]
  },
  {
    id: 4,
    title: "Embroidered Anarkali Gown",
    image: "/sangeet_anarkali.webp",
    links: [
      { name: "Floor-Length Anarkali Gown", url: "#" },
      { name: "Threadwork Fluid Sleeves", url: "#" },
      { name: "Pearl Drop Earrings", url: "#" },
      { name: "Classic Golden Juttis", url: "#" },
    ]
  }
];

export default function FashionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);

  // Form State
  const [selectedImage, setSelectedImage] = useState(null);
  const [occasion, setOccasion] = useState(OCCASION_OPTIONS[0]);
  const [weather, setWeather] = useState(WEATHER_OPTIONS[0]);

  const [styleVibes, setStyleVibes] = useState([]);
  const [colorsLoved, setColorsLoved] = useState("");
  const [colorsAvoid, setColorsAvoid] = useState("");
  const [fit, setFit] = useState(FIT_OPTIONS[0]);

  const [outfitType, setOutfitType] = useState(OUTFIT_TYPES[0]);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[2]);
  const [extraContext, setExtraContext] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const addHistoryItem = useResultStore((state) => state.addHistoryItem);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_BASE_URL}/api/v1/analyze/check-limit?type=fashion`, {
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        });
        if (res.ok) {
          const limitData = await res.json();
          if (limitData.exceeded) {
            alert(limitData.detail);
            e.target.value = ""; // clear file input
            return;
          }
        }
      } catch (error) {
        console.error("Failed to check scan limit:", error);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleReset = () => {
    setSelectedImage(null);
    setCurrentStep(1);
    setResults(null);
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleVibeToggle = (id) => {
    setStyleVibes(prev => {
      if (prev.includes(id)) {
        return prev.filter(v => v !== id);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, id];
      }
    });
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setResults(null);

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/v1/analyze/fashion`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          image_base64: selectedImage,
          type: "fashion",
          context: {
            occasion,
            weather,
            styleVibes: styleVibes.map(vId => STYLE_VIBES.find(v => v.id === vId)?.name),
            colorsLoved,
            colorsAvoid,
            fit,
            outfitType,
            budget,
            extraContext
          }
        })
      });

      if (!res.ok) {
        let errMsg = "Failed to curate fashion concepts.";
        try {
          const errData = await res.json();
          if (errData.detail) errMsg = errData.detail;
        } catch (e) {}
        throw new Error(errMsg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      setResults([]);

      const finalOutfits = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || "";

        for (const chunk of lines) {
          if (chunk.includes("event: error")) {
            const dataMatch = chunk.match(/data: (.*)/);
            if (dataMatch) {
              let errMsg = "Analysis failed";
              try {
                const errData = JSON.parse(dataMatch[1]);
                if (errData.error) errMsg = errData.error;
              } catch (e) {
                // ignore parse error, use default
              }
              throw new Error(errMsg);
            }
          }
          if (chunk.startsWith("data: ")) {
            const dataStr = chunk.replace("data: ", "");
            if (dataStr === "{}") continue;
            try {
              const outfit = JSON.parse(dataStr);
              setResults(prev => [...prev, outfit]);
              finalOutfits.push(outfit);
              setIsLoading(false); // Hide full-screen loader once data streams in
            } catch (e) {
              console.error("Parse error:", e);
            }
          }
        }
      }

      if (finalOutfits.length === 0) {
        throw new Error("No valid style concepts could be generated. Please try a different image.");
      }

      setIsLoading(false); // Fallback to ensure loader hides when stream finishes

      // Save to global history store
      addHistoryItem({
        category: "fashion",
        title: `Style Guide: ${occasion}`,
        details: {
          weather,
          occasion,
          budget,
          outfits: finalOutfits
        }
      });
    } catch (error) {
      console.error("Fashion Error:", error);
      alert(error.message || "An unexpected error occurred. Please try again.");
      setResults(null);
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalLoader isVisible={isLoading} message="Curating Style Concepts" subMessage="Synthesizing preferences with perfect silhouettes..." />
      <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Header */}
          <div className="text-center md:text-left space-y-4 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-serif font-medium text-stone-900 leading-tight flex flex-col md:flex-row md:items-start items-center justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 mt-1 md:mt-2">
                <img loading="lazy" src="/icon-fashion-1.webp" alt="Fashion Icon" className="w-full h-full object-cover" />
              </div>
              <div>
                Design Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-rose via-brand-magenta to-brand-purple font-semibold">Signature Aesthetic</span>
              </div>
            </h1>
            <p className="text-stone-500 font-light text-sm md:text-base leading-relaxed">
              Upload your full body image and detail your preferences. Our AI will curate 4 culturally resonant, premium outfit concepts tailored just for you.
            </p>
          </div>

          {/* Beta Warning Banner */}
          <div className="p-4 md:p-5 rounded-3xl bg-amber-50/70 border border-amber-200/50 text-stone-700 text-sm flex items-start space-x-3.5 shadow-sm">
            <div className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-2xl bg-amber-100 text-amber-700 mt-0.5">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-semibold text-stone-850 text-sm">Experimental Beta Version</h4>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                The Style Guide is currently in experimental beta. Due to high query volumes, generation might occasionally experience delays or timeout. Thank you for your patience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left panel: Wizard or Summary */}
            <div className={cn("bg-white p-6 md:p-8 rounded-3xl border border-stone-200/50 shadow-sm space-y-6 flex flex-col min-h-[600px] relative transition-all duration-700", (results || isLoading) ? "lg:col-span-4" : "lg:col-span-5")}>

              {(!results && !isLoading) && (
                <>
                  {/* Header/Progress */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-serif font-medium text-stone-800">
                      {currentStep === 1 && "1. Visual Context"}
                      {currentStep === 2 && "2. Event & Environment"}
                      {currentStep === 3 && "3. Style Identity"}
                      {currentStep === 4 && "4. Practical Details"}
                    </h2>
                    <span className="text-xs font-semibold text-stone-400">Step {currentStep} of 4</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden">
                    <div className="bg-brand-rose h-full transition-all duration-500" style={{ width: `${(currentStep / 4) * 100}%` }} />
                  </div>

                  <div className="flex-1 relative flex flex-col h-full">

                    {/* Step 1: Photo */}
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-fade-in flex flex-col flex-1">
                        <p className="text-sm text-stone-500 flex-1">Upload a full body photo (standing, any outfit is fine). The AI reads your body type and proportions to curate the perfect silhouette.</p>

                        <div className="flex-none">
                          {selectedImage ? (
                            <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 group transition-all h-[350px]">
                              <img loading="lazy"
                                src={selectedImage}
                                alt="Uploaded"
                                className="w-full h-full object-cover object-top"
                              />
                              <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute bottom-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 backdrop-blur-sm"
                              >
                                <Trash2 size={12} />
                                <span>Remove</span>
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center hover:bg-stone-50 transition-colors cursor-pointer group"
                              >
                                <div className="w-16 h-16 rounded-full bg-brand-rose/5 text-brand-rose flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                  <UploadCloud size={28} />
                                </div>
                                <h4 className="text-sm font-semibold text-stone-800">Upload Your Photo</h4>
                                <p className="text-xs text-stone-500 font-light mt-1 max-w-[200px] mx-auto">
                                  A clear, well-lit full body shot works best.
                                </p>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                  accept="image/*"
                                  className="hidden"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={handleNextStep}
                          disabled={!selectedImage}
                          className={cn(
                            "w-full mt-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-md active:scale-[0.98]",
                            selectedImage ? "bg-stone-900 hover:bg-black text-white" : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                          )}
                        >
                          <span>Analyze Proportions</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    )}

                    {/* Step 2: Event & Environment */}
                    {currentStep === 2 && (
                      <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
                        <div className="space-y-6">
                          <p className="text-sm text-stone-500">What are you dressing for and what is the environment like?</p>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Occasion</label>
                              <select
                                value={occasion}
                                onChange={(e) => setOccasion(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 transition-all"
                              >
                                {OCCASION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Season & Weather</label>
                              <select
                                value={weather}
                                onChange={(e) => setWeather(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 transition-all"
                              >
                                {WEATHER_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-4 mt-8 border-t border-stone-100/50">
                          <button onClick={handlePrevStep} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">Back</button>
                          <button onClick={handleNextStep} className="col-span-2 py-3 rounded-xl font-medium text-sm text-white bg-stone-900 hover:bg-black transition-colors flex items-center justify-center space-x-2">
                            <span>Next Step</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Style Identity */}
                    {currentStep === 3 && (
                      <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
                        <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider flex justify-between">
                              <span>Style Vibe</span>
                              <span className="text-[10px] text-stone-400 lowercase font-normal">(Pick up to 3)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {STYLE_VIBES.map((v) => {
                                const isSelected = styleVibes.includes(v.id);
                                return (
                                  <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => handleVibeToggle(v.id)}
                                    className={cn(
                                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                      isSelected ? "bg-brand-rose/10 border-brand-rose/30 text-brand-rose shadow-sm" : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                                    )}
                                  >
                                    {v.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Fit Preference</label>
                            <select
                              value={fit}
                              onChange={(e) => setFit(e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 transition-all"
                            >
                              {FIT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Colors You Love</label>
                            <input
                              type="text"
                              placeholder="e.g. Neutrals, Earth tones, Emerald Green..."
                              value={colorsLoved}
                              onChange={(e) => setColorsLoved(e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 transition-all placeholder:text-stone-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider flex justify-between">
                              <span>Colors / Styles to Avoid</span>
                              <span className="text-[10px] text-stone-400 lowercase font-normal">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. No crop tops, I don't like yellow..."
                              value={colorsAvoid}
                              onChange={(e) => setColorsAvoid(e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 transition-all placeholder:text-stone-400"
                            />
                          </div>

                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-stone-100/50">
                          <button onClick={handlePrevStep} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">Back</button>
                          <button onClick={handleNextStep} className="col-span-2 py-3 rounded-xl font-medium text-sm text-white bg-stone-900 hover:bg-black transition-colors flex items-center justify-center space-x-2">
                            <span>Next Step</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Practical Details */}
                    {currentStep === 4 && (
                      <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
                        <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Outfit Type</label>
                            <select
                              value={outfitType}
                              onChange={(e) => setOutfitType(e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 transition-all"
                            >
                              {OUTFIT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Target Budget</label>
                            <select
                              value={budget}
                              onChange={(e) => setBudget(e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 transition-all"
                            >
                              {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider flex justify-between">
                              <span>Extra Context</span>
                              <span className="text-[10px] text-stone-400 lowercase font-normal">(Optional)</span>
                            </label>
                            <textarea
                              placeholder="e.g. I'm plus size and prefer A-line silhouettes, or I have a saree blouse, suggest what to pair it with..."
                              value={extraContext}
                              onChange={(e) => setExtraContext(e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 transition-all placeholder:text-stone-400 min-h-[100px] resize-none"
                            />
                          </div>

                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-stone-100/50">
                          <button onClick={handlePrevStep} disabled={isLoading} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50">Back</button>
                          <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="col-span-2 py-3 bg-gradient-to-r from-brand-rose to-brand-magenta hover:opacity-95 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="animate-spin" size={16} />
                                <span>Curating...</span>
                              </>
                            ) : (
                              <>
                                <span>Generate Concepts</span>
                                <ArrowRight size={16} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {(results || isLoading) && (
                <div className="space-y-6 animate-fade-in flex flex-col h-full">
                  <h2 className="text-lg font-serif font-medium text-stone-800">Your Style Profile</h2>
                  <div className="flex-1 space-y-6">
                    {selectedImage && (
                      <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 group transition-all h-[250px] shadow-sm">
                        <img loading="lazy" src={selectedImage} alt="Uploaded" className="w-full h-full object-cover object-top" />
                      </div>
                    )}
                    <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-100">
                      <div className="flex justify-between items-center border-b border-stone-200/50 pb-3">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Occasion</span>
                        <span className="text-sm font-medium text-stone-700">{occasion}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-stone-200/50 pb-3">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Weather</span>
                        <span className="text-sm font-medium text-stone-700">{weather}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-stone-200/50 pb-3">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Budget</span>
                        <span className="text-sm font-medium text-stone-700">{budget}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Vibe</span>
                        <span className="text-sm font-medium text-stone-700 line-clamp-1 text-right max-w-[150px]">
                          {styleVibes.map(vId => STYLE_VIBES.find(v => v.id === vId)?.name).join(", ") || "Casual"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right panel: Results Grid */}
            <div className={cn("transition-all duration-700", (results || isLoading) ? "lg:col-span-8 w-full" : "lg:col-span-7")}>

              {/* Empty / Initial State */}
              {!isLoading && !results && (
                <div className="bg-white border border-stone-200/50 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 mx-auto mb-6">
                    <img loading="lazy" src="/icon_fashion_unisex.webp" alt="Fashion Icon" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-stone-800">Awaiting Your Input</h3>
                  <p className="text-sm text-stone-500 font-light mt-2 max-w-md leading-relaxed">
                    Complete the style wizard on the left. The engine will synthesize 4 distinct looks incorporating your preferences.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (!results || results.length === 0) && (
                <div className="bg-white border border-brand-rose/20 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-rose/5 via-transparent to-brand-purple/5 pointer-events-none" />
                  <div className="w-20 h-20 rounded-full bg-brand-rose/10 text-brand-rose flex items-center justify-center mx-auto mb-6 relative">
                    <Loader2 className="animate-spin absolute inset-0 m-auto" size={32} />
                    <Sparkles className="animate-pulse" size={20} />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-stone-800">Designing Your Aesthetic</h3>
                  <p className="text-sm text-brand-rose font-medium mt-2 animate-pulse">Blending preferences with perfect silhouettes...</p>
                </div>
              )}

              {/* Generated Results Grid */}
              {results && results.length > 0 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-brand-rose uppercase tracking-widest bg-brand-rose/10 px-2.5 py-1 rounded-full border border-brand-rose/20">
                        Vision Board Generated
                      </span>
                      <h2 className="text-2xl font-serif font-medium text-stone-900 mt-3">Your Style Concepts</h2>
                    </div>
                    <button onClick={handleReset} className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors">
                      Reset & Start Over
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.map((outfit, index) => (
                      <div key={outfit.id || index} className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col p-6">
                        <h3 className="text-2xl font-serif font-medium text-stone-900 mb-5">{outfit.title}</h3>

                        <div className="grid grid-cols-2 gap-4 mt-auto">
                          {outfit.pieces?.map((piece, idx) => {
                            const product = piece.products?.[0];
                            if (!product) return null;
                            return (
                              <div key={idx} className="flex flex-col space-y-2 group/product">
                                <div className="relative aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
                                  <img
                                    loading="lazy"
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/product:scale-105"
                                  />
                                </div>
                                <a href={product.link} target="_blank" rel="noopener noreferrer" className="flex flex-col space-y-1">
                                  <span className="text-sm font-medium text-stone-800 hover:text-brand-rose transition-colors line-clamp-2 leading-tight">
                                    {product.name}
                                  </span>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-full">{product.source}</span>
                                    <span className="text-xs font-semibold text-brand-rose">{product.price}</span>
                                  </div>
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
