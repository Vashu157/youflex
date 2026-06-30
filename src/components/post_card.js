"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import RelativeTime from "@/components/relative_time";
import { deletePost, togglePostVote } from "@/actions/community.actions";

// Helper function to extract initials from a full name
function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getDateValue(value) {
  return value instanceof Date ? value.toISOString() : value;
}

function formatCreatedAtFallback(value) {
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

function UpvoteIcon({ active }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
    </svg>
  );
}

function DownvoteIcon({ active }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75h6.75m-6.75 3h4.5M21 12a8.25 8.25 0 0 1-9.23 8.19 8.2 8.2 0 0 1-3.52-1.36L3 20.25l1.42-4.74A8.25 8.25 0 1 1 21 12Z" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export default function PostCard({
  post,
  href = null,
  showDeleteAction = false,
}) {
  const router = useRouter();
  const createdAt = getDateValue(post.createdAt);
  const createdAtFallback = formatCreatedAtFallback(createdAt);
  const initialUserVote =
    post.userVote === null || post.userVote === undefined
      ? null
      : Number(post.userVote);
  const [voteState, setVoteState] = useState({
    upvotes: Number(post.upvotes ?? 0),
    downvotes: Number(post.downvotes ?? 0),
    userVote: initialUserVote,
  });
  const [voteError, setVoteError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isPending, startTransition] = useTransition();
  const commentHref = href ? href : "#discussion";
  const isUpvoted = voteState.userVote === 1;
  const isDownvoted = voteState.userVote === -1;

  function handleVote(nextVote) {
    setVoteError("");

    startTransition(async () => {
      const result = await togglePostVote(post.id, nextVote);

      if (!result?.success) {
        setVoteError(result?.message ?? "Unable to update vote");
        return;
      }

      setVoteState({
        upvotes: Number(result.upvotes ?? 0),
        downvotes: Number(result.downvotes ?? 0),
        userVote: result.userVote ?? null,
      });
    });
  }

  function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) {
      return;
    }

    setDeleteError("");

    startTransition(async () => {
      const result = await deletePost(post.id);

      if (!result?.success) {
        setDeleteError(result?.message ?? "Unable to delete post");
        return;
      }

      router.refresh();
    });
  }

  return (
    <article className="w-full max-w-2xl overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:shadow-lg">
      <header className="flex items-center gap-3 px-6 pt-6">
        <div
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-orange-400 text-sm font-bold text-white uppercase shadow-sm"
        >
          {getInitials(post.fullName)}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-foreground text-lg">
            {post.fullName}
          </h2>
          <p className="truncate text-sm text-muted-foreground font-medium">
            @{post.username} •{" "}
            <RelativeTime
              value={createdAt}
              fallback={createdAtFallback}
              dateTime={createdAt}
            />
          </p>
        </div>

        {showDeleteAction ? (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300 dark:hover:bg-red-900/40"
          >
            Delete
          </button>
        ) : (
          <span
            aria-hidden="true"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
          >
            <MoreIcon />
          </span>
        )}
      </header>

      {href ? (
        <Link
          href={href}
          className="block transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:bg-muted/50"
        >
          <div className="px-6 pt-4 font-bold text-foreground text-xl">
            {post.title}
          </div>
          <div
            className="space-y-3 px-6 py-4 leading-relaxed text-muted-foreground prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Link>
      ) : (
        <>
          <div className="px-6 pt-4 font-bold text-foreground text-xl">
            {post.title}
          </div>
          <div
            className="space-y-3 px-6 py-4 leading-relaxed text-muted-foreground prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </>
      )}

      <footer className="flex items-center gap-3 border-t border-card-border px-6 py-4 bg-muted/20">
        <div className="flex items-center rounded-full bg-card-bg border border-card-border shadow-sm overflow-hidden">
          <button
            type="button"
            aria-label={isUpvoted ? "Remove upvote" : "Upvote post"}
            aria-pressed={isUpvoted}
            disabled={isPending}
            onClick={() => handleVote(1)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
              isUpvoted
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                : "text-muted-foreground hover:bg-muted hover:text-emerald-600 dark:hover:text-emerald-400"
            } ${isPending ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <UpvoteIcon active={isUpvoted} />
            <span>{voteState.upvotes}</span>
          </button>

          <div className="w-[1px] h-5 bg-card-border" />

          <button
            type="button"
            aria-label={isDownvoted ? "Remove downvote" : "Downvote post"}
            aria-pressed={isDownvoted}
            disabled={isPending}
            onClick={() => handleVote(-1)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
              isDownvoted
                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                : "text-muted-foreground hover:bg-muted hover:text-red-600 dark:hover:text-red-400"
            } ${isPending ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <DownvoteIcon active={isDownvoted} />
            <span>{voteState.downvotes}</span>
          </button>
        </div>

        <Link
          href={commentHref}
          className="flex items-center gap-2 rounded-full border border-card-border bg-card-bg px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-accent"
        >
          <CommentIcon />
          <span>{post.discussionCount} comments</span>
        </Link>
      </footer>

      {voteError || deleteError ? (
        <p className="px-6 pb-5 text-sm font-medium text-red-600 dark:text-red-400">
          {voteError || deleteError}
        </p>
      ) : null}
    </article>
  );
}
