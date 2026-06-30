import DebouncedSearchInput from "@/components/DebouncedSearchInput";
import ProfileCard from "@/components/ProfileCard";
import { searchUsers } from "@/services/profile.service";

function getQueryValue(searchParams) {
  return typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
}

export default async function SearchUsersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = getQueryValue(resolvedSearchParams);
  const results = query ? await searchUsers(query) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
          Search Users
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Search by username or full name.
        </p>
      </div>

      <DebouncedSearchInput
        key={query}
        initialQuery={query}
        placeholder="Try vashu or a full name"
      />

      {query ? (
        results.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {results.map((profile) => (
              <ProfileCard
                key={profile.userId}
                fullName={profile.fullName}
                username={profile.username}
                avatar={profile.avatarUrl}
                domain={profile.domain}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
            No users matched {query}.
          </div>
        )
      ) : (
        <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
          Start typing to find people by username or full name.
        </div>
      )}
    </div>
  );
}
