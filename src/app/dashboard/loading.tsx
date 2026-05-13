export default function DashboardLoading() {
  return (
    <div className="animate-pulse bg-clear-day">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-nordic/10" />
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white dark:bg-white/5">
          {/* Header row */}
          <div className="border-b border-nordic/5 px-6 py-4">
            <div className="h-4 w-32 rounded bg-nordic/10" />
          </div>

          {/* Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 border-b border-nordic/5 px-6 py-5 last:border-0"
            >
              <div className="h-4 w-32 rounded bg-nordic/10" />
              <div className="h-4 w-24 rounded bg-nordic/10" />
              <div className="h-4 w-16 rounded bg-nordic/10" />
              <div className="h-4 w-20 rounded bg-nordic/10" />
              <div className="ml-auto h-4 w-12 rounded bg-nordic/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
