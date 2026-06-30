"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  priceFormatted: string;
  image: string;
  size: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eg_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  const persist = (next: CartItem[]) => {
    if (hydrated) localStorage.setItem("eg_cart", JSON.stringify(next));
    setItems(next);
  };

  const addItem = (item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.size === item.size
      );
      const next = existing
        ? prev.map((i) =>
            i.productId === item.productId && i.size === item.size
              ? { ...i, qty: i.qty + 1 }
              : i
          )
        : [...prev, { ...item, qty: 1 }];
      localStorage.setItem("eg_cart", JSON.stringify(next));
      return next;
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, size: string) => {
    persist(items.filter((i) => !(i.productId === productId && i.size === size)));
  };

  const updateQty = (productId: string, size: string, qty: number) => {
    if (qty <= 0) return removeItem(productId, size);
    persist(
      items.map((i) =>
        i.productId === productId && i.size === size ? { ...i, qty } : i
      )
    );
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQty,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
