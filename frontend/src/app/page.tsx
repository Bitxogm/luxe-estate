import Navbar from "@/components/sections/Navbar";
import HeroSearch from "@/components/sections/HeroSearch";
import FeaturedCollections from "@/components/sections/FeaturedCollections";
import NewInMarket from "@/components/sections/NewInMarket";
import { Suspense } from "react";

interface HomeProps {
  searchParams: Promise<{ page?: string; priceType?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page, priceType } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <HeroSearch />
        <FeaturedCollections />
        <Suspense fallback={null}>
          <NewInMarket
            page={page ? Number(page) : 1}
            priceType={priceType === "sale" || priceType === "rent" ? priceType : undefined}
          />
        </Suspense>
      </main>
    </>
  );
}
