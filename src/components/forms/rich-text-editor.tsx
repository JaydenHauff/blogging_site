
'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style'; // Required for Color
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
    if (!editor) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const commonColors = useMemo(() => [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#e60000' },
    { name: 'Blue', value: '#0073e6' },
    { name: 'Green', value: '#008a00' },
    { name: 'Primary', value: 'hsl(var(--primary))' },
  ], []);

  const commonHighlights = useMemo(() => [
    { name: 'Yellow', value: '#FFF3A3' },
    { name: 'Light Blue', value: '#ADD8E6' },
    { name: 'Light Green', value: '#90EE90' },
    { name: 'None', value: ''}
  ], []);
  
  const menuItems = useMemo(() => {
    if (!editor) return [];
    return [
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
        icon: () => <div className="h-4 w-4 rounded-sm border" style={{ backgroundColor: color.value }} title={`Set text to ${color.name}`} />,
        label: `Set text to ${color.name}`,
        isActive: editor.isActive('textStyle', { color: color.value }),
      })),
      { type: 'divider' as const },
       { action: () => editor.chain().focus().unsetHighlight().run(), icon: Highlighter, label: 'No Highlight', isActive: !editor.isActive('highlight') || editor.isActive('highlight', {color: ''})},
      ...commonHighlights.map(color => ({
        action: () => editor.chain().focus().toggleHighlight({ color: color.value }).run(),
        icon: () => <div className="h-4 w-4 rounded-sm border" style={{ backgroundColor: color.value }} title={`Highlight ${color.name}`} />,
        label: `Highlight ${color.name}`,
        isActive: editor.isActive('highlight', { color: color.value }),
      })),
      { type: 'divider' as const },
      { action: () => editor.chain().focus().undo().run(), icon: Undo, label: 'Undo', disabled: !editor.can().chain().focus().undo().run() },
      { action: () => editor.chain().focus().redo().run(), icon: Redo, label: 'Redo', disabled: !editor.can().chain().focus().redo().run() },
      { action: () => editor.chain().focus().unsetAllMarks().clearNodes().run(), icon: Eraser, label: 'Clear Formatting' },
    ];
  }, [editor, addImage, commonColors, commonHighlights]);

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
            type="button"
            variant={item.isActive ? 'secondary' : 'ghost'}
            size="sm"
            onClick={item.action}
            disabled={item.disabled || false}
            aria-label={item.label}
            title={item.label}
            className="p-2" // Simplified: active state handled by variant
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
        heading: { levels: [1, 2, 3], HTMLAttributes: { class: 'font-headline text-primary' } }, // Basic styling for headings within editor
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-primary pl-4 italic text-muted-foreground'}},
        codeBlock: { languageClassPrefix: 'language-', HTMLAttributes: { class: 'bg-muted p-2 rounded-md text-sm'} },
      }),
      Underline,
      ImageExtension.configure({
        inline: false, 
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md border my-4 mx-auto block',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      TextStyle, 
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
        // Base structural styling for the editor container
        class: 'tiptap prose max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-accent hover:prose-a:text-primary prose-strong:text-foreground/90 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-code:p-1 prose-code:rounded-sm prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-md',
      },
    },
  });

  useEffect(() => {
    // Sync external value changes to the editor
    if (editor && value !== null && value !== undefined && value !== editor.getHTML()) {
      if (!editor.isDestroyed) {
        // Setting content often, ensure it's only when truly necessary.
        // The comparison editor.getHTML() vs value is key.
        editor.commands.setContent(value, false); // 'false' to not emit an update event from this change
      }
    }
  }, [value, editor]);
  
  useEffect(() => {
    // Tiptap's Placeholder extension is part of StarterKit and handles this via CSS
    // based on p.is-editor-empty:first-child::before and data-placeholder attribute.
    // We just need to ensure the placeholder text is configured for the extension if custom.
    // StarterKit.configure({ placeholder: { placeholder: placeholder }}) is one way if not using CSS.
    // For now, relying on CSS with data-placeholder attribute.
  }, [editor, placeholder]);


  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <div className="rounded-md border border-input bg-card shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
    
