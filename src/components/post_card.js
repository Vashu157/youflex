"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import RelativeTime from "@/components/relative_time";
import { togglePostVote } from "@/services/community.services";

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

export default function PostCard({ post, href = null }) {
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

  return (
    <article className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex items-center gap-3 px-5 pt-5">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-600 text-sm font-bold text-white uppercase"
        >
          {getInitials(post.fullName)}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-zinc-950 dark:text-zinc-50">
            {post.fullName}
          </h2>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
            @{post.username} -{" "}
            <RelativeTime
              value={createdAt}
              fallback={createdAtFallback}
              dateTime={createdAt}
            />
          </p>
        </div>

        <span
          aria-hidden="true"
          className="rounded-full p-2 text-zinc-500 dark:text-zinc-400"
        >
          <MoreIcon />
        </span>
      </header>

      {href ? (
        <Link
          href={href}
          className="block transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:bg-zinc-900/70 dark:focus-visible:ring-zinc-600"
        >
          <div className="px-5 pt-3 font-semibold text-zinc-950 dark:text-zinc-50">
            {post.title}
          </div>
          <div
            className="space-y-3 px-5 py-5 leading-7 text-zinc-700 dark:text-zinc-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Link>
      ) : (
        <>
          <div className="px-5 pt-3 font-semibold text-zinc-950 dark:text-zinc-50">
            {post.title}
          </div>
          <div
            className="space-y-3 px-5 py-5 leading-7 text-zinc-700 dark:text-zinc-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </>
      )}

      <footer className="flex items-center gap-2 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            aria-label={isUpvoted ? "Remove upvote" : "Upvote post"}
            aria-pressed={isUpvoted}
            disabled={isPending}
            onClick={() => handleVote(1)}
            className={`flex items-center gap-2 rounded-l-full px-3 py-2 text-sm font-medium transition ${
              isUpvoted
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
            } ${isPending ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <UpvoteIcon active={isUpvoted} />
            <span>{voteState.upvotes}</span>
          </button>

          <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-700" />

          <button
            type="button"
            aria-label={isDownvoted ? "Remove downvote" : "Downvote post"}
            aria-pressed={isDownvoted}
            disabled={isPending}
            onClick={() => handleVote(-1)}
            className={`flex items-center gap-2 rounded-r-full px-3 py-2 text-sm font-medium transition ${
              isDownvoted
                ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                : "text-zinc-600 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            } ${isPending ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <DownvoteIcon active={isDownvoted} />
            <span>{voteState.downvotes}</span>
          </button>
        </div>

        <Link
          href={commentHref}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
        >
          <CommentIcon />
          <span>{post.discussionCount} comments</span>
        </Link>
      </footer>

      {voteError ? (
        <p className="px-5 pb-4 text-sm text-red-600 dark:text-red-400">
          {voteError}
        </p>
      ) : null}
    </article>
  );
}
