"use server";

import { db } from "@/db";
import { discussions, postVotes, posts, profiles, users } from "@/db/schema";
import { auth } from "@/auth";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { cache } from "react";

function getCurrentUserId(session) {
  const userId = Number(session?.user?.id);
  return Number.isInteger(userId) && userId > 0 ? userId : 0;
}

async function resolveCurrentUserId(currentUserId) {
  if (Number.isInteger(currentUserId) && currentUserId > 0) {
    return currentUserId;
  }

  return getCurrentUserId(await auth());
}

function buildPostSelect() {
  return {
    id: posts.id,
    title: posts.title,
    content: posts.content,
    upvotes: posts.upvotes,
    downvotes: posts.downvotes,
    discussionCount: posts.discussionCount,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    userId: users.id,
    username: users.username,
    fullName: users.fullName,
    userVote: postVotes.vote,
  };
}

export const getPosts = cache(async (currentUserId, limit = 20, offset = 0) => {
  try {
    const resolvedUserId = await resolveCurrentUserId(currentUserId);

    return await db
      .select(buildPostSelect())
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(
        postVotes,
        and(eq(postVotes.postId, posts.id), eq(postVotes.userId, resolvedUserId))
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
});

export const getPostById = cache(async (postId, currentUserId) => {
  try {
    const resolvedUserId = await resolveCurrentUserId(currentUserId);
    const numericPostId = Number(postId);

    if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
      return null;
    }

    const result = await db
      .select(buildPostSelect())
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(
        postVotes,
        and(eq(postVotes.postId, posts.id), eq(postVotes.userId, resolvedUserId))
      )
      .where(eq(posts.id, numericPostId));

    return result[0] ?? null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
});

export const getPostsByUserId = cache(async (userId, currentUserId, limit = 6) => {
  try {
    const numericUserId = Number(userId);
    const resolvedUserId = await resolveCurrentUserId(currentUserId);

    if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
      return [];
    }

    return await db
      .select(buildPostSelect())
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(
        postVotes,
        and(eq(postVotes.postId, posts.id), eq(postVotes.userId, resolvedUserId))
      )
      .where(eq(posts.userId, numericUserId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    return [];
  }
});

export const getDiscussions = cache(async (postId) => {
  try {
    const numericPostId = Number(postId);

    if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
      return [];
    }

    return await db
      .select({
        id: discussions.id,
        postId: discussions.postId,
        parentId: discussions.parentId,
        content: discussions.content,
        isEdited: discussions.isEdited,
        createdAt: discussions.createdAt,
        updatedAt: discussions.updatedAt,

        authorId: users.id,
        username: users.username,
        fullName: users.fullName,

        avatarUrl: profiles.avatarUrl,
      })
      .from(discussions)
      .innerJoin(users, eq(discussions.userId, users.id))
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(discussions.postId, numericPostId))
      .orderBy(asc(discussions.createdAt));
  } catch (error) {
    console.error(error);
    return [];
  }
});

export const searchPosts = cache(async (query, currentUserId, limit = 24) => {
  try {
    const trimmedQuery = typeof query === "string" ? query.trim() : "";
    const resolvedUserId = await resolveCurrentUserId(currentUserId);

    if (!trimmedQuery) {
      return [];
    }

    return await db
      .select(buildPostSelect())
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(
        postVotes,
        and(eq(postVotes.postId, posts.id), eq(postVotes.userId, resolvedUserId))
      )
      .where(
        or(
          ilike(posts.title, `%${trimmedQuery}%`),
          ilike(posts.content, `%${trimmedQuery}%`)
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
});
