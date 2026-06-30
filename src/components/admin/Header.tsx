"use client";

import { Bell, Menu, Search } from "lucide-react";

interface Props {
  onOpenSidebar?: () => void;
}

export default function AdminHeader({ onOpenSidebar }: Props) {
  return (
    <header className="h-14 md:h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0 gap-3">
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0"
        onClick={onOpenSidebar}
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      <div className="hidden md:block flex-1" />

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm"
          style={{ background: "#f0ebe0", color: "#9CA3AF" }}
        >
          <Search size={15} />
          <span className="hidden md:inline">Rechercher...</span>
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell size={18} className="text-gray-500" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#EF4444" }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
          style={{ background: "#b08a4a" }}
        >
          A
        </div>
      </div>
    </header>
  );
}
