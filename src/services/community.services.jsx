"use server";

import { db } from "@/db";
import { discussions, postVotes, posts, profiles, users } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { and, asc, desc, eq, sql } from "drizzle-orm";

function getCurrentUserId(session) {
  const userId = Number(session?.user?.id);
  return Number.isInteger(userId) && userId > 0 ? userId : 0;
}

//=================================================================
export async function getPosts() {
  try {
    const currentUserId = getCurrentUserId(await auth());

    return await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        upvotes: posts.upvotes,
        downvotes: posts.downvotes,
        discussionCount: posts.discussionCount,
        createdAt: posts.createdAt,
        userId: users.id,
        username: users.username,
        fullName: users.fullName,
        userVote: postVotes.vote,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(
        postVotes,
        and(eq(postVotes.postId, posts.id), eq(postVotes.userId, currentUserId))
      )
      .orderBy(desc(posts.createdAt));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

//=================================================================
export async function addPost(title, content) {
  // 1. Check for missing or empty title
  if (!title?.trim()) {
    return {
      success: false,
      message: "Title cannot be empty",
    };
  }
  // 2. Enforce the 200 character limit from the schema
  if (title.trim().length > 200) {
    return {
      success: false,
      message: "Title must be 200 characters or less",
    };
  }
  // 3. Check for missing or empty content
  if (!content?.trim()) {
    return {
      success: false,
      message: "Post content cannot be empty",
    };
  }
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
  try {
    await db.insert(posts).values({
      userId: Number(session.user.id),
      title: title.trim(),
      content: content.trim(),
    });
    return {
      success: true,
      message: "Post created successfully",
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      message: "Failed to create post. Please try again.",
    };
  }
}

//=================================================================
export async function getPostById(postId) {
  try {
    const currentUserId = getCurrentUserId(await auth());

    const result = await db
      .select({
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

        // avatarUrl: profiles.avatarUrl,
        // domain: profiles.domain,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .leftJoin(
        postVotes,
        and(eq(postVotes.postId, posts.id), eq(postVotes.userId, currentUserId))
      )
      .where(eq(posts.id, postId));

    return result[0] ?? null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

//=================================================================
export async function createDiscussion({ postId, content, parentId = null }) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!content.trim()) {
    return {
      success: false,
      message: "Discussion cannot be empty",
    };
  }

  try {
    // If this is a reply, verify the parent belongs to the same post.
    if (parentId !== null) {
      const parent = await db.query.discussions.findFirst({
        where: (discussion, { and, eq }) =>
          and(eq(discussion.id, parentId), eq(discussion.postId, postId)),
      });
      
      if (!parent) {
        return {
          success: false,
          message: "Invalid parent discussion",
        };
      }
    }

    await db.insert(discussions).values({
      userId: Number(session.user.id),
      postId,
      parentId,
      content: content.trim(),
    });

    await db
      .update(posts)
      .set({
        discussionCount: sql`${posts.discussionCount} + 1`,
      })
      .where(eq(posts.id, postId));

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to create discussion",
    };
  }
}

//=================================================================
export async function getDiscussions(postId) {
  try {
    return await db
      .select({
        id: discussions.id,
        postId: discussions.postId,
        parentId: discussions.parentId,
        content: discussions.content,
        createdAt: discussions.createdAt,

        authorId: users.id,
        username: users.username,
        fullName: users.fullName,

        avatarUrl: profiles.avatarUrl,
      })
      .from(discussions)
      .innerJoin(users, eq(discussions.userId, users.id))
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(discussions.postId, postId))
      .orderBy(asc(discussions.createdAt));
  } catch (error) {
    console.error(error);
    return [];
  }
}

//=================================================================
export async function togglePostVote(postId, vote) {
  const currentUserId = getCurrentUserId(await auth());

  if (!currentUserId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!Number.isInteger(postId) || postId <= 0) {
    return {
      success: false,
      message: "Invalid post",
    };
  }

  if (vote !== 1 && vote !== -1) {
    return {
      success: false,
      message: "Invalid vote",
    };
  }

  try {
    const result = await db.execute(sql`
      WITH lock_pair AS (
        SELECT pg_advisory_xact_lock(${postId}, ${currentUserId})
      ),
      target_post AS (
        SELECT id
        FROM posts
        WHERE id = ${postId}
          AND EXISTS (SELECT 1 FROM lock_pair)
      ),
      existing_vote AS MATERIALIZED (
        SELECT vote
        FROM post_votes
        WHERE post_id = ${postId}
          AND user_id = ${currentUserId}
      ),
      removed_vote AS (
        DELETE FROM post_votes
        WHERE post_id = ${postId}
          AND user_id = ${currentUserId}
          AND EXISTS (
            SELECT 1
            FROM existing_vote
            WHERE vote = ${vote}
          )
        RETURNING vote
      ),
      written_vote AS (
        INSERT INTO post_votes (post_id, user_id, vote)
        SELECT ${postId}, ${currentUserId}, ${vote}
        WHERE EXISTS (SELECT 1 FROM target_post)
          AND NOT EXISTS (SELECT 1 FROM removed_vote)
        ON CONFLICT (post_id, user_id)
        DO UPDATE SET vote = EXCLUDED.vote
        WHERE post_votes.vote <> EXCLUDED.vote
        RETURNING vote
      ),
      vote_state AS (
        SELECT
          COALESCE((SELECT vote FROM existing_vote), 0) AS old_vote,
          CASE
            WHEN EXISTS (SELECT 1 FROM removed_vote) THEN 0
            WHEN EXISTS (SELECT 1 FROM written_vote) THEN ${vote}
            ELSE COALESCE((SELECT vote FROM existing_vote), 0)
          END AS new_vote
      ),
      updated_post AS (
        UPDATE posts
        SET
          upvotes = GREATEST(
            0,
            upvotes
              + CASE WHEN (SELECT new_vote FROM vote_state) = 1 THEN 1 ELSE 0 END
              - CASE WHEN (SELECT old_vote FROM vote_state) = 1 THEN 1 ELSE 0 END
          ),
          downvotes = GREATEST(
            0,
            downvotes
              + CASE WHEN (SELECT new_vote FROM vote_state) = -1 THEN 1 ELSE 0 END
              - CASE WHEN (SELECT old_vote FROM vote_state) = -1 THEN 1 ELSE 0 END
          )
        WHERE id = ${postId}
        RETURNING id, upvotes, downvotes
      )
      SELECT
        id,
        upvotes,
        downvotes,
        NULLIF((SELECT new_vote FROM vote_state), 0) AS "userVote"
      FROM updated_post
    `);

    const updatedPost = result.rows?.[0];

    if (!updatedPost) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    revalidatePath("/discuss");
    revalidatePath(`/discuss/${postId}`);

    return {
      success: true,
      upvotes: Number(updatedPost.upvotes ?? 0),
      downvotes: Number(updatedPost.downvotes ?? 0),
      userVote:
        updatedPost.userVote === null || updatedPost.userVote === undefined
          ? null
          : Number(updatedPost.userVote),
    };
  } catch (error) {
    console.error("Error toggling post vote:", error);

    return {
      success: false,
      message: "Unable to update vote",
    };
  }
}
// export function deletePosts(){

// }
