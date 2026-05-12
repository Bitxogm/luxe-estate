interface ProfileHeaderProps {
  name: string;
  email: string;
  createdAt: Date;
  savedCount: number;
  visitCount: number;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileHeader({
  name,
  email,
  createdAt,
  savedCount,
  visitCount,
}: ProfileHeaderProps) {
  const memberYear = new Date(createdAt).getFullYear();

  return (
    <header className="mb-10 flex flex-col items-start justify-between gap-8 rounded-3xl border border-nordic/5 bg-hint-green p-8 shadow-sm dark:border-white/5 dark:bg-white/5 md:flex-row md:items-center">
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-mosque text-2xl font-bold text-white shadow-lg dark:border-nordic lg:h-32 lg:w-32 lg:text-3xl">
          {getInitials(name || email)}
        </div>
        <div>
          <h1 className="mb-2 font-sf text-3xl font-bold tracking-tight text-nordic dark:text-clear-day lg:text-4xl">
            {name || "Anonymous"}
          </h1>
          <p className="flex items-center gap-1 text-sm text-nordic/70 dark:text-clear-day/70">
            Member since {memberYear}
          </p>
        </div>
      </div>

      <div className="flex gap-6 rounded-xl border border-nordic/5 bg-white px-8 py-4 shadow-sm dark:border-white/10 dark:bg-nordic-muted/20 lg:gap-12">
        <div className="text-center">
          <div className="text-2xl font-bold text-nordic dark:text-clear-day">{savedCount}</div>
          <div className="text-xs font-medium uppercase tracking-wider text-nordic/50 dark:text-clear-day/50">
            Saved
          </div>
        </div>
        <div className="w-px bg-nordic/10 dark:bg-white/10" />
        <div className="text-center">
          <div className="text-2xl font-bold text-mosque dark:text-hint-green">{visitCount}</div>
          <div className="text-xs font-medium uppercase tracking-wider text-nordic/50 dark:text-clear-day/50">
            Visits
          </div>
        </div>
        <div className="w-px bg-nordic/10 dark:bg-white/10" />
        <div className="text-center">
          <div className="text-2xl font-bold text-nordic dark:text-clear-day">0</div>
          <div className="text-xs font-medium uppercase tracking-wider text-nordic/50 dark:text-clear-day/50">
            Sold
          </div>
        </div>
      </div>
    </header>
  );
}
