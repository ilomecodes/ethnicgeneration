"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LangProvider } from "@/context/LangContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { SurMesureProvider } from "@/context/SurMesureContext";
import CartDrawer from "@/components/CartDrawer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LangProvider>
        <ProductsProvider>
          <CategoriesProvider>
            <OrdersProvider>
              <SurMesureProvider>
              <CartProvider>
                {children}
                <CartDrawer />
              </CartProvider>
              </SurMesureProvider>
            </OrdersProvider>
          </CategoriesProvider>
        </ProductsProvider>
      </LangProvider>
    </AuthProvider>
  );
}
