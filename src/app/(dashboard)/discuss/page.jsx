import PostCard from "@/components/post_card";
import getPosts from "@/lib/community";

export default function DiscussPage() {
  const posts = getPosts();
  return (
    <main className="flex flex-col items-center gap-6 py-10 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Community feed</h1>
    <div className="posts flex w-full flex-col items-center gap-6 px-4">
      {posts.map((singlePost) => (
        <PostCard key={singlePost.id} post={singlePost} />
      ))}
    </div>
    </main>
  );
}
