export default function HomeLoading() {
  return (
    <div className="animate-pulse bg-clear-day">
      {/* Hero */}
      <div className="h-[500px] w-full bg-nordic/20" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Featured Collections */}
        <section className="py-12">
          <div className="mb-8 h-6 w-48 rounded-lg bg-nordic/10" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-nordic/10">
                <div className="h-64 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Listings grid */}
        <section className="pb-20">
          <div className="mb-8 h-6 w-40 rounded-lg bg-nordic/10" />
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
        </section>
      </div>
    </div>
  );
}
