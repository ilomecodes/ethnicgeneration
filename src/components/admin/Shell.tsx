"use client";

import { useState } from "react";
import AdminSidebar from "./Sidebar";
import AdminHeader from "./Header";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f6f1e6" }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <AdminSidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
