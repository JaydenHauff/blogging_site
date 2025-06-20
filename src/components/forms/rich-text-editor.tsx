
'use client';

import React, { useEffect, useState } from 'react';
import type QuillType from 'quill';

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
  placeholder?: string;
}

// Dynamically import ReactQuill to ensure it's only loaded on the client-side
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => null;
if (typeof window === 'object') {
  require('react-quill/dist/quill.snow.css'); // Import Quill styles
}


const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'align': [] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    // [{ 'font': [] }], // Font selection can be large, omitting for now

    ['link', 'image', 'video'],                       // link, image, video

    ['clean']                                         // remove formatting button
  ],
  // imageResize: { // Optional: if you want image resizing
  //   parchment: QuillType.import('parchment'),
  //   modules: ['Resize', 'DisplaySize']
  // }
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'list', 'bullet', 'script', 'indent', 'direction', 'align',
  'color', 'background', 
  'link', 'image', 'video'
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange, placeholder }) => {
  const [editorHtml, setEditorHtml] = useState(value || '');

  // When the external value changes, update the editor's content
  useEffect(() => {
    if (value !== editorHtml) {
      setEditorHtml(value || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // Only re-run if 'value' prop changes


  const handleChange = (html: string) => {
    setEditorHtml(html);
    onEditorChange(html);
  };

  if (typeof window !== 'object') {
    // Return a placeholder or null during SSR or if window is not available
    return <div className="h-[300px] w-full rounded-md border border-input bg-muted animate-pulse" />;
  }

  return (
    <div className="bg-card rounded-md border border-input shadow-sm">
      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Start writing..."}
        className="quill-editor-container" // Custom class for potential global styling
      />
    </div>
  );
};

export default RichTextEditor;
