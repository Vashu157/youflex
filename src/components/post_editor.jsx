// components/RichTextEditor.jsx
"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill-new/dist/quill.snow.css'; 
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p> 
});

export default function RichTextEditor({ onPost }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const handlePost = async () => {
    const postData = {
      title: title.trim(),
      content,
    };

    if (onPost) {
      await onPost(postData);
      return;
    }

    console.log("Saving this post to database:", postData);
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mt-4">
      <h1>MAKE A FKIN POST</h1>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a title"
        className="rounded-md border border-zinc-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-600"
      />

      <div className="bg-white text-black">
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent} 
          placeholder="What do you want to talk about?"
          className="h-48 mb-12" 
          modules={modules}
        />
      </div>

      <button 
        onClick={handlePost}
        disabled={!title.trim() || !content.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md self-end"
      >
        Post
      </button>
    </div>
  );
}
