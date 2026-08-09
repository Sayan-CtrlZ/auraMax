import { create } from 'zustand'

// Helper to check if window is defined (browser side)
const isBrowser = typeof window !== 'undefined';

// Safe localStorage wrapper
const getStorageItem = (key, fallback) => {
  if (!isBrowser) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error("Error reading localStorage key:", key, e);
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing localStorage key:", key, e);
  }
};

export const useResultStore = create((set, get) => ({
  // Auth state
  user: getStorageItem('aura_user', null),
  isAuthenticated: !!getStorageItem('aura_user', null),
  
  // Results & History
  skincareResults: null,
  fashionResults: null,
  hairResults: null,
  history: getStorageItem('aura_history', []),

  // Auth Actions
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demonstration, allow any valid-looking email
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    
    const mockUser = {
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'User',
      email: email,
    };
    
    set({ user: mockUser, isAuthenticated: true });
    setStorageItem('aura_user', mockUser);
    return mockUser;
  },

  signup: async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters.');
    }
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
    
    const mockUser = { name, email };
    set({ user: mockUser, isAuthenticated: true });
    setStorageItem('aura_user', mockUser);
    return mockUser;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, skincareResults: null, fashionResults: null, hairResults: null });
    if (isBrowser) {
      localStorage.removeItem('aura_user');
    }
  },

  // Results Actions
  setSkincareResults: (results) => set({ skincareResults: results }),
  setFashionResults: (results) => set({ fashionResults: results }),
  setHairResults: (results) => set({ hairResults: results }),
  
  addHistoryItem: (item) => {
    const newItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...item
    };
    const updatedHistory = [newItem, ...get().history];
    set({ history: updatedHistory });
    setStorageItem('aura_history', updatedHistory);
  },

  clearHistory: () => {
    set({ history: [] });
    if (isBrowser) {
      localStorage.removeItem('aura_history');
    }
  },

  clearStore: () => {
    set({ skincareResults: null, fashionResults: null, hairResults: null, history: [] });
    if (isBrowser) {
      localStorage.removeItem('aura_history');
      localStorage.removeItem('aura_user');
    }
  },
}))
