"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/post_editor";
import { addPost } from "@/actions/community.actions";

export default function Makepost() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreatePost = async (postData) => {
    setErrorMessage("");

    const result = await addPost(postData.title, postData.content);

    if (!result?.success) {
      setErrorMessage(result?.message ?? "Unable to create post");
      return;
    }

    router.push("/discuss?posted=1");
  };

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
      <RichTextEditor onPost={handleCreatePost} />
    </div>
  );
}
