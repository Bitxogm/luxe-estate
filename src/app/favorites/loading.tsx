export default function FavoritesLoading() {
  return (
    <div className="animate-pulse bg-clear-day">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-8 space-y-3">
          <div className="h-8 w-40 rounded-lg bg-nordic/10" />
          <div className="h-4 w-60 rounded bg-nordic/10" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white dark:bg-white/5">
              <div className="h-48 w-full bg-nordic/10" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-nordic/10" />
                <div className="h-3 w-1/2 rounded bg-nordic/10" />
                <div className="h-3 w-2/3 rounded bg-nordic/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
