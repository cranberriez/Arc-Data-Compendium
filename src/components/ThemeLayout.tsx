"use client";
import { useEffect, useState, ReactNode } from "react";
import SidebarNavigation from "@/components/SidebarNavigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function ThemeLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <body className={`${inter.className} bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200`}>
      <div className="min-h-screen flex font-sans transition-colors duration-200">
        <SidebarNavigation theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </body>
  );
}
