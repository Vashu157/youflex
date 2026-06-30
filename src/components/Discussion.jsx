"use client";

import { useState } from "react";
import DiscussionForm from "./DiscussionForm";

export default function Discussion({
  discussion,
  discussions,
  postId,
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);

  const replies = discussions.filter(
    (d) => d.parentId === discussion.id
  );

  return (
    <div className="ml-4 border-l-2 pl-4">
      <div className="rounded border p-4">
        <div className="font-semibold">
          {discussion.fullName}
        </div>

        <div className="text-sm text-gray-500">
          @{discussion.username}
        </div>

        <p className="mt-3">{discussion.content}</p>

        <button
          onClick={() => setShowReplyBox((x) => !x)}
          className="mt-3 text-sm text-blue-600"
        >
          Reply
        </button>

        {showReplyBox && (
          <DiscussionForm
            postId={postId}
            parentId={discussion.id}
          />
        )}
      </div>

      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <Discussion
              key={reply.id}
              discussion={reply}
              discussions={discussions}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
