import { notFound } from "next/navigation";

import { auth } from "@/auth";
import ProfileCompletenessCard from "@/components/ProfileCompletenessCard";
import ProfileDetailsCard from "@/components/ProfileDetailsCard";
import UserPostsSection from "@/components/UserPostsSection";
import { getPostsByUserId } from "@/services/community.services";
import { fetchProfileByUsername } from "@/services/profile.service";

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  const session = await auth();
  const currentUserId = Number(session?.user?.id ?? 0);
  const profile = await fetchProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const posts = await getPostsByUserId(profile.userId, currentUserId);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ProfileDetailsCard profile={profile} />
        <ProfileCompletenessCard profile={profile} />
      </div>

      <UserPostsSection
        posts={posts}
        currentUserId={currentUserId}
        title="Latest Posts"
        emptyMessage="This user has not shared any posts yet."
      />
    </div>
  );
}
