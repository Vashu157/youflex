"use server"
import { redirect } from "next/navigation";
import { fetchAllProfiles } from "@/services/profile.service";
import { auth } from "@/auth";
import ProfileCard from "@/components/ProfileCard";
export default async function DasboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const profiles = await fetchAllProfiles();
  return( 
  <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Explore Developers</h1>
      <p className="text-muted-foreground mt-2">Discover and connect with amazing developers in the community.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {profiles.map((profile)=>(
          <ProfileCard
          key={profile.userId}
          fullName = {profile.fullName}
          username={profile.username}
          domain={profile.domain}
          githubUrl={profile.githubUrl}
          leetcodeUsername={profile.leetcodeUsername}
          codeforcesUsername={profile.codeforcesUsername}
          linkedinUrl={profile.linkedinUrl}
          replitUrl={profile.replitUrl}
          avatar={profile.avatarUrl}
          />
      ))}
    </div>
  </div>
  );
}
