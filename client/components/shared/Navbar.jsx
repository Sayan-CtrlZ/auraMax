"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const isAuthenticated = !!user;

  // Set mounted flag to handle hydration safety with localStorage read
  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  // Determine which links to show based on auth state
  const loggedInLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Skincare Scan", href: "/skincare" },
    { name: "Style Guide", href: "/fashion" },
    { name: "Hair Planner", href: "/hair" },
    { name: "History", href: "/history" },
  ];

  const loggedOutLinks = [
    { name: "Home", href: "/#home" },
    { name: "Features", href: "/#features" },
    { name: "How it works", href: "/#how-it-works" },
    { name: "Pricing", href: "/#pricing" },
  ];

  const navLinks = isMounted && isAuthenticated ? loggedInLinks : loggedOutLinks;
  
  // Decide if headers should have solid background (e.g. on subpages, always scrolled look)
  const isDashboard = isMounted && isAuthenticated && pathname === "/";
  const isSubPage = pathname !== "/" || isDashboard;
  const headerClass = (isScrolled || isSubPage)
    ? "top-0 border-b border-stone-200/40 bg-[#EAE0D5]/95 backdrop-blur-xl shadow-md py-2 text-stone-900"
    : "top-0 border-b border-white/10 bg-black/20 backdrop-blur-xl py-3 text-white";

  const linkColorClass = (isScrolled || isSubPage)
    ? "text-stone-600 hover:text-brand-purple"
    : "text-stone-200 hover:text-white";

  const logoColorClass = (isScrolled || isSubPage)
    ? "text-stone-900 font-bold"
    : "text-white font-bold";

  return (
    <header className={cn("fixed left-0 right-0 z-50 w-full transition-all duration-300", headerClass)}>
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* App Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <img loading="lazy" 
            src="/logo_for_header.webp" 
            alt="AuraMax Logo" 
            className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-full" 
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {isMounted && navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-base font-medium tracking-wide transition-all duration-300 relative py-1.5",
                  linkColorClass,
                  isActive && "text-brand-purple font-semibold"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-purple rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA / Auth Button */}
        <div className="hidden md:flex items-center space-x-4">
          {isMounted && isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className={cn("text-base font-medium flex items-center space-x-1.5", (isScrolled || isSubPage) ? "text-stone-700" : "text-stone-200")}>
                <User size={18} className="text-brand-purple" />
                <span>Hi, {user?.displayName?.split(' ')[0] || 'User'}</span>
              </span>
              <button
                onClick={handleLogout}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full px-6 py-3 transition-all duration-300 font-medium text-sm flex items-center space-x-1 border-stone-350 hover:bg-stone-50",
                  (isScrolled || isSubPage)
                    ? "text-stone-700 border-stone-200 hover:text-stone-900"
                    : "text-white border-white/30 hover:bg-white/10 hover:text-white"
                )}
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full h-auto px-10 py-4 transition-all duration-300 font-medium text-base text-white cursor-pointer",
                (isScrolled || isSubPage)
                  ? "bg-gradient-to-r from-brand-purple to-brand-magenta hover:opacity-95 shadow-sm"
                  : "bg-white hover:bg-stone-100 text-stone-900"
              )}
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className={(isScrolled || isSubPage) ? "text-stone-900" : "text-white"} size={24} />
          ) : (
            <Menu className={(isScrolled || isSubPage) ? "text-stone-900" : "text-white"} size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[calc(100%+12px)] left-0 right-0 bg-white/95 md:backdrop-blur-md border border-stone-250/60 shadow-xl rounded-3xl py-6 px-6 space-y-4 flex flex-col transition-all duration-300">
          {isMounted && navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-stone-750 hover:text-brand-purple text-lg font-medium py-2 border-b border-stone-100",
                pathname === link.href && "text-brand-purple font-semibold"
              )}
            >
              {link.name}
            </Link>
          ))}
          {isMounted && isAuthenticated ? (
            <div className="pt-2 flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-stone-700 px-1 py-1 text-base font-medium">
                <User size={20} className="text-brand-purple" />
                <span>Logged in as <strong>{user?.displayName || 'User'}</strong></span>
              </div>
              <button
                onClick={handleLogout}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full rounded-full py-3.5 flex items-center justify-center space-x-2 border-stone-300 text-stone-750 hover:bg-stone-50"
                )}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                signInWithGoogle();
              }}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-auto bg-gradient-to-r from-brand-purple to-brand-magenta text-white rounded-full py-4 mt-2 font-medium text-base text-center cursor-pointer"
              )}
            >
              Get Started
            </button>
          )}
        </div>
      )}
    </header>
  );
}
