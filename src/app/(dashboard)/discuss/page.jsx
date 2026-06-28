import PostCard from "@/components/post_card";
import { getPosts } from "@/services/community.services";
import Link from "next/link";

export default async function DiscussPage() {
  const posts = await getPosts();

  return (
    <>
      <Link
        href="/share"
        className="inline-flex rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        make a post
      </Link>
      <main className="flex flex-col items-center gap-6 py-10 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Community feed
        </h1>
        <div className="posts flex w-full flex-col items-center gap-6 px-4">
          {posts.map((singlePost) => (
            <PostCard
              key={singlePost.id}
              post={singlePost}
              href={`/discuss/${singlePost.id}`}
            />
          ))}
        </div>
      </main>
    </>
  );
}
