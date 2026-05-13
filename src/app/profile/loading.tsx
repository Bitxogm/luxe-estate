export default function ProfileLoading() {
  return (
    <div className="animate-pulse bg-clear-day">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-center gap-5">
          <div className="h-16 w-16 flex-shrink-0 rounded-full bg-nordic/10" />
          <div className="space-y-2">
            <div className="h-6 w-32 rounded-lg bg-nordic/10" />
            <div className="h-4 w-48 rounded bg-nordic/10" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex gap-8 border-b border-nordic/10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-[-1px] h-4 w-24 rounded bg-nordic/10 pb-4" />
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-nordic/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
