
'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  initialValue?: string;
  onEditorChange: (content: string) => void;
  apiKey?: string; // Optional: for production use
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, onEditorChange, apiKey }) => {
  const editorRef = React.useRef<any>(null);

  return (
    <Editor
      apiKey={apiKey || 'no-api-key'} // Replace 'no-api-key' with your actual API key in production
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={initialValue || ''}
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
        images_upload_url: undefined, // For simplicity, disable direct upload. Users can insert by URL.
        automatic_uploads: false,
      }}
      onEditorChange={(content, editor) => {
        onEditorChange(content);
      }}
    />
  );
};

export default RichTextEditor;
