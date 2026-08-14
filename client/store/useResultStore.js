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
        set({ history: data.items || [] });
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

