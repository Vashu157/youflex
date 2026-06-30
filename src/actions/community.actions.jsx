"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { discussions, postVotes, posts } from "@/db/schema";
import { DELETED_DISCUSSION_CONTENT } from "@/lib/community.utils";

function getCurrentUserId(session) {
  const userId = Number(session?.user?.id);
  return Number.isInteger(userId) && userId > 0 ? userId : 0;
}

function getCurrentUsername(session) {
  return typeof session?.user?.username === "string"
    ? session.user.username
    : "";
}

function revalidateProfileSurfaces(username) {
  revalidatePath("/discuss");
  revalidatePath("/profile");
  revalidatePath("/search/posts");

  if (username) {
    revalidatePath(`/profile/${username}`);
  }
}

export async function addPost(title, content) {
  const trimmedTitle = typeof title === "string" ? title.trim() : "";
  const trimmedContent = typeof content === "string" ? content.trim() : "";
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!trimmedTitle) {
    return {
      success: false,
      message: "Title cannot be empty",
    };
  }

  if (trimmedTitle.length > 200) {
    return {
      success: false,
      message: "Title must be 200 characters or less",
    };
  }

  if (!trimmedContent) {
    return {
      success: false,
      message: "Post content cannot be empty",
    };
  }

  try {
    await db.insert(posts).values({
      userId: Number(session.user.id),
      title: trimmedTitle,
      content: trimmedContent,
    });

    revalidateProfileSurfaces(getCurrentUsername(session));

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

export async function deletePost(postId) {
  const session = await auth();
  const currentUserId = getCurrentUserId(session);
  const numericPostId = Number(postId);

  if (!currentUserId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
    return {
      success: false,
      message: "Invalid post",
    };
  }

  try {
    const deletedPosts = await db
      .delete(posts)
      .where(and(eq(posts.id, numericPostId), eq(posts.userId, currentUserId)))
      .returning({ id: posts.id });

    if (!deletedPosts.length) {
      return {
        success: false,
        message: "Post not found or you do not have permission to delete it",
      };
    }

    revalidateProfileSurfaces(getCurrentUsername(session));
    revalidatePath(`/discuss/${numericPostId}`);

    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      message: "Failed to delete post",
    };
  }
}

export async function createDiscussion({ postId, content, parentId = null }) {
  const session = await auth();
  const currentUserId = getCurrentUserId(session);
  const numericPostId = Number(postId);
  const numericParentId =
    parentId === null || parentId === undefined ? null : Number(parentId);
  const trimmedContent = typeof content === "string" ? content.trim() : "";

  if (!currentUserId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
    return {
      success: false,
      message: "Invalid post",
    };
  }

  if (!trimmedContent) {
    return {
      success: false,
      message: "Discussion cannot be empty",
    };
  }

  if (numericParentId !== null && (!Number.isInteger(numericParentId) || numericParentId <= 0)) {
    return {
      success: false,
      message: "Invalid parent discussion",
    };
  }

  try {
    if (numericParentId !== null) {
      const parent = await db.query.discussions.findFirst({
        where: (discussion, { and: andOperator, eq: eqOperator }) =>
          andOperator(
            eqOperator(discussion.id, numericParentId),
            eqOperator(discussion.postId, numericPostId)
          ),
      });

      if (!parent) {
        return {
          success: false,
          message: "Invalid parent discussion",
        };
      }
    }

    await db.insert(discussions).values({
      userId: currentUserId,
      postId: numericPostId,
      parentId: numericParentId,
      content: trimmedContent,
    });

    await db
      .update(posts)
      .set({
        discussionCount: sql`${posts.discussionCount} + 1`,
      })
      .where(eq(posts.id, numericPostId));

    revalidatePath(`/discuss/${numericPostId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating discussion:", error);
    return {
      success: false,
      message: "Unable to create discussion",
    };
  }
}

export async function updateDiscussion({ discussionId, postId, content }) {
  const session = await auth();
  const currentUserId = getCurrentUserId(session);
  const numericDiscussionId = Number(discussionId);
  const numericPostId = Number(postId);
  const trimmedContent = typeof content === "string" ? content.trim() : "";

  if (!currentUserId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!Number.isInteger(numericDiscussionId) || numericDiscussionId <= 0) {
    return {
      success: false,
      message: "Invalid discussion",
    };
  }

  if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
    return {
      success: false,
      message: "Invalid post",
    };
  }

  if (!trimmedContent) {
    return {
      success: false,
      message: "Discussion cannot be empty",
    };
  }

  try {
    const updatedDiscussion = await db
      .update(discussions)
      .set({
        content: trimmedContent,
        updatedAt: new Date(),
        isEdited: true,
      })
      .where(
        and(
          eq(discussions.id, numericDiscussionId),
          eq(discussions.postId, numericPostId),
          eq(discussions.userId, currentUserId)
        )
      )
      .returning({ id: discussions.id });

    if (!updatedDiscussion.length) {
      return {
        success: false,
        message: "Discussion not found or you do not have permission to edit it",
      };
    }

    revalidatePath(`/discuss/${numericPostId}`);

    return {
      success: true,
      message: "Discussion updated successfully",
    };
  } catch (error) {
    console.error("Error updating discussion:", error);
    return {
      success: false,
      message: "Unable to update discussion",
    };
  }
}

export async function deleteDiscussion({ discussionId, postId }) {
  const session = await auth();
  const currentUserId = getCurrentUserId(session);
  const numericDiscussionId = Number(discussionId);
  const numericPostId = Number(postId);

  if (!currentUserId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!Number.isInteger(numericDiscussionId) || numericDiscussionId <= 0) {
    return {
      success: false,
      message: "Invalid discussion",
    };
  }

  if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
    return {
      success: false,
      message: "Invalid post",
    };
  }

  try {
    const deletedDiscussion = await db
      .update(discussions)
      .set({
        content: DELETED_DISCUSSION_CONTENT,
        updatedAt: new Date(),
        isEdited: false,
      })
      .where(
        and(
          eq(discussions.id, numericDiscussionId),
          eq(discussions.postId, numericPostId),
          eq(discussions.userId, currentUserId)
        )
      )
      .returning({ id: discussions.id });

    if (!deletedDiscussion.length) {
      return {
        success: false,
        message: "Discussion not found or you do not have permission to delete it",
      };
    }

    revalidatePath(`/discuss/${numericPostId}`);

    return {
      success: true,
      message: "Discussion deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting discussion:", error);
    return {
      success: false,
      message: "Unable to delete discussion",
    };
  }
}

export async function togglePostVote(postId, vote) {
  const session = await auth();
  const currentUserId = getCurrentUserId(session);
  const numericPostId = Number(postId);

  if (!currentUserId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
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
        SELECT pg_advisory_xact_lock(${numericPostId}, ${currentUserId})
      ),
      target_post AS (
        SELECT id
        FROM posts
        WHERE id = ${numericPostId}
          AND EXISTS (SELECT 1 FROM lock_pair)
      ),
      existing_vote AS MATERIALIZED (
        SELECT vote
        FROM post_votes
        WHERE post_id = ${numericPostId}
          AND user_id = ${currentUserId}
      ),
      removed_vote AS (
        DELETE FROM post_votes
        WHERE post_id = ${numericPostId}
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
        SELECT ${numericPostId}, ${currentUserId}, ${vote}
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
        WHERE id = ${numericPostId}
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
    revalidatePath(`/discuss/${numericPostId}`);

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
