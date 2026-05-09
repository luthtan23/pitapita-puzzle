import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

export const viewport = {
  themeColor: "#a855f7",
};

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PitaPita · Image Puzzle Game",
  description:
    "PitaPita – A stunning, interactive image puzzle game. Drag, drop and solve beautiful picture puzzles with multiple difficulty levels.",
  keywords: ["puzzle", "image puzzle", "drag and drop", "game", "pitapita"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PitaPita",
  },
  openGraph: {
    title: "PitaPita · Image Puzzle Game",
    description: "Solve beautiful picture puzzles with drag-and-drop pieces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        {/* Ambient background orbs */}
        <div className="bg-orb orb-1" aria-hidden="true" />
        <div className="bg-orb orb-2" aria-hidden="true" />
        <div className="bg-orb orb-3" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
