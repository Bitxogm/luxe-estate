import Navbar from "@/components/sections/Navbar";
import HeroSearch from "@/components/sections/HeroSearch";
import FeaturedCollections from "@/components/sections/FeaturedCollections";
import NewInMarket from "@/components/sections/NewInMarket";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <HeroSearch />
        <FeaturedCollections />
        <NewInMarket />
      </main>
    </>
  );
}
