
'use client';

import React, { useState, useEffect, useRef } from 'react'; // Added useState, useEffect
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange }) => {
  const editorRef = useRef<any>(null);
  const apiKey = "apf4vetipf1mll3j1pksv3ennu1wfld2ehi4qv9e8zwztj6f";
  const [isMounted, setIsMounted] = useState(false); // State to track client-side mount

  useEffect(() => {
    setIsMounted(true); // Set to true after component mounts on client
  }, []);

  if (!isMounted) {
    // Render null or a placeholder on the server and during initial client hydration
    return <div style={{ minHeight: '500px', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', color: '#888' }}>Loading editor...</div>;
  }

  return (
    <Editor
      apiKey={apiKey}
      onInit={(evt, editor) => editorRef.current = editor}
      value={value || ''}
      disabled={false}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image link | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        skin: (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'oxide-dark' : 'oxide',
        content_css: (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'default',
        images_upload_url: undefined, 
        automatic_uploads: false,
      }}
      onEditorChange={(content, editor) => {
        onEditorChange(content);
      }}
    />
  );
};

export default RichTextEditor;
