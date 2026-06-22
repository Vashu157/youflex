// app/profile/page.jsx (Server Component)
import ProfileForm from "./ProfileForm";
// import prisma from '@/lib/prisma'; // Uncomment when ready for real database

export default async function ProfilePage() {
  const dummyProfile = {
    username: "Alex Developer",
    leetcode: "https://leetcode.com/alexdev",
    codeforces: "https://codeforces.com/profile/alexdev",
    linkedin: "https://linkedin.com/in/alexdev",
    github: "https://github.com/alexdev",
    replit: "https://replit.com/@alexdev"
  };

  async function saveProfile(formData) {
    "use server";

    const name = formData.get("name");
    const github = formData.get("github");

    console.log("Saving to database on the backend:", { name, github });

  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
      <ProfileForm 
        initialData={dummyProfile} 
        saveAction={saveProfile} 
      />
    </div>
  );
}