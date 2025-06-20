
'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
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
  const addImage = useCallback(() => {
    if (!editor || editor.isDestroyed || !editor.isEditable) return;

    editor.chain().focus().run();

    const url = window.prompt('Enter image URL:');

    if (url && url.trim() !== '') {
      editor.chain().focus().setImage({ src: url.trim(), alt: 'User provided image' }).run();
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
    if (!editor || editor.isDestroyed) return [];

    const createAction = (command: (chain: any) => any, isActiveCheck?: () => boolean) => ({
      action: () => {
        if (editor && !editor.isDestroyed && editor.isEditable) {
          command(editor.chain().focus()).run();
        }
      },
      isActive: editor.isEditable && isActiveCheck ? isActiveCheck() : false,
    });

    return [
      { ...createAction(chain => chain.toggleBold(), () => editor.isActive('bold')), icon: Bold, label: 'Bold', type: "button" },
      { ...createAction(chain => chain.toggleItalic(), () => editor.isActive('italic')), icon: Italic, label: 'Italic', type: "button" },
      { ...createAction(chain => chain.toggleUnderline(), () => editor.isActive('underline')), icon: UnderlineIcon, label: 'Underline', type: "button" },
      { ...createAction(chain => chain.toggleStrike(), () => editor.isActive('strike')), icon: Strikethrough, label: 'Strikethrough', type: "button" },
      { ...createAction(chain => chain.toggleCode(), () => editor.isActive('code')), icon: Code, label: 'Inline Code', type: "button" },
      { ...createAction(chain => chain.toggleSubscript(), () => editor.isActive('subscript')), icon: SubscriptIcon, label: 'Subscript', type: "button"},
      { ...createAction(chain => chain.toggleSuperscript(), () => editor.isActive('superscript')), icon: SuperscriptIcon, label: 'Superscript', type: "button"},
      { type: 'divider' as const },
      { ...createAction(chain => chain.setParagraph(), () => editor.isActive('paragraph')), icon: Pilcrow, label: 'Paragraph', type: "button" },
      { ...createAction(chain => chain.toggleHeading({ level: 1 }), () => editor.isActive('heading', { level: 1 })), icon: Heading1, label: 'Heading 1', type: "button" },
      { ...createAction(chain => chain.toggleHeading({ level: 2 }), () => editor.isActive('heading', { level: 2 })), icon: Heading2, label: 'Heading 2', type: "button" },
      { ...createAction(chain => chain.toggleHeading({ level: 3 }), () => editor.isActive('heading', { level: 3 })), icon: Heading3, label: 'Heading 3', type: "button" },
      { type: 'divider' as const },
      { ...createAction(chain => chain.setTextAlign('left'), () => editor.isActive({ textAlign: 'left' })), icon: AlignLeft, label: 'Align Left', type: "button" },
      { ...createAction(chain => chain.setTextAlign('center'), () => editor.isActive({ textAlign: 'center' })), icon: AlignCenter, label: 'Align Center', type: "button" },
      { ...createAction(chain => chain.setTextAlign('right'), () => editor.isActive({ textAlign: 'right' })), icon: AlignRight, label: 'Align Right', type: "button" },
      { ...createAction(chain => chain.setTextAlign('justify'), () => editor.isActive({ textAlign: 'justify' })), icon: AlignJustify, label: 'Align Justify', type: "button" },
      { type: 'divider' as const },
      { ...createAction(chain => chain.toggleBlockquote(), () => editor.isActive('blockquote')), icon: Quote, label: 'Blockquote', type: "button" },
      { ...createAction(chain => chain.toggleBulletList(), () => editor.isActive('bulletList')), icon: List, label: 'Bullet List', type: "button" },
      { ...createAction(chain => chain.toggleOrderedList(), () => editor.isActive('orderedList')), icon: ListOrdered, label: 'Ordered List', type: "button" },
      { ...createAction(chain => chain.toggleCodeBlock(), () => editor.isActive('codeBlock')), icon: Code2, label: 'Code Block', type: "button" },
      { action: addImage, icon: ImageIcon, label: 'Add Image', isActive: false, type: "button" },
      { ...createAction(chain => chain.setHorizontalRule()), icon: Minus, label: 'Horizontal Rule', type: "button" },
      { type: 'divider' as const },
      { ...createAction(chain => chain.unsetColor(), () => editor.isActive('textStyle') && !editor.getAttributes('textStyle').color), icon: Palette, label: 'Default Text Color', type: "button" },
      ...commonColors.map(color => ({
        ...createAction(chain => chain.setColor(color.value), () => editor.isActive('textStyle', { color: color.value })),
        icon: () => <div style={{ backgroundColor: color.value }} title={`Set text to ${color.name}`} />,
        label: `Set text to ${color.name}`,
        type: "button" as const
      })),
      { type: 'divider' as const },
      { ...createAction(chain => chain.unsetHighlight(), () => !editor.isActive('highlight') || editor.isActive('highlight', {color: ''})), icon: Highlighter, label: 'No Highlight', type: "button"},
      ...commonHighlights.map(color => ({
        ...createAction(chain => chain.toggleHighlight({ color: color.value }), () => editor.isActive('highlight', { color: color.value })),
        icon: () => <div style={{ backgroundColor: color.value }} title={`Highlight ${color.name}`} />,
        label: `Highlight ${color.name}`,
        type: "button" as const
      })),
      { type: 'divider' as const },
      { icon: Undo, label: 'Undo', action: () => { if (editor && !editor.isDestroyed && editor.isEditable) editor.chain().focus().undo().run()}, disabled: !(editor && !editor.isDestroyed && editor.isEditable && editor.can().chain().focus().undo().run()), type: "button" },
      { icon: Redo, label: 'Redo', action: () => { if (editor && !editor.isDestroyed && editor.isEditable) editor.chain().focus().redo().run()}, disabled: !(editor && !editor.isDestroyed && editor.isEditable && editor.can().chain().focus().redo().run()), type: "button" },
      { ...createAction(chain => chain.unsetAllMarks().clearNodes()), icon: Eraser, label: 'Clear Formatting', type: "button" },
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
            type="button" // Explicitly set type to "button"
            variant={item.isActive ? 'secondary' : 'ghost'}
            size="sm"
            onClick={item.action}
            disabled={'disabled' in item ? item.disabled : (editor && !editor.isDestroyed ? !editor.isEditable : true)}
            aria-label={item.label}
            title={item.label}
            className="p-2"
          >
            <IconComponent />
          </Button>
        );
      })}
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        placeholder: {
            placeholder: placeholder || "Start writing...",
        }
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
      if (!currentEditor.isDestroyed) {
        onEditorChange(currentEditor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-accent hover:prose-a:text-primary prose-strong:text-foreground/90 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-code:p-1 prose-code:rounded-sm prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-md',
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && value !== null && value !== undefined) {
      if (value !== editor.getHTML()) {
        editor.commands.setContent(value, false);
        // Focus the editor after setting content, especially important for edit pages
        editor.commands.focus('end'); 
      }
    }
  }, [value, editor]);

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

