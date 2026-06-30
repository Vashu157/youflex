"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/auth";
import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { normalizeProfileLinks } from "@/lib/profile.utils";

const optionalStringField = (schema) =>
  z.preprocess(
    (value) => {
      if (value === null || value === undefined) {
        return undefined;
      }

      return typeof value === "string" ? value.trim() : value;
    },
    schema.optional().or(z.literal(""))
  );

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is too short").max(100),
  bio: optionalStringField(z.string().max(300)),
  headline: optionalStringField(z.string().max(120)),
  domain: optionalStringField(z.string().max(50)),
  leetcodeUsername: optionalStringField(z.string().max(100)),
  codeforcesUsername: optionalStringField(z.string().max(100)),
  githubUrl: optionalStringField(z.string().max(255)),
  linkedinUrl: optionalStringField(z.string().max(255)),
  replitUrl: optionalStringField(z.string().max(255)),
  websiteUrl: optionalStringField(z.string().max(255)),
  avatarUrl: optionalStringField(z.string().max(500)),
});

function getProfilePayload(formData) {
  if (!(formData instanceof FormData)) {
    return formData;
  }

  const getField = (name) => {
    const value = formData.get(name);
    return value === null ? undefined : value;
  };

  return {
    fullName: getField("fullName"),
    bio: getField("bio"),
    headline: getField("headline"),
    domain: getField("domain"),
    leetcodeUsername: getField("leetcodeUsername"),
    codeforcesUsername: getField("codeforcesUsername"),
    githubUrl: getField("githubUrl"),
    linkedinUrl: getField("linkedinUrl"),
    replitUrl: getField("replitUrl"),
    websiteUrl: getField("websiteUrl"),
    avatarUrl: getField("avatarUrl"),
  };
}

function valueOrNull(value) {
  return typeof value === "string" ? value.trim() || null : value ?? null;
}

export async function updateProfile(input) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const parsed = updateProfileSchema.safeParse(getProfilePayload(input));

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid input",
      };
    }

    const userId = Number(session.user.id);
    const normalizedData = normalizeProfileLinks(parsed.data);

    await db
      .update(users)
      .set({
        fullName: normalizedData.fullName.trim(),
      })
      .where(eq(users.id, userId));

    await db
      .update(profiles)
      .set({
        bio: valueOrNull(normalizedData.bio),
        headline: valueOrNull(normalizedData.headline),
        domain: valueOrNull(normalizedData.domain),
        leetcodeUsername: valueOrNull(normalizedData.leetcodeUsername),
        codeforcesUsername: valueOrNull(normalizedData.codeforcesUsername),
        githubUrl: valueOrNull(normalizedData.githubUrl),
        linkedinUrl: valueOrNull(normalizedData.linkedinUrl),
        replitUrl: valueOrNull(normalizedData.replitUrl),
        websiteUrl: valueOrNull(normalizedData.websiteUrl),
        avatarUrl: valueOrNull(normalizedData.avatarUrl),
      })
      .where(eq(profiles.userId, userId));

    revalidatePath("/profile");
    revalidatePath(`/profile/${session.user.username}`);
    revalidatePath("/dashboard");
    revalidatePath("/search/users");

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
