"use client";

import { useEffect, useState, ReactNode } from "react";
import SidebarNavigation from "@/components/SidebarNavigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function ThemeLayout({ children }: { children: ReactNode }) {
  // Always start with 'light' to match SSR output
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On client, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    console.log(`[ThemeLayout] Theme changed to:`, theme);
  }, [theme, mounted]);

  if (!mounted) {
    // Optionally, render nothing or a loading spinner until mounted
    return null;
  }

  return (
    <div className={`${inter.className} bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200`}>
      <div className="min-h-screen flex font-sans transition-colors duration-200">
        <SidebarNavigation theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}