
'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold, Italic, Strikethrough, Code, Pilcrow, Heading1, Heading2, Heading3,
  Quote, List, ListOrdered, Code2, Minus, Undo, Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const menuItems = [
    { action: () => editor.chain().focus().toggleBold().run(), icon: Bold, label: 'Bold', isActive: editor.isActive('bold') },
    { action: () => editor.chain().focus().toggleItalic().run(), icon: Italic, label: 'Italic', isActive: editor.isActive('italic') },
    { action: () => editor.chain().focus().toggleStrike().run(), icon: Strikethrough, label: 'Strikethrough', isActive: editor.isActive('strike') },
    { action: () => editor.chain().focus().toggleCode().run(), icon: Code, label: 'Inline Code', isActive: editor.isActive('code') },
    { type: 'divider' as const },
    { action: () => editor.chain().focus().setParagraph().run(), icon: Pilcrow, label: 'Paragraph', isActive: editor.isActive('paragraph') },
    { action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), icon: Heading1, label: 'Heading 1', isActive: editor.isActive('heading', { level: 1 }) },
    { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2, label: 'Heading 2', isActive: editor.isActive('heading', { level: 2 }) },
    { action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), icon: Heading3, label: 'Heading 3', isActive: editor.isActive('heading', { level: 3 }) },
    { type: 'divider' as const },
    { action: () => editor.chain().focus().toggleBlockquote().run(), icon: Quote, label: 'Blockquote', isActive: editor.isActive('blockquote') },
    { action: () => editor.chain().focus().toggleBulletList().run(), icon: List, label: 'Bullet List', isActive: editor.isActive('bulletList') },
    { action: () => editor.chain().focus().toggleOrderedList().run(), icon: ListOrdered, label: 'Ordered List', isActive: editor.isActive('orderedList') },
    { action: () => editor.chain().focus().toggleCodeBlock().run(), icon: Code2, label: 'Code Block', isActive: editor.isActive('codeBlock') },
    { action: () => editor.chain().focus().setHorizontalRule().run(), icon: Minus, label: 'Horizontal Rule' },
    { type: 'divider' as const },
    { action: () => editor.chain().focus().undo().run(), icon: Undo, label: 'Undo', disabled: !editor.can().undo() },
    { action: () => editor.chain().focus().redo().run(), icon: Redo, label: 'Redo', disabled: !editor.can().redo() },
  ];

  return (
    <div className="tiptap-toolbar">
      {menuItems.map((item, index) => (
        item.type === 'divider' ? (
          <div key={`divider-${index}`} className="h-6 w-px bg-border mx-1"></div>
        ) : (
          <Button
            key={item.label}
            variant={item.isActive ? 'secondary' : 'ghost'}
            size="sm"
            onClick={item.action}
            disabled={item.disabled || false} 
            aria-label={item.label}
            title={item.label}
            className="p-2"
          >
            <item.icon />
          </Button>
        )
      ))}
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange, placeholder = "Start writing..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: {
          languageClassPrefix: 'language-',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor: currentEditor }) => {
      onEditorChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        // Apply .tiptap for container styles (padding, border, etc.)
        // Apply .prose .max-w-none for Tailwind typography and theme-specific prose styles
        class: 'tiptap prose max-w-none prose-headings:text-primary prose-a:text-accent hover:prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-code:p-1 prose-code:rounded-sm prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-md',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (!editor.isDestroyed) {
        editor.commands.setContent(value || '', false);
      }
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      // Tiptap's StarterKit doesn't include the Placeholder extension directly by default.
      // The CSS :before selector on .ProseMirror p.is-editor-empty handles the placeholder.
      // This effect ensures the data-placeholder attribute is set for the CSS to pick up.
      const editorElement = editor.view.dom; // The .ProseMirror element
      editorElement.setAttribute('data-placeholder', placeholder);
    }
  }, [editor, placeholder]);


  return (
    // The outer div now only defines the border and rounded corners for the entire editor (toolbar + content)
    <div className="rounded-md border border-input">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
