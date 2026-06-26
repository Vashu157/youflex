"use client";
import Link from "next/link";

export default function ProfileCard({
  username,
  fullName,
  avatar,
  githubUrl,
  leetcodeUsername,
  codeforcesUsername,
  linkedinUrl,
  replitUrl,
}) {
  const socials = [
    { label: "GitHub", link: githubUrl},
    { label: "LeetCode", link: leetcodeUsername },
    { label: "Codeforces", link: codeforcesUsername },
    { label: "LinkedIn", link: linkedinUrl },
    { label: "Replit", link: replitUrl },
  ].filter((item) => item.link);
  const handleDivClick = ()=>{

  }
  return (
    <div onClick={handleDivClick} className="block">
      <div className="w-full max-w-sm rounded-2xl border border-orange-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
        
        {/* Top Section */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-orange-500 bg-orange-100 flex items-center justify-center">
            {avatar ? (
              <img
                src={avatar}
                alt={`${fullName}'s profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-orange-600">
                {fullName?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-orange-600">{name}</h2>
            <p className="text-sm text-gray-600">@{username}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-[1px] w-full bg-orange-100" />

        {/* Social Links */}
        <div className="flex flex-wrap gap-2">
          {socials.map((item) => (
            <a
              key={item.label}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-full border border-orange-500 px-3 py-1 text-sm font-medium text-orange-600 transition hover:bg-orange-500 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}