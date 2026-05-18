import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import SessionProvider from "@/components/SessionProvider";
import Footer from "@/components/sections/Footer";
import { CompareProvider } from "@/lib/compare-context";
import CompareBar from "@/components/ui/CompareBar";

export const metadata: Metadata = {
  title: {
    default: "Luxe Estate — Premium Real Estate",
    template: "%s | Luxe Estate",
  },
  description: "Find your sanctuary. Curated luxury properties for the discerning eye.",
  keywords: ["real estate", "luxury properties", "buy home", "rent apartment", "premium listings"],
  authors: [{ name: "Luxe Estate" }],
  creator: "Luxe Estate",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luxe-estate-frontend-tau.vercel.app",
    siteName: "Luxe Estate",
    title: "Luxe Estate — Premium Real Estate",
    description: "Find your sanctuary. Curated luxury properties for the discerning eye.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
        width: 1200,
        height: 630,
        alt: "Luxe Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxe Estate — Premium Real Estate",
    description: "Find your sanctuary. Curated luxury properties for the discerning eye.",
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-clear-day font-sf text-nordic antialiased transition-colors duration-300 selection:bg-mosque selection:text-white dark:bg-nordic dark:text-clear-day">
        <SessionProvider>
          <CompareProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Footer />
              <CompareBar />
              <Toaster position="bottom-right" richColors closeButton />
            </ThemeProvider>
          </CompareProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
