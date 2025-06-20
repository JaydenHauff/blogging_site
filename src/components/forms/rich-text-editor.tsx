
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
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
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    ['clean']
  ],
};

const formatsConfig = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'list', 'bullet', 'indent',
  'link', 'image', 'video', 'align',
  'color', 'background', 'script'
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange, placeholder }) => {
  const [editorHtml, setEditorHtml] = useState<string>(value || '');
  const [isClient, setIsClient] = useState<boolean>(false);
  
  const QuillComponentRef = useRef<any>(null);
  const [quillLoaded, setQuillLoaded] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true); // Component has mounted on the client
  }, []);

  useEffect(() => {
    if (isClient && !QuillComponentRef.current && !quillLoaded && !importError) {
      import('react-quill')
        .then(module => {
          QuillComponentRef.current = module.default;
          setQuillLoaded(true); // Signal that Quill is loaded
        })
        .catch(error => {
          console.error("Failed to load ReactQuill", error);
          setImportError("Text editor failed to load. Please try again later.");
        });
    }
  }, [isClient, quillLoaded, importError]); // Dependencies for the effect

  // Sync external value changes to editorHtml
  useEffect(() => {
    if (value !== undefined && value !== editorHtml) {
      setEditorHtml(value);
    }
  }, [value]);

  const handleChange = useCallback((html: string) => {
    setEditorHtml(html);
    onEditorChange(html); // Propagate change to parent
  }, [onEditorChange]);


  if (!isClient || (!quillLoaded && !importError)) {
    return <Skeleton className="h-[372px] w-full rounded-md" aria-label="Loading editor..." />;
  }

  if (importError) {
    return (
      <div className="h-[372px] w-full rounded-md border border-destructive bg-destructive/10 text-destructive p-4 flex items-center justify-center" role="alert">
        <p>{importError}</p>
      </div>
    );
  }

  const ReactQuillComponent = QuillComponentRef.current;

  if (!ReactQuillComponent) {
     // Should be caught by the loading skeleton, but as a fallback
    return <Skeleton className="h-[372px] w-full rounded-md" aria-label="Initializing editor..." />;
  }

  return (
    <div className="bg-card rounded-md border border-input shadow-sm quill-editor-container-wrapper">
      <ReactQuillComponent
        theme="snow"
        value={editorHtml}
        onChange={handleChange}
        modules={modulesConfig}
        formats={formatsConfig}
        placeholder={placeholder || "Start writing..."}
        className="quill-editor-container"
      />
    </div>
  );
};

export default RichTextEditor;
