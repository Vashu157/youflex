'use client'
import React from 'react'
import { useForm } from 'react-hook-form';

const ProfileForm = ({ initialData, saveData }) => {
    // I removed the unused 'onSubmit' function and 'useState' import to keep your code clean!
    const { register } = useForm({
        defaultValues: {
            username: initialData?.username || "",
            leetcode: initialData?.leetcode || "",
            codeforces: initialData?.codeforces || "",
            linkedin: initialData?.linkedin || "",
            github: initialData?.github || "",
            replit: initialData?.replit || "",
        }
    });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        
        <div className="w-[90%] max-w-[600px] bg-white rounded-xl shadow-lg p-8">
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {initialData ? "Edit Profile" : "Create Profile"}
            </h2>

            <form action={saveData} className="flex flex-col space-y-4">
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input 
                        {...register("username")} 
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LeetCode</label>
                    <input 
                        {...register("leetcode")} 
                        placeholder="Enter LeetCode profile"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Codeforces</label>
                    <input 
                        {...register("codeforces")} 
                        placeholder="Enter Codeforces profile"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input 
                        {...register("linkedin")} 
                        placeholder="Enter LinkedIn profile"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <input  
                        {...register("github")} 
                        placeholder="Enter GitHub profile"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Replit</label>
                    <input 
                        {...register("replit")} 
                        placeholder="Enter Replit profile"
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
  )
}

export default ProfileForm