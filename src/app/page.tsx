"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Collections from "@/components/Collections";
import Banner from "@/components/Banner";
import Drawer from "@/components/Drawer";
import Footer from "@/components/Footer";

function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const heroH = heroRef.current?.offsetHeight ?? window.innerHeight;
      setScrolledPast(window.scrollY > heroH * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <Nav scrolledPast={scrolledPast} onOpenDrawer={openDrawer} />
      <div ref={heroRef}>
        <Hero onOpenDrawer={openDrawer} />
      </div>
      <Collections />
      <Banner onOpenDrawer={openDrawer} />
      <Drawer open={drawerOpen} onClose={closeDrawer} />
      <Footer />
    </>
  );
}

export default function Page() {
  return <HomePage />;
}
