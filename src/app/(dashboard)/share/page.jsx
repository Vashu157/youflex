"use client";

import RichTextEditor from "@/components/post_editor";
import { addPost } from "@/services/community.services";
export default function Makepost() {
  const handleCreatePost = async (postData) => {
        await addPost(postData.title,postData.content);
  };

  return <RichTextEditor onPost={handleCreatePost} />;
}
