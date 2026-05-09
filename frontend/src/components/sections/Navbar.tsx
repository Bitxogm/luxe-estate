import { Building2, Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="bg-clear-day/95 dark:bg-nordic/95 border-nordic/10 dark:border-clear-day/10 sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-shrink-0 cursor-pointer items-center gap-2">
            <div className="bg-nordic dark:bg-clear-day flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
              <Building2 size={18} className="dark:text-nordic text-white" />
            </div>
            <span className="text-nordic font-sf text-xl font-semibold tracking-tight transition-colors dark:text-white">
              LuxeEstate
            </span>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#"
              className="text-mosque dark:text-hint-green border-mosque dark:border-hint-green border-b-2 px-1 py-1 text-sm font-medium transition-colors"
            >
              Buy
            </a>
            <a
              href="#"
              className="text-nordic/70 dark:text-clear-day/70 hover:text-nordic dark:hover:text-clear-day hover:border-nordic/20 dark:hover:border-clear-day/20 px-1 py-1 text-sm font-medium transition-all hover:border-b-2"
            >
              Rent
            </a>
            <a
              href="#"
              className="text-nordic/70 dark:text-clear-day/70 hover:text-nordic dark:hover:text-clear-day hover:border-nordic/20 dark:hover:border-clear-day/20 px-1 py-1 text-sm font-medium transition-all hover:border-b-2"
            >
              Sell
            </a>
            <a
              href="#"
              className="text-nordic/70 dark:text-clear-day/70 hover:text-nordic dark:hover:text-clear-day hover:border-nordic/20 dark:hover:border-clear-day/20 px-1 py-1 text-sm font-medium transition-all hover:border-b-2"
            >
              Saved Homes
            </a>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-nordic dark:text-clear-day hover:text-mosque dark:hover:text-hint-green transition-colors">
              <Search size={20} />
            </button>
            <button className="text-nordic dark:text-clear-day hover:text-mosque dark:hover:text-hint-green relative transition-colors">
              <Bell size={20} />
              <span className="border-clear-day dark:border-nordic absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 bg-red-500 transition-colors" />
            </button>
            <ThemeToggle />
            <button className="border-nordic/10 dark:border-clear-day/10 ml-2 flex items-center gap-2 border-l pl-2 transition-colors">
              <div className="hover:ring-mosque dark:hover:ring-hint-green dark:bg-nordic-muted h-9 w-9 overflow-hidden rounded-full bg-gray-200 ring-2 ring-transparent transition-all">
                <div className="bg-hint-green dark:bg-mosque text-mosque dark:text-hint-green flex h-full w-full items-center justify-center text-sm font-semibold transition-colors">
                  V
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
