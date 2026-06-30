import { calculateProfileCompleteness } from "@/lib/profile.utils";

export default function ProfileCompletenessCard({ profile }) {
  const completeness = calculateProfileCompleteness(profile);

  return (
    <aside className="rounded-[2rem] glass-card p-8 transition-shadow duration-300 hover:shadow-md">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Profile Completeness
      </p>

      <div className="mt-5 flex items-end gap-3">
        <span className="text-5xl font-extrabold text-foreground tracking-tight">
          {completeness.percentage}%
        </span>
        <span className="pb-1.5 text-sm font-medium text-muted-foreground">
          {completeness.completedCount}/{completeness.totalCount} fields
        </span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted/50 border border-card-border/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-1000 ease-out"
          style={{ width: `${completeness.percentage}%` }}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-bold text-foreground">
          Missing
        </h2>

        {completeness.missing.length ? (
          <ul className="mt-3 space-y-2.5 text-sm font-medium text-muted-foreground">
            {completeness.missing.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm font-medium text-emerald-600 flex items-center gap-2">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Everything is filled out.
          </p>
        )}
      </div>
    </aside>
  );
}
