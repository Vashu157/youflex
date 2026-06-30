import PostCard from "@/components/post_card";
import { getPosts } from "@/services/community.services";
import Link from "next/link";

export default async function DiscussPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const showPostedMessage = resolvedSearchParams?.posted === "1";
  
  const page = Number(resolvedSearchParams?.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // We fetch limit + 1 to easily check if there is a next page
  const posts = await getPosts(null, limit + 1, offset);
  const hasNextPage = posts.length > limit;
  const displayPosts = posts.slice(0, limit);

  return (
    <>
      <main className="flex flex-col items-center gap-8 py-10 w-full max-w-4xl mx-auto px-4">
        <header className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Community Feed
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">Join the discussion and share your thoughts.</p>
          </div>
          <Link
            href="/share"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-primary-hover hover:shadow hover:-translate-y-0.5"
          >
            Make a post
          </Link>
        </header>

        {showPostedMessage ? (
          <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/80 px-5 py-4 text-sm font-semibold text-emerald-700 shadow-sm glass">
            Post created successfully! Your thoughts are now live.
          </div>
        ) : null}

        <div className="flex w-full flex-col gap-6">
          {displayPosts.map((singlePost) => (
            <PostCard
              key={singlePost.id}
              post={singlePost}
              href={`/discuss/${singlePost.id}`}
            />
          ))}
          {displayPosts.length === 0 && (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center glass-card rounded-2xl">
              <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg aria-hidden="true" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">No posts yet</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">Be the first to share something with the community!</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {page > 1 ? (
            <Link
              href={`/discuss?page=${page - 1}`}
              className="px-5 py-2 rounded-full border border-card-border bg-card-bg text-sm font-semibold text-foreground transition-all hover:bg-muted hover:border-muted-foreground"
            >
              Previous
            </Link>
          ) : (
            <span className="px-5 py-2 rounded-full border border-card-border/50 bg-card-bg/50 text-sm font-semibold text-muted-foreground cursor-not-allowed opacity-50">
              Previous
            </span>
          )}

          <span className="text-sm font-medium text-muted-foreground">
            Page {page}
          </span>

          {hasNextPage ? (
            <Link
              href={`/discuss?page=${page + 1}`}
              className="px-5 py-2 rounded-full border border-card-border bg-card-bg text-sm font-semibold text-foreground transition-all hover:bg-muted hover:border-muted-foreground"
            >
              Next
            </Link>
          ) : (
            <span className="px-5 py-2 rounded-full border border-card-border/50 bg-card-bg/50 text-sm font-semibold text-muted-foreground cursor-not-allowed opacity-50">
              Next
            </span>
          )}
        </div>
      </main>
    </>
  );
}
