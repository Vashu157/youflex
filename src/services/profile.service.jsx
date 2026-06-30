"use server";

import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { asc, eq, ilike, or } from "drizzle-orm";
import { cache } from "react";

const profileSelect = {
  userId: users.id,
  username: users.username,
  fullName: users.fullName,
  email: users.email,
  bio: profiles.bio,
  headline: profiles.headline,
  domain: profiles.domain,
  leetcodeUsername: profiles.leetcodeUsername,
  codeforcesUsername: profiles.codeforcesUsername,
  githubUrl: profiles.githubUrl,
  linkedinUrl: profiles.linkedinUrl,
  replitUrl: profiles.replitUrl,
  websiteUrl: profiles.websiteUrl,
  avatarUrl: profiles.avatarUrl,
  joinedAt: users.createdAt,
  profileUpdatedAt: profiles.updatedAt,
};

export const fetchAllProfiles = cache(async () => {
  try {
    return await db
      .select(profileSelect)
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .orderBy(asc(users.fullName));
  } catch (error) {
    console.error("error in fetching profiles", error);
    return [];
  }
});

export const fetchProfileByUserId = cache(async (userId) => {
  try {
    const numericId = Number(userId);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return null;
    }

    const result = await db
      .select(profileSelect)
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(users.id, numericId));

    return result[0] ?? null;
  } catch (error) {
    console.error("error fetching profile by userId", error);
    return null;
  }
});

export const fetchProfileByUsername = cache(async (username) => {
  try {
    const normalizedUsername =
      typeof username === "string" ? username.trim().toLowerCase() : "";

    if (!normalizedUsername) {
      return null;
    }

    const result = await db
      .select(profileSelect)
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(users.username, normalizedUsername));

    return result[0] ?? null;
  } catch (error) {
    console.error("error fetching profile by username", error);
    return null;
  }
});

export const searchUsers = cache(async (query) => {
  try {
    const trimmedQuery = typeof query === "string" ? query.trim() : "";

    if (!trimmedQuery) {
      return [];
    }

    return await db
      .select({
        userId: users.id,
        username: users.username,
        fullName: users.fullName,
        domain: profiles.domain,
        avatarUrl: profiles.avatarUrl,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(
        or(
          ilike(users.username, `%${trimmedQuery}%`),
          ilike(users.fullName, `%${trimmedQuery}%`)
        )
      )
      .orderBy(asc(users.fullName))
      .limit(24);
  } catch (error) {
    console.error("error searching users", error);
    return [];
  }
});
