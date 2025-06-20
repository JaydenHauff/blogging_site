'use client';

import React, { useEffect, useState, useRef } from 'react';
// CSS for react-quill is imported globally in src/app/globals.css

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
  placeholder?: string;
}

// Define modules and formats outside the component to prevent re-creation on every render
const modulesConfig = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const formatsConfig = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'list', 'bullet', 'script', 'indent', 'direction', 'align',
  'color', 'background',
  'link', 'image', 'video'
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange, placeholder }) => {
  const [editorHtml, setEditorHtml] = useState<string>(value || '');
  const QuillComponentRef = useRef<any>(null); // Store the dynamically imported component
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true); // Mark as mounted
  }, []);

  useEffect(() => {
    // Only attempt to import Quill if mounted and not already loaded
    if (isMounted && !QuillComponentRef.current) {
      import('react-quill').then(module => {
        QuillComponentRef.current = module.default;
        // Force a re-render now that Quill is loaded
        // A simple state update will trigger this.
        setEditorHtml(currentHtml => currentHtml); 
      }).catch(error => console.error("Failed to load ReactQuill", error));
    }
  }, [isMounted]); // Dependency on isMounted ensures this runs after mount

  // Sync external value changes to editorHtml
  useEffect(() => {
    if (isMounted && value !== undefined && value !== editorHtml) {
      setEditorHtml(value);
    }
  }, [value, editorHtml, isMounted]);

  const handleChange = (html: string) => {
    setEditorHtml(html);
    onEditorChange(html); // Propagate change to parent
  };

  // If not mounted or Quill component hasn't been loaded yet, show a placeholder
  if (!isMounted || !QuillComponentRef.current) {
    return <div className="h-[300px] w-full rounded-md border border-input bg-muted animate-pulse" aria-label="Loading editor..."/>;
  }

  const ReactQuill = QuillComponentRef.current;

  return (
    <div className="bg-card rounded-md border border-input shadow-sm quill-editor-container-wrapper"> {/* Added a wrapper class if needed for specific styling scopes */}
      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={handleChange}
        modules={modulesConfig}
        formats={formatsConfig}
        placeholder={placeholder || "Start writing..."}
        className="quill-editor-container" // For specific styling needs of the editor itself
      />
    </div>
  );
};

export default RichTextEditor;