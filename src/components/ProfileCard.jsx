"use client";
/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfileCard({
  username,
  fullName,
  avatar,
  domain,
  githubUrl,
  leetcodeUsername,
  codeforcesUsername,
  linkedinUrl,
  replitUrl,
}) {
  const router = useRouter();
  const socials = [
    { label: "GitHub", link: githubUrl },
    { label: "LeetCode", link: leetcodeUsername },
    { label: "Codeforces", link: codeforcesUsername },
    { label: "LinkedIn", link: linkedinUrl },
    { label: "Replit", link: replitUrl },
  ].filter((item) => item.link);

  return (
    <div
      onClick={() => router.push(`/profile/${username}`)}
      className="block cursor-pointer group"
    >
      <div className="w-full max-w-sm rounded-2xl glass-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 relative overflow-hidden">
        {/* Subtle gradient background effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="relative flex items-start gap-5">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:border-primary shadow-sm">
            {avatar ? (
              <Image
                src={avatar}
                alt={`${fullName}'s profile`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-primary">
                {fullName?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
              {fullName}
            </h2>
            <p className="text-sm font-medium text-muted-foreground truncate">
              @{username}
            </p>
            {domain ? (
              <p className="mt-1.5 inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground ring-1 ring-inset ring-card-border">
                {domain}
              </p>
            ) : null}
          </div>
        </div>

        <div className="my-5 h-px w-full bg-card-border/60 transition-colors duration-300 group-hover:bg-primary/20" />

        <div className="relative flex flex-wrap gap-2">
          {socials.length ? (
            socials.map((item) => (
              <a
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="rounded-full border border-card-border bg-card-bg px-3 py-1 text-xs font-semibold text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md"
              >
                {item.label}
              </a>
            ))
          ) : (
            <p className="text-xs font-medium text-muted-foreground italic">View public profile</p>
          )}
        </div>
      </div>
    </div>
  );
}
