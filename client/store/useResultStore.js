import { create } from 'zustand'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper to check if window is defined (browser side)
const isBrowser = typeof window !== 'undefined';

export const useResultStore = create((set, get) => ({
  // Results
  skincareResults: null,
  fashionResults: null,
  hairResults: null,
  
  // History State
  history: [],
  isLoadingHistory: false,

  // Results Actions
  setSkincareResults: (results) => set({ skincareResults: results }),
  setFashionResults: (results) => set({ fashionResults: results }),
  setHairResults: (results) => set({ hairResults: results }),

  fetchHistory: async (token) => {
    if (!token) return;
    set({ isLoadingHistory: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];
        const normalizedItems = items.map(item => {
          const category = item.type || item.category || "unknown";
          const timestamp = item.created_at || item.timestamp || "";
          
          const rawResult = item.result || {};
          let details = {};
          let title = item.title || "";
          
          if (category === "skincare") {
            details = {
              ageRange: "N/A",
              gender: "unisex",
              climate: "N/A",
              waterIntake: "N/A",
              concerns: [],
              hasRoutine: false,
              usedProducts: [],
              skinTriggers: [],
              budget: "N/A",
              additionalInfo: "",
              skinType: "Normal",
              concern: (rawResult.concernsIdentified && rawResult.concernsIdentified[0]) || "General Care",
              ...rawResult
            };
            if (!title) {
              const ageStr = details.ageRange && details.ageRange !== "N/A" ? `, ${details.ageRange}` : "";
              title = `Skin Analysis (${details.gender === 'female' ? 'F' : details.gender === 'male' ? 'M' : 'NB'}${ageStr})`;
            }
          } else if (category === "fashion") {
            const outfitsList = Array.isArray(rawResult) ? rawResult : (rawResult.items || rawResult.outfits || []);
            const mappedOutfits = outfitsList.map(outfit => {
              const links = [];
              if (Array.isArray(outfit.pieces)) {
                outfit.pieces.forEach(piece => {
                  if (Array.isArray(piece.products)) {
                    piece.products.forEach(prod => {
                      links.push({
                        name: `${prod.name} (${prod.price} via ${prod.source})`,
                        url: prod.link || "#"
                      });
                    });
                  }
                });
              }
              return {
                title: outfit.title,
                links: links.length > 0 ? links : (outfit.links || [])
              };
            });
            
            details = {
              weather: rawResult.weather || "N/A",
              occasion: rawResult.occasion || "N/A",
              budget: rawResult.budget || "N/A",
              items: mappedOutfits,
              advice: rawResult.advice || ""
            };
            if (!title) {
              title = `Style Guide: ${details.occasion}`;
            }
          } else if (category === "hair") {
            details = {
              hairType: rawResult.hairType || "N/A",
              scalpType: rawResult.scalpType || "N/A",
              days: rawResult.days || [],
              tips: rawResult.tips || [],
              products: rawResult.products || [],
              hairstyles: rawResult.hairstyles || [],
              mode: rawResult.hairstyles ? "styling" : "care",
              ...rawResult
            };
            if (!title) {
              title = rawResult.title || "Hair Planner Concept";
            }
          } else {
            details = rawResult;
          }
          
          return {
            id: item.id,
            category,
            timestamp,
            title,
            details
          };
        });
        set({ history: normalizedItems });
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  addHistoryItem: (item) => {
    // Handled by backend during analysis
  },

  clearHistory: () => {
    set({ history: [] });
  },

  deleteHistoryItem: async (id, token) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/history/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const updatedHistory = get().history.filter(item => item.id !== id);
        set({ history: updatedHistory });
      }
    } catch (error) {
      console.error("Failed to delete history:", error);
    }
  },

  clearStore: () => {
    set({ skincareResults: null, fashionResults: null, hairResults: null, history: [] });
  },
}))

