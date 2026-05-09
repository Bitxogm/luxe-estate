import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxe Estate — Premium Real Estate",
  description: "Find your sanctuary. Curated luxury properties for the discerning eye.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-clear-day text-nordic font-sf selection:bg-mosque antialiased selection:text-white">
        {children}
      </body>
    </html>
  );
}
