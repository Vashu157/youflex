"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { updateProfile } from "@/services/profile.service";
const ProfileForm = ({ initialData }) => {
  // 1. Properly configure useForm with defaultValues and async values
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      bio: "",
      headline: "",
      githubUrl: "",
      linkedinUrl: "",
      leetcodeUsername: "",
      codeforcesUsername: "",
      replitUrl: "",
      websiteUrl: "",
    },
    values: initialData || {}, 
  });

  // 2. Create a local submit handler to intercept the form data
  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    
    if (!result.success) {
      alert("Error: " + result.message); // Or use a toast notification
      return;
    }
    
    alert("Profile updated successfully!"); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-[90%] max-w-[600px] bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {initialData ? "Edit Profile" : "Create Profile"}
        </h2>

        {/* 3. Use handleSubmit from react-hook-form instead of HTML action */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register("username")}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              {...register("fullName")}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Headline
            </label>
            <input
              {...register("headline")}
              placeholder="Describe yourself in short"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <input
              {...register("bio")}
              placeholder="Enlarge the bio (6in at min)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LeetCode
            </label>
            <input
              {...register("leetcodeUsername")}
              placeholder="Enter LeetCode profile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Codeforces
            </label>
            <input
              {...register("codeforcesUsername")}
              placeholder="Enter Codeforces profile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              {...register("linkedinUrl")}
              placeholder="Enter LinkedIn profile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub
            </label>
            <input
              {...register("githubUrl")}
              placeholder="Enter GitHub profile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Replit
            </label>
            <input
              {...register("replitUrl")}
              placeholder="Enter Replit profile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              {...register("websiteUrl")}
              placeholder="Enter personal website URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-6 shadow-sm"
          >
            {initialData ? "Update Profile" : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;