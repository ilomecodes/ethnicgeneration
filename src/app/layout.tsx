import type { Metadata } from "next";
import { Cormorant_Garamond, Archivo, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nav",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ethnicgeneration — Artisanat Africain, Silhouette Globale",
  description:
    "Ethnicgeneration — collections Femmes, Hommes, Enfants. Atelier sur mesure. Lagos / Paris.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${archivo.variable} ${inter.variable}`}>
      <body className="min-h-screen overflow-x-hidden font-[family-name:var(--font-ui)]">
        {children}
      </body>
    </html>
  );
}
