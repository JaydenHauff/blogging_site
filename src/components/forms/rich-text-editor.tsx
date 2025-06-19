
'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Pilcrow, Heading1, Heading2, Heading3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
}

const MenuBar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border border-b-0 rounded-t-md bg-muted">
      <Button
        variant={editor.isActive('bold') ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('italic') ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('paragraph') ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().setParagraph().run()}
        disabled={!editor.can().chain().focus().setParagraph().run()}
        aria-label="Paragraph"
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      {/* Add more buttons for other StarterKit features like strike, code, blockquote, lists, etc. */}
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure extensions as needed
        // For example, to disable some default keybindings or features:
        // heading: { levels: [1, 2, 3] },
        //
      }),
    ],
    content: value || '',
    onUpdate: ({ editor: currentEditor }) => {
      onEditorChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none p-4 min-h-[250px] border rounded-b-md bg-background text-foreground',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
