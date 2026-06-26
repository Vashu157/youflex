"use client";

import RichTextEditor from "@/components/post_editor";

export default function Makepost() {
  const handleCreatePost = async (postData) => {
    console.log("Post payload from share page:", postData);
  };

  return <RichTextEditor onPost={handleCreatePost} />;
}
