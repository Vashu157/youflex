"use client";

import { useState } from "react";
import { createDiscussion } from "@/actions/community.actions";
import { useRouter } from "next/navigation";

export default function DiscussionForm({ postId, parentId = null }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) return;

    setError("");
    setLoading(true);

    const result = await createDiscussion({
      postId,
      parentId,
      content,
    });

    setLoading(false);

    if (result.success) {
      setContent("");
      router.refresh();
    } else {
      setError(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-3">
      <textarea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          parentId === null
            ? "Start a discussion..."
            : "Write a reply..."
        }
        className="w-full rounded-lg border p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {loading
          ? "Posting..."
          : parentId === null
          ? "Post Discussion"
          : "Reply"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
