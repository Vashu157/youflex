export default function SearchUsersLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="h-24 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-56 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-56 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-56 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </div>
  );
}
