"use client";

import { FiSearch, FiHeart, FiSettings, FiUser, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="w-full flex flex-1 items-center justify-center p-8">
      {/* Placeholder grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-lg bg-background-cardLight dark:bg-background-cardDark shadow flex items-center justify-center text-xl text-gray-700 dark:text-text-dark border border-sand dark:border-slate transition-colors"
          >
            Placeholder {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}