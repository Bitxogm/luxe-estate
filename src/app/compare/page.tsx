import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare Properties",
};

export default function ComparePage() {
  return (
    <>
      <Navbar />
      <main>
        <CompareClient />
      </main>
    </>
  );
}
