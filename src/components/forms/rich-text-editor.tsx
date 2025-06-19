
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Dynamically import ReactQuill to ensure it's only loaded on the client-side
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['link', 'image', 'video'],                       // image and video for URL based insertion

      ['clean']                                         // remove formatting button
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background', 'font', 'align', 'script', 'direction'
  ];

  if (!isMounted || !ReactQuill) {
    // Render a placeholder on the server and during initial client hydration
    return <div style={{ minHeight: '300px', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', color: '#888' }}>Loading editor...</div>;
  }

  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      onChange={onEditorChange}
      modules={modules}
      formats={formats}
      style={{ minHeight: '300px', backgroundColor: 'var(--card)' }} // Ensure editor area is visible
      className="bg-card text-card-foreground" // Added classes for better theme integration
    />
  );
};

export default RichTextEditor;
