"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DiscussionForm from "./DiscussionForm";
import {
  deleteDiscussion,
  updateDiscussion,
} from "@/actions/community.actions";
import { isDiscussionDeleted } from "@/lib/community.utils";

function formatDiscussionDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function Discussion({
  discussion,
  discussions,
  postId,
  currentUserId = 0,
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(discussion.content);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const canManage = Number(currentUserId) === Number(discussion.authorId);
  const deleted = isDiscussionDeleted(discussion.content);

  const replies = discussions.filter((d) => d.parentId === discussion.id);

  function handleSave() {
    setError("");

    startTransition(async () => {
      const result = await updateDiscussion({
        discussionId: discussion.id,
        postId,
        content: draft,
      });

      if (!result?.success) {
        setError(result?.message ?? "Unable to update discussion");
        return;
      }

      setIsEditing(false);
      router.refresh();
    });
  }

  function handleDelete() {
    const confirmed = window.confirm("Delete this discussion?");

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await deleteDiscussion({
        discussionId: discussion.id,
        postId,
      });

      if (!result?.success) {
        setError(result?.message ?? "Unable to delete discussion");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="relative group">
      {/* Threading line for nested replies */}
      <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-card-border/50 group-hover:bg-primary/20 transition-colors -z-10" />
      
      <div className="rounded-xl glass-card p-5 mt-4 relative bg-card-bg/50 backdrop-blur-sm border-card-border shadow-sm transition-all hover:shadow-md hover:border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">
            {discussion.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-foreground text-sm truncate">{discussion.fullName}</div>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              @{discussion.username} <span className="w-1 h-1 rounded-full bg-muted-foreground/30" /> {formatDiscussionDate(discussion.createdAt)}
              {discussion.isEdited ? <span className="italic text-muted-foreground/80">(edited)</span> : ""}
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-4 space-y-3">
            <textarea
              rows={4}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="w-full rounded-lg border border-card-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
            />
            <div className="flex gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={handleSave}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover disabled:opacity-70 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setDraft(discussion.content);
                  setIsEditing(false);
                }}
                className="rounded-lg border border-card-border bg-card-bg px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`mt-2 text-sm leading-relaxed ${
              deleted ? "italic text-muted-foreground opacity-80" : "text-foreground"
            }`}
          >
            {discussion.content}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold">
          <button
            onClick={() => setShowReplyBox((value) => !value)}
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Reply
          </button>

          {canManage && !deleted ? (
            <div className="flex gap-4 items-center">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsEditing((value) => !value)}
                className="text-muted-foreground hover:text-orange-500 disabled:opacity-70 transition-colors flex items-center gap-1.5"
              >
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="text-muted-foreground hover:text-red-500 disabled:opacity-70 transition-colors flex items-center gap-1.5"
              >
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          ) : null}
        </div>

        {error ? <p className="mt-3 text-sm font-medium text-red-500">{error}</p> : null}

        {showReplyBox && (
          <div className="mt-4 pt-4 border-t border-card-border/50">
            <DiscussionForm
              postId={postId}
              parentId={discussion.id}
            />
          </div>
        )}
      </div>

      {replies.length > 0 && (
        <div className="pl-6 space-y-2">
          {replies.map((reply) => (
            <Discussion
              key={reply.id}
              discussion={reply}
              discussions={discussions}
              postId={postId}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
