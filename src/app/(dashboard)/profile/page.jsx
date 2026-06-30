import ProfileForm from "./ProfileForm";
import { fetchProfileByUserId } from "@/services/profile.service";
import { getPostsByUserId } from "@/services/community.services";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileCompletenessCard from "@/components/ProfileCompletenessCard";
import ProfileDetailsCard from "@/components/ProfileDetailsCard";
import UserPostsSection from "@/components/UserPostsSection";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const currentUserId = Number(session.user.id);
  const [profile, posts] = await Promise.all([
    fetchProfileByUserId(currentUserId),
    getPostsByUserId(currentUserId, currentUserId),
  ]);
  const profileData = profile ?? {
    fullName: session.user.name ?? "",
    username: session.user.username ?? "",
    email: session.user.email ?? "",
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ProfileDetailsCard profile={profileData} />
        <ProfileCompletenessCard profile={profileData} />
      </div>

      <section className="rounded-[2rem] glass-card p-8">
        <h1 className="mb-8 text-2xl font-extrabold text-foreground tracking-tight">
          Edit Profile
        </h1>
        <ProfileForm initialData={profileData} />
      </section>

      <UserPostsSection
        posts={posts}
        currentUserId={currentUserId}
        title="Latest Posts"
        emptyMessage="You have not shared any posts yet."
      />
    </div>
  );
}
