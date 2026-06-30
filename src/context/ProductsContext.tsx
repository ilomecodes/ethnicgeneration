"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { products as seedProducts, Product } from "@/lib/admin-data";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ProductsContextType {
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "sales">) => void;
  updateProduct: (id: string, p: Omit<Product, "id" | "sales">) => void;
  deleteProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eg_products");
      if (stored) setProducts(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  const persist = (next: Product[]) => {
    if (hydrated) localStorage.setItem("eg_products", JSON.stringify(next));
    setProducts(next);
  };

  const addProduct = (p: Omit<Product, "id" | "sales">) => {
    const base = slugify(p.name) || "produit";
    let id = base;
    let i = 2;
    const existingIds = new Set(products.map((pr) => pr.id));
    while (existingIds.has(id)) {
      id = `${base}-${i}`;
      i++;
    }
    persist([...products, { ...p, id, sales: 0 }]);
  };

  const updateProduct = (id: string, p: Omit<Product, "id" | "sales">) => {
    persist(
      products.map((pr) => (pr.id === id ? { ...pr, ...p, id, sales: pr.sales } : pr))
    );
  };

  const deleteProduct = (id: string) => {
    persist(products.filter((pr) => pr.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be inside ProductsProvider");
  return ctx;
}
