# AuraMax — AI Beauty & Fashion Consultant

AuraMax is a premium, high-fidelity web application designed as a personalized AI beauty and style advisor. Built with Next.js 14, Tailwind CSS, and Zustand, AuraMax features a luxury warm aesthetic (stone, amber, cream tones), smooth micro-animations, and persistent user consultation history tracking.

---

## ✨ Features

*   **Premium Landing Screen**: A responsive, cross-fading cinematic hero slideshow with custom beauty and fashion imagery.
*   **Persistent Authentication**: Client-side registration and login simulation managed via Zustand, persisting user sessions in `localStorage`.
*   **Interactive Dashboard**: Personalized greeting banner, summary counters (scans saved, skin aura, wardrobe curator), and a quick-look feed of recent consultations.
*   **AI Skincare Scanner**: Upload a selfie (or load a sample portrait) to initiate a dermal health checkup featuring a glowing green laser scanner overlay, circular health index indicator, sub-metrics (hydration, barrier, elasticity, clarity), and clinical Morning/Night care routines.
*   **AI Outfit Curator**: Custom lookbook assembler matching selected aesthetics (Minimalist, Avant-garde, Bohemian, Classic, Bold), occasions, and color palettes. Outputs styled coordinates (upperwear, bottoms, footwear, accessories), hex swatches, and styling advice.
*   **AI Hair Planner**: Tailors weekly washing, scalp care, and deep conditioning masks into an interactive 7-day calendar based on hair texture and scalp moisture types.
*   **Consultation Log History**: Sort reports using tag filters, clear history, and open comprehensive detailed summary drawers using card overlay modals.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS & Vanilla CSS
*   **Components & Icons**: shadcn/ui, Lucide Icons
*   **State Management**: Zustand (with LocalStorage state synchronization)

---

## 📂 Project Structure

```text
auraM/
├── client/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.jsx      # Premium login screen
│   │   │   └── signup/page.jsx     # Registration screen
│   │   ├── skincare/page.jsx       # Dermal scanning module
│   │   ├── fashion/page.jsx        # Style coordination lookbook
│   │   ├── hair/page.jsx           # Follicle care calendar
│   │   ├── history/page.jsx        # Timeline log & detail modals
│   │   ├── layout.jsx              # Global layouts & fonts
│   │   ├── globals.css             # Global Tailwind directives & animations
│   │   └── page.jsx                # Entry route toggling
│   ├── components/
│   │   └── shared/
│   │       ├── Navbar.jsx          # Auth-aware responsive navigation
│   │       ├── HeroSlideshow.jsx   # Home landing cross-fade slider
│   │       └── DashboardView.jsx   # Personalized user hub
│   ├── store/
│   │   └── useResultStore.js       # Zustand authentication & history store
│   └── public/
│       ├── hero/                   # Cinematic background slideshow assets
│       └── sample-selfie.png       # Preloaded portrait for skincare scan
└── README.md                       # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   npm or yarn

### Installation & Run

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
