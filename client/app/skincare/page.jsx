"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useResultStore } from "@/store/useResultStore";
import { ShieldCheck, Upload, AlertCircle, RefreshCw, Sun, Moon, ArrowRight, Loader2, ChevronDown, Trash2, Sparkles, ClipboardList, Camera } from "lucide-react";
import GlobalLoader from "@/components/shared/GlobalLoader";
import ProductCarousel from "@/components/shared/ProductCarousel";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const AGE_RANGES = [
  { id: "under18", name: "Under 18" },
  { id: "18-25", name: "18-25" },
  { id: "26-35", name: "26-35" },
  { id: "36-50", name: "36-50" },
  { id: "50plus", name: "50+" },
];

const GENDERS = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
  { id: "non-binary", name: "Non-binary" },
  { id: "prefer-not", name: "Prefer not to say" },
];

const CLIMATES = [
  { id: "hot-humid", name: "Hot & humid" },
  { id: "hot-dry", name: "Hot & dry" },
  { id: "cold", name: "Cold" },
  { id: "moderate", name: "Moderate" },
];

const WATER_INTAKE = [
  { id: "less-1l", name: "Less than 1L" },
  { id: "1-2l", name: "1-2L" },
  { id: "2l-plus", name: "2L+" },
];

const SKIN_CONCERNS_LIST = [
  { id: "acne", name: "Acne" },
  { id: "pigmentation", name: "Pigmentation" },
  { id: "dark-circles", name: "Dark circles" },
  { id: "oily-skin", name: "Oily skin" },
  { id: "dry-patches", name: "Dry patches" },
  { id: "dullness", name: "Dullness" },
  { id: "large-pores", name: "Large pores" },
  { id: "anti-aging", name: "Anti-aging" },
  { id: "uneven-tone", name: "Uneven skin tone" },
  { id: "sensitivity", name: "Sensitivity" },
];

const ROUTINE_OPTIONS = [
  { id: "yes", name: "Yes" },
  { id: "no", name: "No" },
  { id: "sometimes", name: "Sometimes" },
];

const BUDGET_OPTIONS = [
  { id: "under500", name: "Under ₹500" },
  { id: "500-2000", name: "₹500-2000" },
  { id: "2000-5000", name: "₹2000-5000" },
  { id: "no-limit", name: "No limit" },
];

export default function SkincarePage() {
  const [selectedImage, setSelectedImage] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [ageRange, setAgeRange] = useState("18-25");
  const [gender, setGender] = useState("female");
  const [climate, setClimate] = useState("moderate");
  const [waterIntake, setWaterIntake] = useState("1-2l");
  const [concerns, setConcerns] = useState([]);
  const [hasRoutine, setHasRoutine] = useState("no");
  const [usedProducts, setUsedProducts] = useState("");
  const [skinTriggers, setSkinTriggers] = useState("");
  const [budget, setBudget] = useState("500-2000");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleConcernToggle = (id) => {
    if (concerns.includes(id)) {
      setConcerns(concerns.filter(c => c !== id));
    } else {
      setConcerns([...concerns, id]);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 1500));
      setIsTransitioning(false);
      setCurrentStep(2);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("Initializing camera calibration...");

  const [results, setResults] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const addHistoryItem = useResultStore((state) => state.addHistoryItem);

  // Trigger analysis simulation
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanProgress(0);
    setResults(null);

    const messages = [
      { progress: 10, text: "Calibrating lighting and shadows..." },
      { progress: 30, text: "Mapping facial coordinates & pore density..." },
      { progress: 55, text: "Analyzing hydration index & barrier strength..." },
      { progress: 75, text: "Detecting skin irritation and texture irregularities..." },
      { progress: 90, text: "Compiling diagnostic metrics..." },
      { progress: 100, text: "Analysis complete." },
    ];

    // Start a background loop to update progress messages
    let progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 5, 95));
    }, 500);

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/v1/analyze/skincare`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          image_base64: selectedImage,
          type: "skincare",
          context: {
            ageRange,
            gender,
            climate,
            waterIntake,
            concerns,
            hasRoutine,
            usedProducts,
            skinTriggers,
            budget,
            additionalInfo
          }
        })
      });

      if (!res.ok) {
        let errMsg = "Failed to analyze skin profile.";
        try {
          const errData = await res.json();
          if (errData.detail) errMsg = errData.detail;
        } catch (e) {}
        throw new Error(errMsg);
      }

      const realResults = await res.json();
      
      clearInterval(progressInterval);
      setScanProgress(100);
      setScanMessage("Analysis complete.");
      
      setResults(realResults);

      // Save to global history store
      addHistoryItem({
        category: "skincare",
        title: `Skin Analysis (${gender === 'female' ? 'F' : gender === 'male' ? 'M' : 'NB'}, ${ageRange})`,
        details: {
          ageRange,
          gender,
          climate,
          waterIntake,
          concerns,
          hasRoutine,
          usedProducts,
          skinTriggers,
          budget,
          additionalInfo,
          ...realResults
        }
      });
    } catch (error) {
      console.error("Analysis Error:", error);
      clearInterval(progressInterval);
      alert(error.message || "Error analyzing image. Please try again.");
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 1000);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_BASE_URL}/api/v1/analyze/check-limit?type=skincare`, {
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
        setCurrentStep(1); // Reset to step 1 on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setCurrentStep(1);
    setResults(null);
  };

  // Compute unified product steps to prevent duplicate product requests for same step
  const unifiedProductSteps = [];
  if (results?.routine) {
    const allSteps = [...(results.routine.morning || []), ...(results.routine.evening || [])];
    const uniqueMap = {};
    allSteps.forEach(stepItem => {
      const stepName = stepItem.step.toLowerCase();
      if (!uniqueMap[stepName]) {
        uniqueMap[stepName] = { ...stepItem, products: [...(stepItem.products || [])] };
      } else {
        uniqueMap[stepName].products.push(...(stepItem.products || []));
      }
    });
    unifiedProductSteps.push(...Object.values(uniqueMap));
  }

  return (
    <>
      <GlobalLoader isVisible={isScanning} message="Analyzing Skin Profile" subMessage={scanMessage} />
      <div className="min-h-screen bg-[#FAF6F0] relative overflow-hidden pt-28 pb-16 px-4 md:px-6 text-stone-900">

        {/* Background Watermarks */}
        <div
          className="fixed left-0 top-0 bottom-0 w-full md:w-1/2 bg-[url('/bg_features_unisex.webp')] bg-[length:700px] bg-no-repeat bg-[position:-120px_120px] opacity-[0.25] pointer-events-none mix-blend-multiply\"
          style={{ maskImage: 'radial-gradient(ellipse at 10% 20%, black 10%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 10% 20%, black 10%, transparent 70%)' }}
        />
        <div
          className="fixed right-0 top-0 bottom-0 w-full md:w-1/2 bg-[url('/bg_features_unisex.webp')] bg-[length:700px] bg-no-repeat bg-right-top opacity-[0.25] pointer-events-none mix-blend-multiply\"
          style={{ maskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 70%)' }}
        />

        <div className={cn("relative z-10 w-full mx-auto space-y-8 transition-all duration-700", results ? "max-w-[1920px]" : "max-w-6xl")}>

          {/* Header */}
          <div className="text-center md:text-left space-y-4 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-serif font-medium text-stone-900 leading-tight flex flex-col md:flex-row md:items-start items-center justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 mt-1 md:mt-2">
                <img loading="lazy" src="/icon-skincare-1.webp" alt="Skincare Icon" className="w-full h-full object-cover" />
              </div>
              <div>
                Advanced AI <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 font-semibold">Skincare Scanner</span>
              </div>
            </h1>
            <p className="text-stone-500 font-light text-sm md:text-base leading-relaxed">
              Upload a selfie, specify your concerns, and receive an instant dermal health index with a custom morning & evening routine.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left panel: Wizard */}
            {!results && (
              <div className="lg:col-span-5 bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-2xl p-6 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] space-y-6 flex flex-col min-h-[550px] relative">

                {/* Transition Overlay */}
                {isTransitioning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 md:backdrop-blur-md z-20 rounded-2xl animate-fade-in">
                    <Loader2 className="animate-spin text-amber-600 mb-4" size={36} />
                    <p className="text-base font-serif font-medium text-stone-800">Analyzing Facial Structure...</p>
                    <p className="text-xs text-stone-500 mt-1">Extracting features and skin metrics</p>
                  </div>
                )}

                {/* Header/Progress */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif font-medium text-stone-800">
                    {currentStep === 1 && "1. Upload Selfie"}
                    {currentStep === 2 && "2. Personal Factors"}
                    {currentStep === 3 && "3. Your Goals"}
                    {currentStep === 4 && "4. Optional Details"}
                  </h2>
                  <span className="text-xs font-semibold text-stone-400">Step {currentStep} of 4</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${(currentStep / 4) * 100}%` }} />
                </div>

                <div className="flex-1 relative flex flex-col h-full">

                  {/* Step 1: Photo */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-fade-in flex flex-col flex-1">
                      <p className="text-sm text-stone-500 flex-1">Upload a well-lit, front-facing selfie with no filters for the most accurate analysis. The AI model reads texture and tone.</p>

                      <div className="flex-none">
                        {selectedImage ? (
                          <div className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group">
                            <Image
                              src={selectedImage}
                              alt="Uploaded selfie"
                              fill
                              style={{ objectFit: "cover" }}
                              className="transition-transform group-hover:scale-105 duration-500"
                            />
                            <button
                              onClick={handleReset}
                              className="absolute bottom-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 md:backdrop-blur-sm"
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                        ) : (
                          <div className="aspect-square border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center p-6 text-center bg-[#FAF6F0]/30">
                            <div className="flex flex-col items-center w-full max-w-[240px] space-y-4">
                              
                              {/* Option 1: Take Photo */}
                              <button
                                type="button"
                                onClick={() => cameraInputRef.current?.click()}
                                className="w-full py-3 px-4 bg-[#8C5E3C] hover:bg-[#704A2E] text-white rounded-xl font-medium text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm cursor-pointer"
                              >
                                <Camera size={15} />
                                <span>Take Selfie (Camera)</span>
                              </button>

                              <div className="flex items-center w-full my-1 text-stone-400">
                                <hr className="flex-grow border-stone-200" />
                                <span className="px-2 text-[9px] font-medium uppercase tracking-wider text-stone-400">or</span>
                                <hr className="flex-grow border-stone-200" />
                              </div>

                              {/* Option 2: Upload Photo */}
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-3 px-4 bg-white border border-stone-300 text-stone-750 rounded-xl font-medium text-xs flex items-center justify-center space-x-2 hover:bg-stone-50 transition-colors shadow-sm cursor-pointer"
                              >
                                <Upload size={14} />
                                <span>Upload from Gallery</span>
                              </button>

                              <p className="text-[10px] text-stone-450 leading-relaxed font-light pt-2">
                                Ensure your face is centered with clear, direct lighting for accurate diagnostic results.
                              </p>
                            </div>

                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            <input
                              type="file"
                              ref={cameraInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              capture="user"
                              className="hidden"
                            />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleNextStep}
                        disabled={!selectedImage}
                        className={cn(
                          "w-full mt-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 text-white shadow-md active:scale-[0.98]",
                          selectedImage ? "bg-[#8C5E3C] hover:bg-[#704A2E]" : "bg-stone-300 cursor-not-allowed"
                        )}
                      >
                        <span>Analyze Photo</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}

                  {/* Step 2: Quick Selects */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
                      <div className="space-y-6">
                        <p className="text-sm text-stone-500">To calibrate our model accurately, tell us about your environmental baseline.</p>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Age Range</label>
                            <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} disabled={isScanning} className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:ring-2 focus:ring-amber-600/40 outline-none shadow-sm">
                              {AGE_RANGES.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Gender</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={isScanning} className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:ring-2 focus:ring-amber-600/40 outline-none shadow-sm">
                              {GENDERS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Climate</label>
                            <select value={climate} onChange={(e) => setClimate(e.target.value)} disabled={isScanning} className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:ring-2 focus:ring-amber-600/40 outline-none shadow-sm">
                              {CLIMATES.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Water / Day</label>
                            <select value={waterIntake} onChange={(e) => setWaterIntake(e.target.value)} disabled={isScanning} className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:ring-2 focus:ring-amber-600/40 outline-none shadow-sm">
                              {WATER_INTAKE.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-4 mt-8 border-t border-stone-100/50">
                        <button onClick={handlePrevStep} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">Back</button>
                        <button onClick={handleNextStep} className="col-span-2 py-3 rounded-xl font-medium text-sm text-white bg-stone-800 hover:bg-black transition-colors flex items-center justify-center space-x-2">
                          <span>Next Step</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Concerns */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
                      <div className="space-y-6">
                        <p className="text-sm text-stone-500">What are your primary goals? Select all that apply. Our AI will prioritize ingredients for these concerns.</p>
                        <div className="flex flex-wrap gap-2.5">
                          {SKIN_CONCERNS_LIST.map((c) => {
                            const isSelected = concerns.includes(c.id);
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => handleConcernToggle(c.id)}
                                disabled={isScanning}
                                className={cn(
                                  "px-4 py-2.5 rounded-full text-sm font-medium transition-all border",
                                  isSelected ? "bg-amber-50 border-amber-600/30 text-amber-900 shadow-sm scale-[1.02]" : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:scale-[1.02]"
                                )}
                              >
                                {c.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-4 mt-8 border-t border-stone-100/50">
                        <button onClick={handlePrevStep} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">Back</button>
                        <button onClick={handleNextStep} className="col-span-2 py-3 rounded-xl font-medium text-sm text-white bg-stone-800 hover:bg-black transition-colors flex items-center justify-center space-x-2">
                          <span>Next Step</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Optional Details */}
                  {currentStep === 4 && (
                    <div className="space-y-6 animate-fade-in flex flex-col h-full flex-1 justify-between">
                      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">
                        <p className="text-sm text-stone-500 pb-2">Almost there! Fill out any of these optional details to further refine your curated routine.</p>

                        <details className="group border border-stone-200 rounded-xl bg-white overflow-hidden shadow-sm [&_summary::-webkit-details-marker]:hidden">
                          <summary className="cursor-pointer px-5 py-4 bg-stone-50/50 text-xs font-bold text-stone-700 uppercase tracking-wider flex justify-between items-center outline-none">
                            <span>Current Routine</span>
                            <ChevronDown size={16} className="text-stone-400 group-open:rotate-180 transition-transform duration-300" />
                          </summary>
                          <div className="p-5 space-y-4 border-t border-stone-100 bg-white">
                            <div className="flex gap-2">
                              {ROUTINE_OPTIONS.map(o => (
                                <button
                                  key={o.id}
                                  type="button"
                                  onClick={() => setHasRoutine(o.id)}
                                  className={cn(
                                    "flex-1 py-2 text-xs font-medium rounded-lg border transition-all",
                                    hasRoutine === o.id ? "bg-stone-800 text-white border-stone-800 shadow-sm" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                                  )}
                                >
                                  {o.name}
                                </button>
                              ))}
                            </div>
                            <textarea
                              placeholder="Products you already use..."
                              value={usedProducts}
                              onChange={(e) => setUsedProducts(e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:ring-2 focus:ring-amber-600/40 outline-none resize-none h-20 custom-scrollbar"
                            />
                          </div>
                        </details>

                        <details className="group border border-stone-200 rounded-xl bg-white overflow-hidden shadow-sm [&_summary::-webkit-details-marker]:hidden">
                          <summary className="cursor-pointer px-5 py-4 bg-stone-50/50 text-xs font-bold text-stone-700 uppercase tracking-wider flex justify-between items-center outline-none">
                            <span>Skin Triggers</span>
                            <ChevronDown size={16} className="text-stone-400 group-open:rotate-180 transition-transform duration-300" />
                          </summary>
                          <div className="p-5 border-t border-stone-100 bg-white">
                            <textarea
                              placeholder="e.g., 'My skin breaks out when I eat dairy'"
                              value={skinTriggers}
                              onChange={(e) => setSkinTriggers(e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:ring-2 focus:ring-amber-600/40 outline-none resize-none h-20 custom-scrollbar"
                            />
                          </div>
                        </details>

                        <details className="group border border-stone-200 rounded-xl bg-white overflow-hidden shadow-sm [&_summary::-webkit-details-marker]:hidden">
                          <summary className="cursor-pointer px-5 py-4 bg-stone-50/50 text-xs font-bold text-stone-700 uppercase tracking-wider flex justify-between items-center outline-none">
                            <span>Product Budget</span>
                            <ChevronDown size={16} className="text-stone-400 group-open:rotate-180 transition-transform duration-300" />
                          </summary>
                          <div className="p-5 border-t border-stone-100 bg-white">
                            <div className="grid grid-cols-2 gap-3">
                              {BUDGET_OPTIONS.map(o => (
                                <button
                                  key={o.id}
                                  type="button"
                                  onClick={() => setBudget(o.id)}
                                  className={cn(
                                    "py-2.5 text-xs font-medium rounded-lg border transition-all",
                                    budget === o.id ? "bg-amber-50 text-amber-900 border-amber-600/30 shadow-sm" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                                  )}
                                >
                                  {o.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </details>

                        <details className="group border border-stone-200 rounded-xl bg-white overflow-hidden shadow-sm [&_summary::-webkit-details-marker]:hidden">
                          <summary className="cursor-pointer px-5 py-4 bg-stone-50/50 text-xs font-bold text-stone-700 uppercase tracking-wider flex justify-between items-center outline-none">
                            <span>Anything Else?</span>
                            <ChevronDown size={16} className="text-stone-400 group-open:rotate-180 transition-transform duration-300" />
                          </summary>
                          <div className="p-5 border-t border-stone-100 bg-white">
                            <textarea
                              placeholder="Any other details you want us to consider..."
                              value={additionalInfo}
                              onChange={(e) => setAdditionalInfo(e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:ring-2 focus:ring-amber-600/40 outline-none resize-none h-20 custom-scrollbar"
                            />
                          </div>
                        </details>

                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-stone-100/50">
                        <button onClick={handlePrevStep} className="col-span-1 py-3 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">Back</button>
                        <button onClick={handleAnalyze} disabled={isScanning} className="col-span-2 py-3 rounded-xl font-semibold text-sm text-white bg-[#8C5E3C] hover:bg-[#704A2E] shadow-md transition-colors flex items-center justify-center space-x-2 active:scale-[0.98]">
                          {isScanning ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <span>Initiate AI Scan</span>
                              <ArrowRight size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Right panel: Results */}
                <div className={cn("bg-gradient-to-bl from-white/60 to-yellow-500/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white shadow-sm min-h-[500px] flex flex-col justify-center transition-all duration-700", results ? "lg:col-span-12 w-full" : "lg:col-span-7")}>

                  {/* Empty State */}
                  {!isScanning && !results && (
                    <div className="text-center py-16 px-6 max-w-sm mx-auto space-y-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 mx-auto">
                        <img loading="lazy" src="/icon_skincare_unisex.webp" alt="Skincare Icon" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-stone-700">Dermal Scanner Ready</h3>
                        <p className="text-xs text-stone-400 font-light mt-1.5 leading-relaxed">
                          Provide a selfie picture and select skin variables on the left. The AI engine will return hydration index ratios and personalized clinical suggestions.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Scanning State */}
                  {isScanning && (
                    <div className="text-center py-16 px-6 max-w-sm mx-auto space-y-5 animate-pulse">
                      <div className="w-16 h-16 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mx-auto">
                        <Loader2 className="animate-spin" size={28} />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-semibold text-stone-700">Scan In Progress</h3>
                        <p className="text-xs text-yellow-600 font-medium">{scanMessage}</p>
                      </div>
                      {/* Horizontal Progress Bar */}
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-yellow-500 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Scanned Results State */}
                  {results && !isScanning && (
                    <div className="space-y-8 animate-fade-in">

                      {/* Summary Score Row */}
                      <div className="flex flex-col md:flex-row items-center md:items-start justify-between border-b border-stone-100 pb-6 gap-6">
                        <div className="text-center md:text-left space-y-1">
                          <h3 className="text-3xl font-serif font-medium text-stone-800">Diagnostic Summary</h3>
                          <p className="text-base text-stone-500">Selfie scan matches database benchmarks.</p>
                          <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="text-[10px] font-semibold px-2 py-1 bg-stone-100 text-stone-600 rounded-lg uppercase tracking-wider">
                              {gender} • {ageRange}
                            </span>
                            {concerns.length > 0 && (
                              <span className="text-[10px] font-semibold px-2 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-100/50 uppercase tracking-wider">
                                {concerns.length} Concerns
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Radial Score Indicator */}
                        <div className="flex items-center space-x-4 bg-stone-50 px-5 py-3 rounded-2xl border border-stone-200/40 shrink-0">
                          <div className="relative w-14 h-14 flex items-center justify-center">
                            {/* Circular border wheel */}
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="28" cy="28" r="24" className="stroke-stone-200" strokeWidth="3" fill="transparent" />
                              <circle cx="28" cy="28" r="24" className="stroke-amber-700 transition-all duration-1000" strokeWidth="3" fill="transparent"
                                strokeDasharray={2 * Math.PI * 24}
                                strokeDashoffset={2 * Math.PI * 24 * (1 - results.score / 100)}
                              />
                            </svg>
                            <span className="absolute text-sm font-bold text-stone-800">{results.score}</span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-stone-700">Health Index</p>
                            <p className="text-[10px] text-stone-400 font-light">Age Metric: {results.skinAge} yrs</p>
                          </div>
                        </div>
                      </div>

                      {/* Sub Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium text-stone-600">
                            <span>Hydration Level</span>
                            <span>{results.metrics.hydration}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${results.metrics.hydration}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium text-stone-600">
                            <span>Barrier Integrity</span>
                            <span>{results.metrics.barrier}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${results.metrics.barrier}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium text-stone-600">
                            <span>Elasticity / Firmness</span>
                            <span>{results.metrics.elasticity}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${results.metrics.elasticity}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium text-stone-600">
                            <span>Pore / Clarity Index</span>
                            <span>{results.metrics.clarity}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${results.metrics.clarity}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Concerns Identified */}
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/40 space-y-2">
                        <h4 className="text-xs font-semibold text-stone-700 flex items-center space-x-1.5 uppercase tracking-wider">
                          <AlertCircle size={14} className="text-amber-800" />
                          <span>Pathology Observations</span>
                        </h4>
                        <ul className="text-xs text-stone-600 font-light space-y-1 list-disc pl-4">
                          {results.concernsIdentified.map((concernText, i) => (
                            <li key={i}>{concernText}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommended Routines */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-serif font-medium text-stone-800">Personalized Routine Schedule</h4>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                          
                          {/* Left Column: Product Cards */}
                          <div className="lg:col-span-2 flex flex-col space-y-10">

                            <div className="space-y-4">
                              <div className="flex items-center space-x-2 text-stone-800 border-b border-stone-200 pb-2">
                                <Sparkles size={20} className="text-amber-700" />
                                <span className="text-sm font-bold uppercase tracking-wider">Your Skincare Arsenal</span>
                              </div>
                              <div className="space-y-6">
                                {unifiedProductSteps.map((stepItem, idx) => {
                                  const dedupedProducts = stepItem.products?.reduce((acc, current) => {
                                    const brand = current.name.split(' ')[0].toLowerCase();
                                    if (!acc.find(p => p.name.toLowerCase().startsWith(brand))) {
                                      acc.push(current);
                                    }
                                    return acc;
                                  }, []) || [];

                                  return (
                                    <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                                      <h5 className="text-sm font-bold text-stone-800 capitalize pl-2">{stepItem.step} Products</h5>
                                      <ProductCarousel products={dedupedProducts} />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                          </div>

                          {/* Right Column: AI Routine Guide */}
                          <div className="lg:col-span-1 sticky top-28 bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50 shadow-sm self-start">
                            <h4 className="text-lg font-serif text-amber-900 mb-6 flex items-center space-x-2">
                              <ClipboardList size={20} className="text-amber-700" />
                              <span>Your AI Routine Guide</span>
                            </h4>
                            
                            <div className="space-y-8">
                              {/* AM Routine List */}
                              <div>
                                <h5 className="text-xs font-bold text-amber-800 mb-4 flex items-center uppercase tracking-wider">
                                  <Sun size={14} className="mr-1.5" /> AM Routine
                                </h5>
                                <div className="space-y-4">
                                  {results.routine.morning.map((step, idx) => (
                                    <div key={idx} className="relative pl-4 border-l-2 border-amber-200">
                                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-400"></div>
                                      <h6 className="text-sm font-bold text-stone-800">{step.step}</h6>
                                      <p className="text-xs text-stone-600 mt-1 leading-relaxed font-light">{step.desc}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* PM Routine List */}
                              <div>
                                <h5 className="text-xs font-bold text-stone-800 mb-4 flex items-center uppercase tracking-wider">
                                  <Moon size={14} className="mr-1.5" /> PM Routine
                                </h5>
                                <div className="space-y-4">
                                  {results.routine.evening.map((step, idx) => (
                                    <div key={idx} className="relative pl-4 border-l-2 border-stone-200">
                                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-stone-400"></div>
                                      <h6 className="text-sm font-bold text-stone-800">{step.step}</h6>
                                      <p className="text-xs text-stone-600 mt-1 leading-relaxed font-light">{step.desc}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
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
