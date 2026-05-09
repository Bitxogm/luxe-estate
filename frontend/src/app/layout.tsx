import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Luxe Estate — Premium Real Estate",
  description: "Find your sanctuary. Curated luxury properties for the discerning eye.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-clear-day dark:bg-nordic text-nordic dark:text-clear-day font-sf selection:bg-mosque antialiased transition-colors duration-300 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
