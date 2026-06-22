// components/RichTextEditor.jsx
"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill-new/dist/quill.snow.css'; 
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p> 
});

export default function RichTextEditor() {
  const [content, setContent] = useState("");

  const handlePost = async () => {
    console.log("Saving this HTML to database:", content);
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
      {/* 3. The Editor */}
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
        className="bg-blue-600 text-white px-4 py-2 rounded-md self-end"
      >
        Post
      </button>

    </div>
  );
}