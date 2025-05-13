"use client";

import { FiSearch, FiHeart, FiSettings, FiUser, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Title */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">ARC Data Compendium</h1>
            </div>

            {/* Center - Navigation Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {['Weapons', 'Armor', 'Items', 'Stats'].map((item) => (
                <button
                  key={item}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Right side - Icons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <FiSearch className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <FiHeart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <FiSettings className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <FiUser className="h-5 w-5" />
              </button>
              <button className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <FiMenu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Hidden by default */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {['Weapons', 'Armor', 'Items', 'Stats'].map((item) => (
            <button
              key={item}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Welcome to ARC Data Compendium</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Explore comprehensive data and statistics for all in-game items, weapons, and gear.
            </p>
            {/* Content will be added here */}
          </div>
        </div>
      </main>
    </div>
  );
}