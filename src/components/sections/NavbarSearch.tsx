"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import SearchModal from "./SearchModal";

export default function NavbarSearch() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="text-white/70 transition-colors hover:text-white"
      >
        <Search size={19} />
      </button>
      <SearchModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
