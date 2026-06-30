import { notFound } from "next/navigation";
import PostCard from "@/components/post_card";
import { getDiscussions, getPostById } from "@/services/community.services";
import DiscussionForm from "@/components/DiscussionForm";
import Discussion from "@/components/Discussion";
import { auth } from "@/auth";

export default async function PostPage({ params }) {
  const { postId } = await params;
  const session = await auth();
  const currentUserId = Number(session?.user?.id ?? 0);

  const post = await getPostById(Number(postId), currentUserId);

  if (!post) notFound();

  const discussions = await getDiscussions(Number(postId));

  return (
    <main className="mx-auto max-w-4xl p-6">
      <PostCard post={post} />

      <DiscussionForm postId={post.id} />

      <section id="discussion" className="mt-10">
        <h2>Discussion ({post.discussionCount})</h2>

        {discussions
          .filter((d) => d.parentId === null)
          .map((discussion) => (
            <Discussion
              key={discussion.id}
              discussion={discussion}
              discussions={discussions}
              postId={post.id}
              currentUserId={currentUserId}
            />
          ))}
      </section>
    </main>
  );
}
