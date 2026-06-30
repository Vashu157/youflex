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
  <div>
    {profiles.map((profile)=>(
        <ProfileCard
        key={profile.userId}
        fullName = {profile.fullName}
        username={profile.username}
        githubUrl={profile.githubUrl}
        leetcodeUsername={profile.leetcodeUsername}
        codeforcesUsername={profile.codeforcesUsername}
        linkedinUrl={profile.linkedinUrl}
        replitUrl={profile.replitUrl}
        avatar={profile.avatarUrl}
        />
    ))}
  </div>
  );
}
