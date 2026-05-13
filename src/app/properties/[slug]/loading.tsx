export default function PropertyDetailLoading() {
  return (
    <div className="animate-pulse bg-clear-day">
      {/* Full-width image */}
      <div className="h-[400px] w-full bg-nordic/20" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left — specs */}
          <div className="space-y-6">
            <div className="h-8 w-64 rounded-lg bg-nordic/10" />
            <div className="space-y-3">
              <div className="h-4 w-48 rounded bg-nordic/10" />
              <div className="h-4 w-40 rounded bg-nordic/10" />
              <div className="h-4 w-52 rounded bg-nordic/10" />
              <div className="h-4 w-36 rounded bg-nordic/10" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full rounded bg-nordic/10" />
              <div className="h-3 w-full rounded bg-nordic/10" />
              <div className="h-3 w-5/6 rounded bg-nordic/10" />
              <div className="h-3 w-4/6 rounded bg-nordic/10" />
            </div>
          </div>

          {/* Right — sidebar */}
          <div className="h-48 rounded-xl bg-nordic/10" />
        </div>
      </div>
    </div>
  );
}
