"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return <div className="h-7 w-14" />;
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex h-7 w-14 items-center rounded-full bg-white/10 p-1 transition-colors"
    >
      {/* sliding indicator */}
      <span
        className={`absolute h-5 w-5 rounded-full bg-white transition-transform duration-300 ease-in-out ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      />

      {/* Sun — left */}
      <span
        className={`relative z-10 flex w-5 items-center justify-center transition-colors duration-300 ${isDark ? "text-white/40" : "text-nordic"}`}
      >
        <Sun size={13} />
      </span>

      {/* Moon — right */}
      <span
        className={`relative z-10 flex w-5 items-center justify-center transition-colors duration-300 ${isDark ? "text-nordic" : "text-white/40"}`}
      >
        <Moon size={13} />
      </span>
    </button>
  );
}
