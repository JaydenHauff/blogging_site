
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
    if (!editor || editor.isDestroyed) return;

    // Ensure the editor has focus before opening the prompt
    editor.chain().focus().run();
    
    if (!editor.isEditable) {
        // console.warn("Editor is not editable when trying to prompt for image URL.");
        return;
    }

    const url = window.prompt('Enter image URL:');
    
    if (url && url.trim() !== '') {
      // Re-focus and set the image after the prompt
      editor.chain().focus().setImage({ src: url.trim(), alt: 'User provided image' }).run();
    } else if (url !== null) { 
      // console.warn('Image URL cannot be empty.');
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
    
    const createAction = (command: (chain: any) => any) => () => {
      if (editor && !editor.isDestroyed) {
        command(editor.chain().focus()).run();
      }
    };

    return [
      { action: createAction(chain => chain.toggleBold()), icon: Bold, label: 'Bold', isActive: editor.isActive('bold') },
      { action: createAction(chain => chain.toggleItalic()), icon: Italic, label: 'Italic', isActive: editor.isActive('italic') },
      { action: createAction(chain => chain.toggleUnderline()), icon: UnderlineIcon, label: 'Underline', isActive: editor.isActive('underline') },
      { action: createAction(chain => chain.toggleStrike()), icon: Strikethrough, label: 'Strikethrough', isActive: editor.isActive('strike') },
      { action: createAction(chain => chain.toggleCode()), icon: Code, label: 'Inline Code', isActive: editor.isActive('code') },
      { action: createAction(chain => chain.toggleSubscript()), icon: SubscriptIcon, label: 'Subscript', isActive: editor.isActive('subscript')},
      { action: createAction(chain => chain.toggleSuperscript()), icon: SuperscriptIcon, label: 'Superscript', isActive: editor.isActive('superscript')},
      { type: 'divider' as const },
      { action: createAction(chain => chain.setParagraph()), icon: Pilcrow, label: 'Paragraph', isActive: editor.isActive('paragraph') },
      { action: createAction(chain => chain.toggleHeading({ level: 1 })), icon: Heading1, label: 'Heading 1', isActive: editor.isActive('heading', { level: 1 }) },
      { action: createAction(chain => chain.toggleHeading({ level: 2 })), icon: Heading2, label: 'Heading 2', isActive: editor.isActive('heading', { level: 2 }) },
      { action: createAction(chain => chain.toggleHeading({ level: 3 })), icon: Heading3, label: 'Heading 3', isActive: editor.isActive('heading', { level: 3 }) },
      { type: 'divider' as const },
      { action: createAction(chain => chain.setTextAlign('left')), icon: AlignLeft, label: 'Align Left', isActive: editor.isActive({ textAlign: 'left' }) },
      { action: createAction(chain => chain.setTextAlign('center')), icon: AlignCenter, label: 'Align Center', isActive: editor.isActive({ textAlign: 'center' }) },
      { action: createAction(chain => chain.setTextAlign('right')), icon: AlignRight, label: 'Align Right', isActive: editor.isActive({ textAlign: 'right' }) },
      { action: createAction(chain => chain.setTextAlign('justify')), icon: AlignJustify, label: 'Align Justify', isActive: editor.isActive({ textAlign: 'justify' }) },
      { type: 'divider' as const },
      { action: createAction(chain => chain.toggleBlockquote()), icon: Quote, label: 'Blockquote', isActive: editor.isActive('blockquote') },
      { action: createAction(chain => chain.toggleBulletList()), icon: List, label: 'Bullet List', isActive: editor.isActive('bulletList') },
      { action: createAction(chain => chain.toggleOrderedList()), icon: ListOrdered, label: 'Ordered List', isActive: editor.isActive('orderedList') },
      { action: createAction(chain => chain.toggleCodeBlock()), icon: Code2, label: 'Code Block', isActive: editor.isActive('codeBlock') },
      { action: addImage, icon: ImageIcon, label: 'Add Image' }, // addImage already checks editor validity
      { action: createAction(chain => chain.setHorizontalRule()), icon: Minus, label: 'Horizontal Rule' },
      { type: 'divider' as const },
      { action: createAction(chain => chain.unsetColor()), icon: Palette, label: 'Default Text Color', isActive: editor.isActive('textStyle') && !editor.getAttributes('textStyle').color },
      ...commonColors.map(color => ({
        action: createAction(chain => chain.setColor(color.value)),
        icon: () => <div className="h-4 w-4 rounded-sm border" style={{ backgroundColor: color.value }} title={`Set text to ${color.name}`} />,
        label: `Set text to ${color.name}`,
        isActive: editor.isActive('textStyle', { color: color.value }),
      })),
      { type: 'divider' as const },
      { action: createAction(chain => chain.unsetHighlight()), icon: Highlighter, label: 'No Highlight', isActive: !editor.isActive('highlight') || editor.isActive('highlight', {color: ''})},
      ...commonHighlights.map(color => ({
        action: createAction(chain => chain.toggleHighlight({ color: color.value })),
        icon: () => <div className="h-4 w-4 rounded-sm border" style={{ backgroundColor: color.value }} title={`Highlight ${color.name}`} />,
        label: `Highlight ${color.name}`,
        isActive: editor.isActive('highlight', { color: color.value }),
      })),
      { type: 'divider' as const },
      { action: createAction(chain => chain.undo()), icon: Undo, label: 'Undo', disabled: !(editor && !editor.isDestroyed && editor.can().chain().focus().undo().run()) },
      { action: createAction(chain => chain.redo()), icon: Redo, label: 'Redo', disabled: !(editor && !editor.isDestroyed && editor.can().chain().focus().redo().run()) },
      { action: createAction(chain => chain.unsetAllMarks().clearNodes()), icon: Eraser, label: 'Clear Formatting' },
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
        // Defaults will allow H1-H6. Specific levels can be configured if needed.
        // heading: {}, 
        blockquote: {}, 
        codeBlock: { languageClassPrefix: 'language-', HTMLAttributes: { class: 'bg-muted p-2 rounded-md text-sm'} },
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
      onEditorChange(currentEditor.getHTML());
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
    
