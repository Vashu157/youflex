import ProfileForm from "./ProfileForm";
import { fetchProfileByUserId } from "@/services/profile.service";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");
  const profile = await fetchProfileByUserId(session.user.id);
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>     
      <ProfileForm 
        initialData={profile}
      />
    </div>
  );
}