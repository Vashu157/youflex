import PostCard from "@/components/post_card";

export default function UserPostsSection({
  posts,
  currentUserId = 0,
  title = "Latest Posts",
  emptyMessage = "No posts yet.",
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
          {title}
        </h2>
      </div>

      {posts.length ? (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              href={`/discuss/${post.id}`}
              showDeleteAction={Number(currentUserId) === Number(post.userId)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
