"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) return;
    onClose();
    router.push(`/?search=${encodeURIComponent(value)}`);
  }

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex items-start justify-center px-4 pt-24 transition-all duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-nordic/80 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <form onSubmit={handleSubmit} className="relative">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by city, address..."
            className="w-full rounded-2xl border border-white/10 bg-white/10 py-5 pl-14 pr-14 text-lg text-white placeholder-white/30 outline-none backdrop-blur-md focus:border-hint-green focus:bg-white/15"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
          >
            <X size={20} />
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-white/30">
          Press Enter to search · Esc to close
        </p>
      </div>
    </div>
  );
}
