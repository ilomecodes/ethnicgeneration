"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LangProvider } from "@/context/LangContext";
import CartDrawer from "@/components/CartDrawer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LangProvider>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </LangProvider>
    </AuthProvider>
  );
}
