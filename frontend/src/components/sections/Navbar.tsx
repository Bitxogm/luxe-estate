import { Building2, Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-clear-day/95 border-nordic/10 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-shrink-0 cursor-pointer items-center gap-2">
            <div className="bg-nordic flex h-8 w-8 items-center justify-center rounded-lg">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-nordic font-sf text-xl font-semibold tracking-tight">
              LuxeEstate
            </span>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#"
              className="text-mosque border-mosque border-b-2 px-1 py-1 text-sm font-medium"
            >
              Buy
            </a>
            <a
              href="#"
              className="text-nordic/70 hover:text-nordic hover:border-nordic/20 px-1 py-1 text-sm font-medium transition-all hover:border-b-2"
            >
              Rent
            </a>
            <a
              href="#"
              className="text-nordic/70 hover:text-nordic hover:border-nordic/20 px-1 py-1 text-sm font-medium transition-all hover:border-b-2"
            >
              Sell
            </a>
            <a
              href="#"
              className="text-nordic/70 hover:text-nordic hover:border-nordic/20 px-1 py-1 text-sm font-medium transition-all hover:border-b-2"
            >
              Saved Homes
            </a>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-nordic hover:text-mosque transition-colors">
              <Search size={20} />
            </button>
            <button className="text-nordic hover:text-mosque relative transition-colors">
              <Bell size={20} />
              <span className="border-clear-day absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 bg-red-500" />
            </button>
            <button className="border-nordic/10 ml-2 flex items-center gap-2 border-l pl-2">
              <div className="hover:ring-mosque h-9 w-9 overflow-hidden rounded-full bg-gray-200 ring-2 ring-transparent transition-all">
                <div className="bg-hint-green text-mosque flex h-full w-full items-center justify-center text-sm font-semibold">
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
