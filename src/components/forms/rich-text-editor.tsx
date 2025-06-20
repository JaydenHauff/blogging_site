
'use client';

import React, { useEffect, useState } from 'react';
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
  const [isClient, setIsClient] = useState<boolean>(false);
  // Store the dynamically imported component constructor in state
  const [QuillModule, setQuillModule] = useState<any>(null);
  const [importError, setImportError] = useState<string | null>(null);


  useEffect(() => {
    setIsClient(true); // Indicates component has mounted on the client
  }, []);

  useEffect(() => {
    if (isClient && !QuillModule && !importError) {
      import('react-quill')
        .then(module => {
          // Set the Quill component constructor to state
          setQuillModule(() => module.default);
        })
        .catch(error => {
          console.error("Failed to load ReactQuill", error);
          setImportError("Text editor failed to load. Please try again later.");
        });
    }
  }, [isClient, QuillModule, importError]); // Dependencies for the effect

  // Sync external value changes to editorHtml
  useEffect(() => {
    if (isClient && value !== undefined && value !== editorHtml) {
      setEditorHtml(value);
    }
  }, [value, editorHtml, isClient]);

  const handleChange = (html: string) => {
    setEditorHtml(html);
    onEditorChange(html); // Propagate change to parent
  };

  if (!isClient || (!QuillModule && !importError)) {
    // Show loading skeleton if not on client yet, or if Quill is loading and no error
    return <div className="h-[300px] w-full rounded-md border border-input bg-muted animate-pulse" aria-label="Loading editor..."/>;
  }

  if (importError) {
    // Show error message if import failed
    return (
      <div className="h-[300px] w-full rounded-md border border-destructive bg-destructive/10 text-destructive p-4 flex items-center justify-center" role="alert">
        <p>{importError}</p>
      </div>
    );
  }

  // At this point, QuillModule is loaded, so we can use it
  const ReactQuillComponent = QuillModule;

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
