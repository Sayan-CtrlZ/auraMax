"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LandingView from "@/components/shared/LandingView";
import DashboardView from "@/components/shared/DashboardView";

export default function Home() {
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
    // Return a clean loading frame with matching background color
    return <div className="min-h-screen bg-[#FAF6F0]" />;
  }

  return (
    <main className="min-h-screen">
      {user ? <DashboardView /> : <LandingView />}
    </main>
  );
}

