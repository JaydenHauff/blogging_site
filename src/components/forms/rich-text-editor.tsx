
'use client';

import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';

import {
  Bold, Italic, Strikethrough, Code, Pilcrow, Heading1, Heading2, Heading3,
  Quote, List, ListOrdered, Code2, Minus, Undo, Redo, Underline as UnderlineIcon,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Palette,
  Baseline, Eraser, Superscript as SuperscriptIcon, Subscript as SubscriptIcon, Highlighter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const commonColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#e60000' },
    { name: 'Blue', value: '#0073e6' },
    { name: 'Green', value: '#008a00' },
  ];

  const commonHighlights = [
    { name: 'Yellow', value: '#FFF3A3' }, // Softer yellow
    { name: 'Light Blue', value: '#ADD8E6' },
    { name: 'Light Green', value: '#90EE90' },
    { name: 'None', value: ''} // To remove highlight
  ];

  const menuItems = [
    { action: () => editor.chain().focus().toggleBold().run(), icon: Bold, label: 'Bold', isActive: editor.isActive('bold') },
    { action: () => editor.chain().focus().toggleItalic().run(), icon: Italic, label: 'Italic', isActive: editor.isActive('italic') },
    { action: () => editor.chain().focus().toggleUnderline().run(), icon: UnderlineIcon, label: 'Underline', isActive: editor.isActive('underline') },
    { action: () => editor.chain().focus().toggleStrike().run(), icon: Strikethrough, label: 'Strikethrough', isActive: editor.isActive('strike') },
    { action: () => editor.chain().focus().toggleCode().run(), icon: Code, label: 'Inline Code', isActive: editor.isActive('code') },
    { action: () => editor.chain().focus().toggleSubscript().run(), icon: SubscriptIcon, label: 'Subscript', isActive: editor.isActive('subscript')},
    { action: () => editor.chain().focus().toggleSuperscript().run(), icon: SuperscriptIcon, label: 'Superscript', isActive: editor.isActive('superscript')},
    { type: 'divider' as const },
    { action: () => editor.chain().focus().setParagraph().run(), icon: Pilcrow, label: 'Paragraph', isActive: editor.isActive('paragraph') },
    { action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), icon: Heading1, label: 'Heading 1', isActive: editor.isActive('heading', { level: 1 }) },
    { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2, label: 'Heading 2', isActive: editor.isActive('heading', { level: 2 }) },
    { action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), icon: Heading3, label: 'Heading 3', isActive: editor.isActive('heading', { level: 3 }) },
    { type: 'divider' as const },
    { action: () => editor.chain().focus().setTextAlign('left').run(), icon: AlignLeft, label: 'Align Left', isActive: editor.isActive({ textAlign: 'left' }) },
    { action: () => editor.chain().focus().setTextAlign('center').run(), icon: AlignCenter, label: 'Align Center', isActive: editor.isActive({ textAlign: 'center' }) },
    { action: () => editor.chain().focus().setTextAlign('right').run(), icon: AlignRight, label: 'Align Right', isActive: editor.isActive({ textAlign: 'right' }) },
    { action: () => editor.chain().focus().setTextAlign('justify').run(), icon: AlignJustify, label: 'Align Justify', isActive: editor.isActive({ textAlign: 'justify' }) },
    { type: 'divider' as const },
    { action: () => editor.chain().focus().toggleBlockquote().run(), icon: Quote, label: 'Blockquote', isActive: editor.isActive('blockquote') },
    { action: () => editor.chain().focus().toggleBulletList().run(), icon: List, label: 'Bullet List', isActive: editor.isActive('bulletList') },
    { action: () => editor.chain().focus().toggleOrderedList().run(), icon: ListOrdered, label: 'Ordered List', isActive: editor.isActive('orderedList') },
    { action: () => editor.chain().focus().toggleCodeBlock().run(), icon: Code2, label: 'Code Block', isActive: editor.isActive('codeBlock') },
    { action: addImage, icon: ImageIcon, label: 'Add Image' },
    { action: () => editor.chain().focus().setHorizontalRule().run(), icon: Minus, label: 'Horizontal Rule' },
    { type: 'divider' as const },
    { action: () => editor.chain().focus().unsetColor().run(), icon: Palette, label: 'Default Text Color', isActive: editor.isActive('textStyle') && !editor.getAttributes('textStyle').color },
    ...commonColors.map(color => ({
      action: () => editor.chain().focus().setColor(color.value).run(),
      icon: () => <div className="h-4 w-4 rounded-sm border" style={{ backgroundColor: color.value }} />,
      label: `Set text to ${color.name}`,
      isActive: editor.isActive('textStyle', { color: color.value }),
    })),
    { type: 'divider' as const },
     { action: () => editor.chain().focus().unsetHighlight().run(), icon: Highlighter, label: 'No Highlight', isActive: !editor.isActive('highlight')},
    ...commonHighlights.map(color => ({
      action: () => editor.chain().focus().toggleHighlight({ color: color.value }).run(),
      icon: () => <div className="h-4 w-4 rounded-sm border" style={{ backgroundColor: color.value }} />,
      label: `Highlight ${color.name}`,
      isActive: editor.isActive('highlight', { color: color.value }),
    })),
    { type: 'divider' as const },
    { action: () => editor.chain().focus().undo().run(), icon: Undo, label: 'Undo', disabled: !editor.can().undo() },
    { action: () => editor.chain().focus().redo().run(), icon: Redo, label: 'Redo', disabled: !editor.can().redo() },
    { action: () => editor.chain().focus().unsetAllMarks().clearNodes().run(), icon: Eraser, label: 'Clear Formatting' },
  ];

  return (
    <div className="tiptap-toolbar">
      {menuItems.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={`divider-${index}`} className="h-6 w-px bg-border mx-1"></div>;
        }
        const IconComponent = item.icon;
        return (
          <Button
            key={item.label}
            variant={item.isActive ? 'secondary' : 'ghost'}
            size="sm"
            onClick={item.action}
            disabled={item.disabled || false}
            aria-label={item.label}
            title={item.label}
            className={cn("p-2", { 'bg-muted text-accent-foreground': item.isActive })}
          >
            <IconComponent />
          </Button>
        );
      })}
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange, placeholder = "Start writing..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: 'language-' },
        // Disable default History extension to use explicit Undo/Redo buttons
        history: false, 
      }),
      Underline,
      ImageExtension.configure({
        inline: false, // Allows images to be on their own line or styled with more flexibility
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md border my-4', // Basic styling for inserted images
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle, // Required for Color extension
      Color,
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
    ],
    content: value || '',
    onUpdate: ({ editor: currentEditor }) => {
      onEditorChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose max-w-none prose-headings:text-primary prose-a:text-accent hover:prose-a:text-primary prose-strong:text-foreground/90 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-code:p-1 prose-code:rounded-sm prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-md prose-img:mx-auto',
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
      const editorElement = editor.view.dom;
      editorElement.setAttribute('data-placeholder', placeholder);
    }
  }, [editor, placeholder]);

  return (
    <div className="rounded-md border border-input bg-card shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
