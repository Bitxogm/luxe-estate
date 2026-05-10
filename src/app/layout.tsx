import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Luxe Estate — Premium Real Estate",
  description: "Find your sanctuary. Curated luxury properties for the discerning eye.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-clear-day font-sf text-nordic antialiased transition-colors duration-300 selection:bg-mosque selection:text-white dark:bg-nordic dark:text-clear-day">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
