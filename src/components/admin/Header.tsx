"use client";

import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
      <div />
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ background: "#f0ebe0", color: "#9CA3AF" }}
        >
          <Search size={15} />
          <span>Rechercher...</span>
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
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ background: "#b08a4a" }}
        >
          A
        </div>
      </div>
    </header>
  );
}
