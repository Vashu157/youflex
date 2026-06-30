import { auth } from "@/auth";
import DebouncedSearchInput from "@/components/DebouncedSearchInput";
import UserPostsSection from "@/components/UserPostsSection";
import { searchPosts } from "@/services/community.services";

function getQueryValue(searchParams) {
  return typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
}

export default async function SearchPostsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = getQueryValue(resolvedSearchParams);
  const session = await auth();
  const currentUserId = Number(session?.user?.id ?? 0);
  const results = query ? await searchPosts(query, currentUserId) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
          Search Posts
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Search by title or content.
        </p>
      </div>

      <DebouncedSearchInput
        key={query}
        initialQuery={query}
        placeholder="Search a post title or topic"
      />

      {query ? (
        <UserPostsSection
          posts={results}
          currentUserId={currentUserId}
          title="Matching Posts"
          emptyMessage={`No posts matched "${query}".`}
        />
      ) : (
        <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
          Start typing to search post titles and content.
        </div>
      )}
    </div>
  );
}
