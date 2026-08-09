"use client";

import { useState, useRef } from "react";
import { useResultStore } from "@/store/useResultStore";
import { ArrowRight, Loader2, ClipboardList, UploadCloud, X, ImageIcon, Info, Scissors, Sparkles, ExternalLink, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalLoader from "@/components/shared/GlobalLoader";

// --- Form Options ---
const GENDER_OPTIONS = ["Male", "Female", "Non-binary"];
const LENGTH_OPTIONS = ["Buzz cut", "Short", "Medium", "Long"];
const TEXTURE_OPTIONS = ["Straight", "Wavy", "Curly", "Coily", "Not sure"];
const TREATMENT_OPTIONS = ["Chemically treated", "Heat styled regularly", "Neither", "Both"];
const WASH_OPTIONS = ["Daily", "Every 2-3 days", "Once a week", "Less than weekly"];
const WATER_OPTIONS = ["Hard water", "Soft water", "Not sure"];
const BUDGET_OPTIONS = ["Under ₹500", "₹500-2000", "₹2000+", "No limit"];

const CONCERNS = [
  "Hair fall", "Dandruff", "Frizz", "Dryness & breakage",
  "Oily scalp", "Lack of volume", "Slow growth",
  "Split ends", "Dullness", "Thinning"
];

const OCCASION_OPTIONS = ["Casual Everyday", "Professional / Work", "Wedding / Formal", "Date Night", "Festival / Party"];

export default function HairPage() {
  const [mode, setMode] = useState("care"); // "care" | "styling"

  // =====================
  // HAIR CARE STATE (Mode: care)
  // =====================
  const [currentCareStep, setCurrentCareStep] = useState(1);
  const careFileInputRef = useRef(null);

  const [careImages, setCareImages] = useState([]);
  const [gender, setGender] = useState("Female");
  const [hairLength, setHairLength] = useState("Medium");
  const [texture, setTexture] = useState("Wavy");
  const [treatment, setTreatment] = useState("Neither");
  const [concerns, setConcerns] = useState(["Frizz"]);
  const [washFrequency, setWashFrequency] = useState("Every 2-3 days");
  const [waterType, setWaterType] = useState("Hard water");
  const [gym, setGym] = useState(false);
  const [outdoors, setOutdoors] = useState(false);
  const [desiredStyles, setDesiredStyles] = useState("");
  const [budget, setBudget] = useState("₹500-2000");
  const [extraNotes, setExtraNotes] = useState("");

  const [careResults, setCareResults] = useState(null);

  // =====================
  // HAIR STYLING STATE (Mode: styling)
  // =====================
  const [currentStylingStep, setCurrentStylingStep] = useState(1);
  const stylingFileInputRef = useRef(null);

  const [stylingImages, setStylingImages] = useState([]); // Up to 2: Selfie, Outfit
  const [stylingOccasion, setStylingOccasion] = useState("Wedding / Formal");
  const [outfitVibe, setOutfitVibe] = useState("");
  const [stylingLength, setStylingLength] = useState("Medium");
  const [stylingTexture, setStylingTexture] = useState("Wavy");

  const [stylingResults, setStylingResults] = useState(null);

  // Global State
  const [isLoading, setIsLoading] = useState(false);
  const addHistoryItem = useResultStore((state) => state.addHistoryItem);

  // =====================
  // HANDLERS
  // =====================
  const handleCareImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const remainingSlots = 3 - careImages.length;
    const filesToAdd = files.slice(0, remainingSlots);
    const newImageUrls = filesToAdd.map(file => URL.createObjectURL(file));
    setCareImages([...careImages, ...newImageUrls]);
  };

  const removeCareImage = (index) => setCareImages(careImages.filter((_, i) => i !== index));

  const loadCareSampleImages = () => {
    setCareImages([
      "/sample-selfie.webp",
      "/sample-full-body.webp",
      "/sample-selfie.webp"
    ]);
  };

  const handleConcernToggle = (c) => {
    if (concerns.includes(c)) setConcerns(concerns.filter(item => item !== c));
    else setConcerns([...concerns, c]);
  };

  const handleStylingImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const remainingSlots = 2 - stylingImages.length;
    const filesToAdd = files.slice(0, remainingSlots);
    const newImageUrls = filesToAdd.map(file => URL.createObjectURL(file));
    setStylingImages([...stylingImages, ...newImageUrls]);
  };

  const removeStylingImage = (index) => setStylingImages(stylingImages.filter((_, i) => i !== index));

  const loadStylingSampleImages = () => {
    setStylingImages([
      "/hair-selfie-mock.png",
      "/hair-outfit-mock.png"
    ]);
  };

  // =====================
  // GENERATORS
  // =====================
  const handleGenerateCare = async () => {
    setIsLoading(true);
    setCareResults(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let schedule = {
      title: `${texture} Hair Care Protocol`,
      tips: [
        "Use lukewarm water when washing and cold water to rinse.",
        waterType === "Hard water" ? "Incorporate a chelating shampoo twice a month to remove hard water mineral buildup." : "Use a gentle hydrating cleanser to maintain moisture.",
        treatment.includes("Chemical") || treatment === "Both" ? "Prioritize bond-building treatments weekly." : "Maintain natural elasticity with lightweight oils.",
        budget === "Under ₹500" ? "Look for affordable drugstore heroes with active ingredients like Salicylic Acid or Argan Oil." : "Invest in high-quality professional salon treatments."
      ],
      products: [
        { name: "Olaplex No. 3", desc: "Bond builder for damage", link: "https://example.com" },
        { name: "Kerastase Elixir", desc: "Lightweight shine oil", link: "https://example.com" },
        { name: "Ouai Detox", desc: "Clarifying wash", link: "https://example.com" }
      ],
      days: [
        { day: "Monday", type: "Wash & Style", activity: "Deep Cleanse", details: "Use clarifying shampoo to reset scalp. Follow with hydrating mask." },
        { day: "Tuesday", type: "Rest / Refresh", activity: "Scalp Massage", details: "Massage scalp for 3 minutes to stimulate blood flow. No product." },
        { day: "Wednesday", type: gym ? "Co-Wash" : "Rest", activity: gym ? "Post-Workout Rinse" : "Hydration Refresh", details: gym ? "Use a cleansing conditioner to remove sweat without stripping." : "Mist ends with aloe water." },
        { day: "Thursday", type: "Treatment", activity: concerns.includes("Hair fall") ? "Densifying Serum" : "Mid-week Oil", details: "Apply targeted treatment to roots or ends depending on primary concern." },
        { day: "Friday", type: "Wash & Style", activity: "Standard Wash", details: "Shampoo twice, condition mid-lengths to ends." },
        { day: "Saturday", type: "Rest", activity: "Protective Style", details: "Wear in loose braids or a silk scrunchie." },
        { day: "Sunday", type: "Scalp Care", activity: "Pre-wash Oil", details: "Apply rosemary oil to roots. Wash off after 1-2 hours." }
      ]
    };

    setCareResults(schedule);
    setIsLoading(false);

    addHistoryItem({
      category: "hair",
      title: schedule.title,
      details: {
        mode: "care",
        gender, hairLength, texture, treatment, concerns,
        washFrequency, waterType, gym, outdoors, desiredStyles, budget, extraNotes,
        ...schedule
      }
    });
  };

  const handleGenerateStyling = async () => {
    setIsLoading(true);
    setStylingResults(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let styles = {
      title: `${stylingOccasion} Lookbook`,
      desc: `Curated for ${stylingLength.toLowerCase()}, ${stylingTexture.toLowerCase()} hair to complement your outfit vibe.`,
      hairstyles: [
        { name: "Textured Crop", desc: "Low maintenance, works beautifully with natural waves.", img: "/hair-res-crop.png" },
        { name: "Slicked Back Elegance", desc: "Clean and formal look to elevate the occasion.", img: "/hair-res-slick.png" },
        { name: "Voluminous Blowout", desc: "Embraces length and volume for a classic statement.", img: "/hair-res-blowout.png" }
      ]
    };

    setStylingResults(styles);
    setIsLoading(false);

    addHistoryItem({
      category: "hair",
      title: styles.title,
      details: {
        mode: "styling",
        stylingOccasion, outfitVibe, stylingLength, stylingTexture,
        ...styles
      }
    });
  };

  const handleModeSwitch = (newMode) => {
    if (newMode !== mode) {
      setMode(newMode);
    }
  };

  // =====================
  // RENDER HELPERS
  // =====================
  const renderCareWizard = () => (
    <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-stone-200/50 shadow-sm space-y-6 flex flex-col min-h-[600px] relative">
      
      {/* Header/Progress */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-serif font-medium text-stone-800">
          {currentCareStep === 1 && "1. Photo Upload"}
          {currentCareStep === 2 && "2. Hair Profile"}
          {currentCareStep === 3 && "3. Primary Concerns"}
          {currentCareStep === 4 && "4. Environment & Budget"}
        </h2>
        <span className="text-xs font-semibold text-stone-400">Step {currentCareStep} of 4</span>
      </div>

      <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden">
        <div className="bg-brand-purple h-full transition-all duration-500" style={{ width: `${(currentCareStep / 4) * 100}%` }} />
      </div>

      <div className="flex-1 relative flex flex-col h-full">
        {/* Step 1: Photos */}
        {currentCareStep === 1 && (
          <div className="space-y-6 animate-fade-in flex flex-col flex-1 justify-between">
            <div className="space-y-4">
              <p className="text-sm text-stone-500">Provide well-lit photos showing your hair texture and scalp clearly. You can upload up to 3 photos.</p>
              
              <div className="grid grid-cols-3 gap-3">
                {careImages.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group">
                    <img loading="lazy" src={src} alt="Hair" className="w-full h-full object-cover" />
                    <button onClick={() => removeCareImage(i)} className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black text-white p-1.5 rounded-full transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {careImages.length < 3 && (
                  <div 
                    onClick={() => careFileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <UploadCloud size={20} className="text-stone-400 mb-1" />
                    <span className="text-[10px] font-semibold text-stone-500">Add Photo</span>
                    <input type="file" ref={careFileInputRef} multiple accept="image/*" onChange={handleCareImageUpload} className="hidden" />
                  </div>
                )}
              </div>

              {careImages.length === 0 && (
                <button 
                  onClick={loadCareSampleImages}
                  className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 mt-4"
                >
                  <ImageIcon size={14} className="text-stone-500" />
                  <span>Use Sample Images</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setCurrentCareStep(2)}
              disabled={careImages.length === 0}
              className={cn(
                "w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-md active:scale-[0.98]",
                careImages.length > 0 ? "bg-brand-purple hover:bg-purple-700 text-white" : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              )}
            >
              <span>Next Step</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Profile */}
        {currentCareStep === 2 && (
          <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Gender Identity</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30">
                  {GENDER_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Hair Length</label>
                <select value={hairLength} onChange={(e) => setHairLength(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30">
                  {LENGTH_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Natural Texture</label>
                <select value={texture} onChange={(e) => setTexture(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30">
                  {TEXTURE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Wash Frequency</label>
                <select value={washFrequency} onChange={(e) => setWashFrequency(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30">
                  {WASH_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Treatment History</label>
                <select value={treatment} onChange={(e) => setTreatment(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30">
                  {TREATMENT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-stone-100/50">
              <button onClick={() => setCurrentCareStep(1)} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">Back</button>
              <button onClick={() => setCurrentCareStep(3)} className="col-span-2 py-3 rounded-xl font-medium text-sm text-white bg-brand-purple hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <span>Next Step</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Concerns */}
        {currentCareStep === 3 && (
          <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
            <div className="space-y-4">
              <p className="text-sm text-stone-500">What are your main goals and issues? Select all that apply.</p>
              <div className="flex flex-wrap gap-2">
                {CONCERNS.map((c) => {
                  const isSelected = concerns.includes(c);
                  return (
                    <button
                      key={c} type="button" onClick={() => handleConcernToggle(c)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-sm font-medium transition-all border",
                        isSelected ? "bg-brand-purple/10 border-brand-purple/30 text-brand-purple" : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-stone-100/50">
              <button onClick={() => setCurrentCareStep(2)} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">Back</button>
              <button onClick={() => setCurrentCareStep(4)} className="col-span-2 py-3 rounded-xl font-medium text-sm text-white bg-brand-purple hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <span>Next Step</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Environment & Generate */}
        {currentCareStep === 4 && (
          <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Water Type</label>
                  <select value={waterType} onChange={(e) => setWaterType(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30">
                    {WATER_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Budget</label>
                  <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30">
                    {BUDGET_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4 py-2 border-b border-stone-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={gym} onChange={(e) => setGym(e.target.checked)} className="rounded text-brand-purple focus:ring-brand-purple/30 w-4 h-4" />
                  <span className="text-sm font-medium text-stone-700">Gym frequently?</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={outdoors} onChange={(e) => setOutdoors(e.target.checked)} className="rounded text-brand-purple focus:ring-brand-purple/30 w-4 h-4" />
                  <span className="text-sm font-medium text-stone-700">Outdoors often?</span>
                </label>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Extra Context (Optional)</label>
                <textarea 
                  value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} 
                  placeholder="Any specific requests or constraints?"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none h-20"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-stone-100/50">
              <button onClick={() => setCurrentCareStep(3)} disabled={isLoading} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50">Back</button>
              <button 
                onClick={handleGenerateCare} 
                disabled={isLoading}
                className="col-span-2 py-3 bg-gradient-to-r from-brand-purple to-purple-600 hover:opacity-95 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Protocol</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  const renderStylingWizard = () => (
    <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-stone-200/50 shadow-sm space-y-6 flex flex-col min-h-[600px] relative">
      
      {/* Header/Progress */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-serif font-medium text-stone-800">
          {currentStylingStep === 1 && "1. Visual Context"}
          {currentStylingStep === 2 && "2. Event Details"}
          {currentStylingStep === 3 && "3. Base Hair"}
        </h2>
        <span className="text-xs font-semibold text-stone-400">Step {currentStylingStep} of 3</span>
      </div>

      <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden">
        <div className="bg-brand-rose h-full transition-all duration-500" style={{ width: `${(currentStylingStep / 3) * 100}%` }} />
      </div>

      <div className="flex-1 relative flex flex-col h-full">
        {/* Step 1: Visual Context */}
        {currentStylingStep === 1 && (
          <div className="space-y-6 animate-fade-in flex flex-col flex-1 justify-between">
            <div className="space-y-4">
              <p className="text-sm text-stone-500">Upload a selfie (for face shape) and an outfit photo to get perfectly matched style suggestions.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Image 1: Selfie */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-brand-rose uppercase tracking-widest text-center block">Face / Selfie</span>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 group">
                    {stylingImages[0] ? (
                      <>
                        <img loading="lazy" src={stylingImages[0]} alt="Selfie" className="w-full h-full object-cover" />
                        <button onClick={() => removeStylingImage(0)} className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full transition-colors"><X size={12} /></button>
                      </>
                    ) : (
                      <div onClick={() => stylingFileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100 transition-colors">
                        <UploadCloud size={24} className="text-stone-400 mb-2" />
                        <span className="text-xs font-medium text-stone-500">Upload</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image 2: Outfit */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-brand-rose uppercase tracking-widest text-center block">Outfit / Vibe</span>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 group">
                    {stylingImages[1] ? (
                      <>
                        <img loading="lazy" src={stylingImages[1]} alt="Outfit" className="w-full h-full object-cover" />
                        <button onClick={() => removeStylingImage(1)} className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full transition-colors"><X size={12} /></button>
                      </>
                    ) : (
                      <div onClick={() => stylingFileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100 transition-colors">
                        <UploadCloud size={24} className="text-stone-400 mb-2" />
                        <span className="text-xs font-medium text-stone-500">Upload</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <input type="file" ref={stylingFileInputRef} multiple accept="image/*" onChange={handleStylingImageUpload} className="hidden" />

              {stylingImages.length === 0 && (
                <button onClick={loadStylingSampleImages} className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 mt-4">
                  <ImageIcon size={14} className="text-stone-500" />
                  <span>Try with Sample Context</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setCurrentStylingStep(2)}
              disabled={stylingImages.length === 0}
              className={cn(
                "w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-md active:scale-[0.98]",
                stylingImages.length > 0 ? "bg-brand-rose hover:bg-rose-600 text-white" : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              )}
            >
              <span>Next Step</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Event Details */}
        {currentStylingStep === 2 && (
          <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Occasion</label>
                <select value={stylingOccasion} onChange={(e) => setStylingOccasion(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30">
                  {OCCASION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Outfit Vibes</label>
                <textarea 
                  value={outfitVibe} onChange={(e) => setOutfitVibe(e.target.value)} 
                  placeholder="e.g. Minimalist silk saree, or edgy leather jacket..."
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30 resize-none h-24"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-stone-100/50">
              <button onClick={() => setCurrentStylingStep(1)} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">Back</button>
              <button onClick={() => setCurrentStylingStep(3)} className="col-span-2 py-3 rounded-xl font-medium text-sm text-white bg-brand-rose hover:bg-rose-600 transition-colors flex items-center justify-center space-x-2">
                <span>Next Step</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Base Hair & Generate */}
        {currentStylingStep === 3 && (
          <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Current Hair Length</label>
                <select value={stylingLength} onChange={(e) => setStylingLength(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30">
                  {LENGTH_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Natural Texture</label>
                <select value={stylingTexture} onChange={(e) => setStylingTexture(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30">
                  {TEXTURE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-stone-100/50">
              <button onClick={() => setCurrentStylingStep(2)} disabled={isLoading} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50">Back</button>
              <button 
                onClick={handleGenerateStyling} 
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
                    <span>Generate Lookbook</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return (
    <>
      <GlobalLoader isVisible={isLoading} message={mode === 'care' ? "Analyzing Scalp & Strands" : "Synthesizing Lookbook"} subMessage={mode === 'care' ? "Building your 7-day protocol..." : "Matching hair with outfit vibes..."} />
      <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header & Mode Switch */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-4 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-serif font-medium text-stone-900 leading-tight flex flex-col md:flex-row md:items-start items-center justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 mt-1 md:mt-2">
                <img loading="lazy" src="/icon-hair-1.webp" alt="Hair Icon" className="w-full h-full object-cover" />
              </div>
              <div>
                Advanced Hair <br className="hidden md:block" />
                <span className={cn(
                  "text-transparent bg-clip-text font-semibold",
                  mode === "care" ? "bg-gradient-to-r from-brand-purple to-purple-500" : "bg-gradient-to-r from-brand-rose to-brand-magenta"
                )}>
                  {mode === "care" ? "Diagnostics" : "Styling Suite"}
                </span>
              </div>
            </h1>
            <p className="text-stone-500 font-light text-sm md:text-base leading-relaxed">
              {mode === "care" 
                ? "Diagnose scalp health and receive a bespoke weekly care protocol and product regimen."
                : "Upload your outfit and event details to generate occasion-specific, photorealistic hairstyle recommendations."
              }
            </p>
          </div>

          {/* Top-Level Mode Toggle */}
          <div className="bg-white p-1.5 rounded-full border border-stone-200/50 shadow-sm flex items-center shrink-0">
            <button
              onClick={() => handleModeSwitch("care")}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center space-x-2",
                mode === "care" ? "bg-brand-purple text-white shadow-sm" : "text-stone-500 hover:bg-stone-50"
              )}
            >
              <ClipboardList size={16} />
              <span>Hair Care</span>
            </button>
            <button
              onClick={() => handleModeSwitch("styling")}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center space-x-2",
                mode === "styling" ? "bg-brand-rose text-white shadow-sm" : "text-stone-500 hover:bg-stone-50"
              )}
            >
              <Scissors size={16} />
              <span>Occasion Styling</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Active Wizard Panel */}
          {(!careResults && mode === "care") && renderCareWizard()}
          {(!stylingResults && mode === "styling") && renderStylingWizard()}

          {/* Right Panel: Care Results */}
          <div className={cn("transition-all duration-700", careResults && mode === "care" ? "lg:col-span-12 w-full max-w-6xl mx-auto" : "lg:col-span-7", mode !== "care" && "hidden")}>
            {!isLoading && !careResults && (
              <div className="bg-white border border-stone-200/50 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 mx-auto mb-6 opacity-80">
                  <img loading="lazy" src="/icon_hair_unisex.webp" alt="Hair Care" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-serif font-medium text-stone-800">Awaiting Profile</h3>
                <p className="text-sm text-stone-500 font-light mt-2 max-w-md leading-relaxed">
                  Complete the care wizard on the left to generate your bespoke 7-day protocol.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="bg-white border border-brand-purple/20 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center shadow-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-transparent pointer-events-none" />
                <div className="w-20 h-20 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-6 relative">
                  <Loader2 className="animate-spin absolute inset-0 m-auto" size={32} />
                  <Sparkles className="animate-pulse" size={20} />
                </div>
                <h3 className="text-xl font-serif font-medium text-stone-800">Analyzing Scalp & Strands</h3>
                <p className="text-sm text-brand-purple font-medium mt-2 animate-pulse">Building your 7-day protocol...</p>
              </div>
            )}

            {careResults && !isLoading && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest bg-brand-purple/10 px-2.5 py-1 rounded-full border border-brand-purple/20">
                      Bespoke Protocol Ready
                    </span>
                    <h2 className="text-2xl font-serif font-medium text-stone-900 mt-3">{careResults.title}</h2>
                  </div>
                  <button onClick={() => setCareResults(null)} className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors">
                    Reset Protocol
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {careResults.days.map((d, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm flex flex-col">
                      <div className="flex justify-between items-start border-b border-stone-100 pb-3 mb-3">
                        <span className="font-bold text-stone-800">{d.day}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{d.type}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-brand-purple mb-1.5">{d.activity}</h4>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">{d.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Styling Results */}
          <div className={cn("transition-all duration-700", stylingResults && mode === "styling" ? "lg:col-span-12 w-full max-w-6xl mx-auto" : "lg:col-span-7", mode !== "styling" && "hidden")}>
            {!isLoading && !stylingResults && (
              <div className="bg-white border border-stone-200/50 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 mx-auto mb-6 opacity-80">
                  <img loading="lazy" src="/icon_hair_unisex.webp" alt="Hair Styling" className="w-full h-full object-cover grayscale" />
                </div>
                <h3 className="text-xl font-serif font-medium text-stone-800">Awaiting Context</h3>
                <p className="text-sm text-stone-500 font-light mt-2 max-w-md leading-relaxed">
                  Complete the styling wizard to generate your tailored occasion lookbook.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="bg-white border border-brand-rose/20 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center shadow-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-rose/5 via-transparent to-transparent pointer-events-none" />
                <div className="w-20 h-20 rounded-full bg-brand-rose/10 text-brand-rose flex items-center justify-center mx-auto mb-6 relative">
                  <Loader2 className="animate-spin absolute inset-0 m-auto" size={32} />
                  <Sparkles className="animate-pulse" size={20} />
                </div>
                <h3 className="text-xl font-serif font-medium text-stone-800">Synthesizing Styles</h3>
                <p className="text-sm text-brand-rose font-medium mt-2 animate-pulse">Matching hair with outfit vibes...</p>
              </div>
            )}

            {stylingResults && !isLoading && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-rose uppercase tracking-widest bg-brand-rose/10 px-2.5 py-1 rounded-full border border-brand-rose/20">
                      Lookbook Generated
                    </span>
                    <h2 className="text-2xl font-serif font-medium text-stone-900 mt-3">{stylingResults.title}</h2>
                    <p className="text-sm text-stone-500 font-light mt-1">{stylingResults.desc}</p>
                  </div>
                  <button onClick={() => setStylingResults(null)} className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors">
                    Reset Lookbook
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stylingResults.hairstyles.map((style, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
                      <div className="relative aspect-square bg-stone-100 overflow-hidden">
                        <img loading="lazy" src={style.img} alt={style.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-stone-900 text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-sm flex items-center space-x-1 hover:bg-white">
                          <span>View Tutorial</span>
                          <ExternalLink size={10} />
                        </button>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-serif font-semibold text-stone-800 mb-1.5">{style.name}</h3>
                        <p className="text-xs text-stone-500 font-light leading-relaxed">{style.desc}</p>
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
