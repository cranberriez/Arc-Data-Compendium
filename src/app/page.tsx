"use client";

import { FiSearch, FiHeart, FiSettings, FiUser, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="w-full flex flex-1 items-center justify-center p-8 bg-white dark:bg-black transition-colors min-h-screen">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-black dark:text-yellow-300 transition-colors">Theme Test Page</h1>
        <p className="mb-8 text-lg text-gray-800 dark:text-gray-200 transition-colors">
          The background and text colors are <span className="font-bold text-red-600 dark:text-lime">highly contrasted</span> in each theme.<br />
          Toggle the theme to verify switching works.
        </p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-32 rounded-lg bg-yellow-200 dark:bg-blue-900 flex items-center justify-center text-2xl font-bold text-black dark:text-white transition-colors">
            Light / Dark Box 1
          </div>
          <div className="h-32 rounded-lg bg-pink-300 dark:bg-green-700 flex items-center justify-center text-2xl font-bold text-black dark:text-white transition-colors">
            Light / Dark Box 2
          </div>
        </div>
      </div>
    </div>
  )
}