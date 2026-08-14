"use client";

import { useState, useEffect } from "react";
import { useResultStore } from "@/store/useResultStore";
import { 
  History, ShieldCheck, Sparkles, Heart, Clock, X, Trash2, 
  Sun, Moon, AlertCircle, Info, ClipboardList, Activity 
} from "lucide-react";
import ProductCarousel from "@/components/shared/ProductCarousel";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { history, clearHistory, deleteHistoryItem, fetchHistory } = useResultStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();
  
  // Custom dialog state
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    type: null, 
    itemId: null, 
    title: "", 
    message: "" 
  });

  useEffect(() => {
    setIsMounted(true);
    const fetchUserHistory = async () => {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        fetchHistory(token);
      }
    };
    fetchUserHistory();
  }, [user]);

  const handleClearRequest = () => {
    setConfirmDialog({
      isOpen: true,
      type: "clearAll",
      itemId: null,
      title: "Clear All History",
      message: "Are you sure you want to delete all saved consultation reports? This action is irreversible."
    });
  };

  const handleDeleteRequest = (e, id) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      type: "deleteOne",
      itemId: id,
      title: "Delete Entry",
      message: "Are you sure you want to delete this consultation report? This action is irreversible."
    });
  };

  const executeConfirm = async () => {
    if (confirmDialog.type === "clearAll") {
      clearHistory();
      setSelectedItem(null);
    } else if (confirmDialog.type === "deleteOne") {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        await deleteHistoryItem(confirmDialog.itemId, token);
      }
      if (selectedItem?.id === confirmDialog.itemId) setSelectedItem(null);
    }
    setConfirmDialog({ isOpen: false, type: null, itemId: null, title: "", message: "" });
  };

  const getFilteredHistory = () => {
    if (activeFilter === "all") return history;
    return history.filter(item => item.category === activeFilter);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
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
        return <img loading="lazy" src="/icon_skincare_unisex.webp" alt="Skincare" className="w-full h-full object-cover" />;
      case "fashion":
        return <img loading="lazy" src="/icon_fashion_unisex.webp" alt="Fashion" className="w-full h-full object-cover" />;
      case "hair":
        return <img loading="lazy" src="/icon_hair_unisex.webp" alt="Hair" className="w-full h-full object-cover" />;
      default:
        return <img loading="lazy" src="/icon-activity.webp" alt="Activity" className="w-full h-full object-cover" />;
    }
  };

  const getCategoryColorClass = (category) => {
    switch (category?.toLowerCase()) {
      case "skincare": return "bg-amber-50 text-amber-800 border-amber-100";
      case "fashion": return "bg-amber-50 text-amber-800 border-amber-100";
      case "hair": return "bg-purple-50 text-purple-800 border-purple-100";
      default: return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  const filteredHistory = getFilteredHistory();

  if (!isMounted) return null;

  const unifiedHistoryProductSteps = [];
  if (selectedItem?.category === "skincare" && selectedItem.details?.routine) {
    const allSteps = [
      ...(selectedItem.details.routine.morning || []),
      ...(selectedItem.details.routine.evening || [])
    ];
    const uniqueMap = {};
    allSteps.forEach(stepItem => {
      const stepName = stepItem.step.toLowerCase();
      if (!uniqueMap[stepName]) {
        uniqueMap[stepName] = { ...stepItem, products: [...(stepItem.products || [])] };
      } else {
        uniqueMap[stepName].products.push(...(stepItem.products || []));
      }
    });
    unifiedHistoryProductSteps.push(...Object.values(uniqueMap));
  }

  return (
    <>
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-serif text-stone-900 flex items-center justify-center md:justify-start space-x-3">
              <History className="text-amber-800" size={32} />
              <span>Consultation History</span>
            </h1>
            <p className="text-stone-500 font-light text-sm">
              Review your compiled skincare logs, fashion sheets, and hair calendars.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearRequest}
              className="text-xs font-semibold px-4 py-2 border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors flex items-center justify-center space-x-1.5 self-center md:self-auto"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200/50 pb-4">
          {[
            { id: "all", name: "All Scans" },
            { id: "skincare", name: "Skincare" },
            { id: "fashion", name: "Fashion Fits" },
            { id: "hair", name: "Hair Plans" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
                activeFilter === btn.id
                  ? "bg-amber-800 border-amber-800 text-white shadow-sm"
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
              )}
            >
              {btn.name}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={cn(
                  "bg-white p-5 rounded-2xl border border-stone-200/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer group",
                  getCategoryGradient(item.category)
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl border border-stone-200/50 overflow-hidden shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className={cn("text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider", getCategoryColorClass(item.category))}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-stone-400 font-light flex items-center space-x-1">
                        <Clock size={10} />
                        <span>{formatTimestamp(item.timestamp).split(',')[0]}</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-stone-700 group-hover:text-amber-800 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteRequest(e, item.id)}
                    className="p-2 rounded-full text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Entry"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="text-xs px-3.5 py-1.5 border border-stone-200 rounded-full text-stone-600 font-medium group-hover:border-amber-800 group-hover:bg-amber-50 group-hover:text-amber-800 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200/50 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-50 border border-dashed border-stone-200 text-stone-300 flex items-center justify-center mx-auto">
                <Activity size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-700">No logs found</h3>
                <p className="text-xs text-stone-400 font-light max-w-xs mx-auto">
                  {activeFilter === "all" 
                    ? "Consult with our AI tools to populate this section with customized health schedules." 
                    : `No logs match the filtered category: "${activeFilter}".`}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Detail Overlay Drawer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 md:backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[95vw] xl:max-w-7xl bg-white rounded-3xl border border-stone-200/50 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="space-y-1">
                <span className={cn("text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider", getCategoryColorClass(selectedItem.category))}>
                  {selectedItem.category}
                </span>
                <h2 className="text-lg font-serif font-bold text-stone-800 pt-1">{selectedItem.title}</h2>
                <p className="text-[10px] text-stone-400 font-light flex items-center space-x-1">
                  <Clock size={10} />
                  <span>Report created on {formatTimestamp(selectedItem.timestamp)}</span>
                </p>
              </div>
              
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-colors"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              {/* Conditional Rendering: SKINCARE DETAILS */}
              {selectedItem.category === "skincare" && (
                <div className="space-y-6">
                  {/* Score & Skin type row */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Parameters</p>
                      <p className="text-xs text-stone-600 capitalize">Concern: {selectedItem.details.concern}</p>
                      <p className="text-xs text-stone-600 capitalize">Type: {selectedItem.details.skinType}</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-stone-50 px-4 py-2 border border-stone-200/40 rounded-xl">
                      <span className="text-xl font-bold text-amber-800">{selectedItem.details.score}</span>
                      <div className="text-[10px] text-stone-500 leading-tight">
                        <p className="font-semibold text-stone-700">Health Index</p>
                        <p>Skin Age: {selectedItem.details.skinAge} yrs</p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics bar */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedItem.details.metrics).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-stone-600 capitalize">
                          <span>{key}</span>
                          <span>{val}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-1">
                          <div className="bg-amber-800/80 h-full rounded-full" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Observations list */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/40 space-y-1.5">
                    <h4 className="text-xs font-semibold text-stone-700 flex items-center space-x-1.5 uppercase tracking-wider">
                      <AlertCircle size={14} className="text-amber-800" />
                      <span>Pathology Observations</span>
                    </h4>
                    <ul className="text-xs text-stone-600 font-light space-y-1 list-disc pl-4">
                      {selectedItem.details.concernsIdentified.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Unified Arsenal & AI Routine Guide */}
                  <div className="space-y-6 pt-2">
                    
                    {/* Unified Arsenal */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-stone-800 border-b border-stone-100 pb-1.5">
                        <Sparkles size={16} className="text-amber-700" />
                        <span className="text-xs font-bold uppercase tracking-wider">Your Skincare Arsenal</span>
                      </div>
                      <div className="space-y-8 mt-4">
                        {unifiedHistoryProductSteps.map((stepItem, idx) => {
                          const dedupedProducts = stepItem.products?.reduce((acc, current) => {
                            const brand = current.name.split(' ')[0].toLowerCase();
                            if (!acc.find(p => p.name.toLowerCase().startsWith(brand))) {
                              acc.push(current);
                            }
                            return acc;
                          }, []) || [];

                          return (
                            <div key={idx} className="space-y-3">
                               <h6 className="text-sm font-bold text-stone-800 capitalize pl-2">{stepItem.step} Products</h6>
                               <ProductCarousel products={dedupedProducts} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* AI Routine Guide */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-amber-800 border-b border-amber-200/50 pb-1">
                          <Sun size={15} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">AM Routine</span>
                        </div>
                        <div className="space-y-2.5">
                          {selectedItem.details.routine.morning.map((step, idx) => (
                            <div key={idx} className="relative pl-3 border-l-2 border-amber-200">
                              <div className="absolute -left-[4.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                              <h6 className="text-[11px] font-bold text-stone-800">{step.step}</h6>
                              <p className="text-xs text-stone-600 mt-1 leading-relaxed font-light">{step.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-stone-800 border-b border-stone-200/50 pb-1">
                          <Moon size={15} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">PM Routine</span>
                        </div>
                        <div className="space-y-2.5">
                          {selectedItem.details.routine.evening.map((step, idx) => (
                            <div key={idx} className="relative pl-3 border-l-2 border-stone-200">
                              <div className="absolute -left-[4.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-stone-400"></div>
                              <h6 className="text-[11px] font-bold text-stone-800">{step.step}</h6>
                              <p className="text-xs text-stone-600 mt-1 leading-relaxed font-light">{step.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              )}

              {/* Conditional Rendering: FASHION DETAILS */}
              {selectedItem.category === "fashion" && (
                <div className="space-y-6">
                  {/* Variables */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-4">
                    <span className="text-[10px] font-semibold bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Weather: {selectedItem.details.weather || "N/A"}
                    </span>
                    <span className="text-[10px] font-semibold bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Mood: {selectedItem.details.mood || "N/A"}
                    </span>
                    <span className="text-[10px] font-semibold bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Occasion: {selectedItem.details.occasion || "N/A"}
                    </span>
                    <span className="text-[10px] font-semibold bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Budget: ₹{selectedItem.details.budget?.toLocaleString('en-IN') || "0"}
                    </span>
                  </div>

                  {/* Outfit cards list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem.details.items?.length > 0 ? (
                      selectedItem.details.items.map((item, idx) => (
                        <div key={idx} className="bg-stone-50/50 p-4 rounded-xl border border-stone-200/30 flex flex-col space-y-3">
                          <h4 className="text-sm font-semibold text-stone-800">{item.title}</h4>
                          <div className="space-y-1.5 pt-2 border-t border-stone-200/50">
                            {item.links?.map((link, lIdx) => (
                              <a key={lIdx} href={link.url} target="_blank" rel="noreferrer" className="block text-[11px] text-brand-rose hover:text-brand-magenta transition-colors flex items-center space-x-1">
                                <span>• {link.name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-xs text-stone-400 italic">No specific outfit items saved for this entry.</div>
                    )}
                  </div>

                  {/* Style Advice */}
                  {selectedItem.details.advice && (
                    <div className="bg-brand-rose/5 p-4 rounded-xl border border-brand-rose/20 flex items-start space-x-3">
                      <Info className="text-brand-rose flex-shrink-0 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">Stylist Directives</h4>
                        <p className="text-xs text-stone-600 font-light leading-relaxed">{selectedItem.details.advice}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conditional Rendering: HAIR DETAILS */}
              {selectedItem.category === "hair" && (
                <div className="space-y-6">
                  {/* Parameters */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-4">
                    <span className="text-[10px] font-semibold bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Type: {selectedItem.details.hairType}
                    </span>
                    <span className="text-[10px] font-semibold bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Scalp: {selectedItem.details.scalpType}
                    </span>
                  </div>

                  {/* 7-day schedule summary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2.5">Weekly Care Timeline</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {selectedItem.details.days.map((d, i) => (
                        <div key={i} className="p-3 bg-stone-50/50 border border-stone-200/20 rounded-xl flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-800">{d.day}</span>
                            <span className="text-[8px] font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded uppercase tracking-wider">{d.type}</span>
                          </div>
                          <h5 className="text-[11px] font-semibold text-stone-700 mt-2">{d.activity}</h5>
                          <p className="text-[10px] text-stone-400 font-light mt-0.5 leading-relaxed">{d.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Follicle Tips */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/40 space-y-2">
                    <h4 className="text-xs font-semibold text-stone-700 flex items-center space-x-1.5 uppercase tracking-wider">
                      <ClipboardList size={14} className="text-amber-800" />
                      <span>Follicle Health Directives</span>
                    </h4>
                    <ul className="text-xs text-stone-600 font-light space-y-1.5 list-disc pl-4 leading-relaxed">
                      {selectedItem.details.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>

      {/* Custom Alert Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-stone-200/50 shadow-2xl overflow-hidden max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-stone-800">{confirmDialog.title}</h3>
              <p className="text-sm text-stone-500 font-light leading-relaxed">{confirmDialog.message}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-stone-100">
              <button
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="px-5 py-2.5 rounded-xl font-medium text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors flex-1"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirm}
                className="px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-red-600 hover:bg-red-700 transition-colors flex-1 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
