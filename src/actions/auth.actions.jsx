"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, profiles } from "@/db/schema";
const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().trim().email(),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});
export async function registerUser(formData) {
  try {
    const rawData =
      formData instanceof FormData
        ? {
            fullName: formData.get("fullName"),
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
          }
        : formData;

    const parsed = registerSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid input",
      };
    }

    const { username, fullName, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();

    const existingEmailUser = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existingEmailUser) {
      return { success: false, message: "Email already in use" };
    }

    const existingUsernameUser = await db.query.users.findFirst({
      where: eq(users.username, normalizedUsername),
    });

    if (existingUsernameUser) {
      return { success: false, message: "Username already taken" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedUsers = await db
      .insert(users)
      .values({
        fullName: fullName,
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash: hashedPassword,
      })
      .returning({ id: users.id });

    const newUser = insertedUsers[0];

    await db.insert(profiles).values({
      userId: newUser.id,
    });

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message: "Something went wrong while registering user",
    };
  }
}
