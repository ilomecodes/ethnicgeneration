"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { megaCategories as seedCategories, MegaCategory, Subcategory } from "@/lib/admin-data";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function nextId(items: { id: number }[]) {
  return items.length > 0 ? Math.max(...items.map((x) => x.id)) + 1 : 1;
}

interface CategoriesContextType {
  categories: MegaCategory[];
  addCategory: (name: string, image: string) => void;
  updateCategory: (id: number, name: string, image: string) => void;
  deleteCategory: (id: number) => void;
  addSubcategory: (catId: number, name: string) => void;
  updateSubcategory: (catId: number, subId: number, name: string) => void;
  deleteSubcategory: (catId: number, subId: number) => void;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<MegaCategory[]>(seedCategories);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eg_categories");
      if (stored) setCategories(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  const persist = (next: MegaCategory[]) => {
    if (hydrated) localStorage.setItem("eg_categories", JSON.stringify(next));
    setCategories(next);
  };

  const addCategory = (name: string, image: string) => {
    const newCat: MegaCategory = {
      id: nextId(categories),
      name,
      slug: slugify(name),
      image: image || "/product-1.png",
      productCount: 0,
      subcategories: [],
    };
    persist([...categories, newCat]);
  };

  const updateCategory = (id: number, name: string, image: string) => {
    persist(
      categories.map((c) =>
        c.id === id ? { ...c, name, slug: slugify(name), image: image || c.image } : c
      )
    );
  };

  const deleteCategory = (id: number) => {
    persist(categories.filter((c) => c.id !== id));
  };

  const addSubcategory = (catId: number, name: string) => {
    persist(
      categories.map((c) => {
        if (c.id !== catId) return c;
        const allSubIds = categories.flatMap((x) => x.subcategories.map((s) => s.id));
        const newSub: Subcategory = {
          id: allSubIds.length > 0 ? Math.max(...allSubIds) + 1 : 1,
          name,
          slug: slugify(name),
          productCount: 0,
        };
        return { ...c, subcategories: [...c.subcategories, newSub] };
      })
    );
  };

  const updateSubcategory = (catId: number, subId: number, name: string) => {
    persist(
      categories.map((c) =>
        c.id !== catId
          ? c
          : {
              ...c,
              subcategories: c.subcategories.map((s) =>
                s.id === subId ? { ...s, name, slug: slugify(name) } : s
              ),
            }
      )
    );
  };

  const deleteSubcategory = (catId: number, subId: number) => {
    persist(
      categories.map((c) =>
        c.id !== catId
          ? c
          : { ...c, subcategories: c.subcategories.filter((s) => s.id !== subId) }
      )
    );
  };

  return (
    <CategoriesContext.Provider
      value={{ categories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be inside CategoriesProvider");
  return ctx;
}
