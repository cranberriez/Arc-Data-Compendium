"use client";
import { FiSettings, FiSun, FiMoon } from 'react-icons/fi';

interface SidebarNavigationProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function SidebarNavigation({ theme, toggleTheme }: SidebarNavigationProps) {
  return (
    <aside className="flex flex-col justify-between w-56 h-screen bg-background-cardLight dark:bg-background-cardDark shadow-lg px-4 py-6 sticky top-0 transition-colors">
      {/* Top: Logo & Nav */}
      <div>
        <div className="flex items-center mb-10">
          <span className="text-2xl font-extrabold text-sunset mr-3">ARC</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-ash">Data <br/> Vault</span>
        </div>
        <nav className="flex flex-col gap-2">
          {['Weapons', 'Armor', 'Items', 'Stats'].map((item) => (
            <button
              key={item}
              className="flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium text-gray-700 dark:text-text-dark hover:bg-sand dark:hover:bg-slate focus:outline-none transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
      {/* Bottom: Settings & Theme Toggle */}
      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium text-gray-700 dark:text-text-dark hover:bg-sand dark:hover:bg-slate transition-colors">
          <FiSettings className="h-5 w-5" /> Settings
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium text-gray-700 dark:text-text-dark hover:bg-sand dark:hover:bg-slate transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />} Dark Mode
        </button>
      </div>
    </aside>
  );
}
