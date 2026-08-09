"use client";

import { useEffect, useState } from "react";
import { useResultStore } from "@/store/useResultStore";
import LandingView from "@/components/shared/LandingView";
import DashboardView from "@/components/shared/DashboardView";

export default function Home() {
  const { isAuthenticated } = useResultStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a clean loading frame with matching background color
    return <div className="min-h-screen bg-[#FAF6F0]" />;
  }

  return (
    <main className="min-h-screen">
      {isAuthenticated ? <DashboardView /> : <LandingView />}
    </main>
  );
}
