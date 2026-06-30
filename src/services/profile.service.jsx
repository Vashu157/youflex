"use server";
import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is too short").max(100),
  bio: z.string().trim().max(300).optional().or(z.literal("")),
  headline: z.string().trim().max(120).optional().or(z.literal("")),
  //domain: z.string().trim().max(50).optional().or(z.literal("")),
  leetcodeUsername: z.string().trim().max(50).optional().or(z.literal("")),
  codeforcesUsername: z.string().trim().max(50).optional().or(z.literal("")),
  githubUrl: z.string().trim().url("Invalid GitHub URL").optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  replitUrl: z.string().trim().url("Invalid Replit URL").optional().or(z.literal("")),
  websiteUrl: z.string().trim().url("Invalid website URL").optional().or(z.literal("")),
  //avatarUrl: z.string().trim().url("Invalid avatar URL").optional().or(z.literal("")),
});
export async function fetchAllProfiles() {
  try {
    const allProfiles = await db
      .select({
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
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id));
      console.log(allProfiles)
      return allProfiles
  } catch (error) {
     console.error("error in fetching profiles",error);
     return null;
  }
}
export async function fetchProfileByUserId(userId) {
  try {
    const numericId = Number(userId);
    const result = await db
      .select({
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
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(users.id, userId));

    return result[0] ?? null;
  } catch (error) {
    console.error("error fetching profile by userId", error);
    return null;
  }
}
export async function updateProfile(formData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const rawData =
      formData instanceof FormData
        ? {
            fullName: formData.get("fullName"),
            bio: formData.get("bio"),
            headline: formData.get("headline"),
            //domain: formData.get("domain"),
            leetcodeUsername: formData.get("leetcodeUsername"),
            codeforcesUsername: formData.get("codeforcesUsername"),
            githubUrl: formData.get("githubUrl"),
            linkedinUrl: formData.get("linkedinUrl"),
            replitUrl: formData.get("replitUrl"),
            websiteUrl: formData.get("websiteUrl"),
            //avatarUrl: formData.get("avatarUrl"),
          }
        : formData;

    const parsed = updateProfileSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid input",
      };
    }

    const data = parsed.data;
    const userId = Number(session.user.id);

    await db
      .update(users)
      .set({
        fullName: data.fullName,
      })
      .where(eq(users.id, userId));

    await db
      .update(profiles)
      .set({
        bio: data.bio || null,
        headline: data.headline || null,
        domain: data.domain || null,
        leetcodeUsername: data.leetcodeUsername || null,
        codeforcesUsername: data.codeforcesUsername || null,
        githubUrl: data.githubUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        replitUrl: data.replitUrl || null,
        websiteUrl: data.websiteUrl || null,
        avatarUrl: data.avatarUrl || null,
      })
      .where(eq(profiles.userId, userId));
      console.log("updated profile");
      revalidatePath("/profile");
    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("update profile error:", error);
    return {
      success: false,
      message: "Failed to update profile",
    };
  }
}