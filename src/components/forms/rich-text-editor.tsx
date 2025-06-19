'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// Dynamically import ReactQuill to ensure it's only loaded on the client-side
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div style={{ minHeight: '250px', border: '1px solid hsl(var(--border))', borderRadius: '0.375rem', padding: '10px', color: 'hsl(var(--muted-foreground))' }}>Loading editor...</div>
});

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const modules = useMemo(() => ({
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
  }), []);

  const formats = useMemo(() => [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background', 'font', 'align', 'script', 'direction'
  ], []);

  if (!isMounted) {
    // This will be shown by dynamic import's loading prop if ssr:false,
    // but can be a fallback or if dynamic loading itself takes time.
    return <div style={{ minHeight: '250px', border: '1px solid hsl(var(--border))', borderRadius: '0.375rem', padding: '10px', color: 'hsl(var(--muted-foreground))' }}>Preparing editor...</div>;
  }

  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      onChange={onEditorChange}
      modules={modules}
      formats={formats}
      // Removed style and className props from ReactQuill component itself
    />
  );
};

export default RichTextEditor;
