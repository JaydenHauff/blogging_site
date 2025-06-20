
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
import Placeholder from '@tiptap/extension-placeholder';

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
  
  const addImage = useCallback(() => {
    if (!editor || editor.isDestroyed || !editor.isEditable) {
      return;
    }
    editor.view.focus(); 
    const url = window.prompt('Enter image URL:');
    if (url && url.trim() !== '') {
      editor.chain().focus().setImage({ src: url.trim(), alt: 'User provided image' }).run();
    }
  }, [editor]);

  const createAction = useCallback((
    commandCallback: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>,
    isActiveCheck?: () => boolean | undefined,
    canExecuteCheck?: () => boolean | undefined
  ) => {
    const isEditorReadyAndEditable = editor && !editor.isDestroyed && editor.isEditable;
    
    return {
      action: () => {
        if (isEditorReadyAndEditable) {
          editor.view.focus(); // Force focus before command
          commandCallback(editor.chain().focus()).run();
        }
      },
      isActive: isEditorReadyAndEditable && isActiveCheck ? isActiveCheck() : false,
      disabled: !isEditorReadyAndEditable || (canExecuteCheck ? !canExecuteCheck() : false),
      type: "button" as const,
    };
  }, [editor]);
    
  const menuItems = useMemo(() => {
    if (!editor) return []; 

    return [
      { ...createAction(chain => chain.toggleBold(), () => editor.isActive('bold'), () => editor.can().toggleBold()), icon: Bold, label: 'Bold' },
      { ...createAction(chain => chain.toggleItalic(), () => editor.isActive('italic'), () => editor.can().toggleItalic()), icon: Italic, label: 'Italic' },
      { ...createAction(chain => chain.toggleUnderline(), () => editor.isActive('underline'), () => editor.can().toggleUnderline()), icon: UnderlineIcon, label: 'Underline' },
      { ...createAction(chain => chain.toggleStrike(), () => editor.isActive('strike'), () => editor.can().toggleStrike()), icon: Strikethrough, label: 'Strikethrough' },
      { ...createAction(chain => chain.toggleCode(), () => editor.isActive('code'), () => editor.can().toggleCode()), icon: Code, label: 'Inline Code' },
      { ...createAction(chain => chain.toggleSubscript(), () => editor.isActive('subscript'), () => editor.can().toggleSubscript()), icon: SubscriptIcon, label: 'Subscript'},
      { ...createAction(chain => chain.toggleSuperscript(), () => editor.isActive('superscript'), () => editor.can().toggleSuperscript()), icon: SuperscriptIcon, label: 'Superscript'},
      { type: 'divider' as const },
      { ...createAction(chain => chain.setParagraph(), () => editor.isActive('paragraph'), () => editor.can().setParagraph()), icon: Pilcrow, label: 'Paragraph' },
      { ...createAction(chain => chain.toggleHeading({ level: 1 }), () => editor.isActive('heading', { level: 1 }), () => editor.can().toggleHeading({level: 1})), icon: Heading1, label: 'Heading 1' },
      { ...createAction(chain => chain.toggleHeading({ level: 2 }), () => editor.isActive('heading', { level: 2 }), () => editor.can().toggleHeading({level: 2})), icon: Heading2, label: 'Heading 2' },
      { ...createAction(chain => chain.toggleHeading({ level: 3 }), () => editor.isActive('heading', { level: 3 }), () => editor.can().toggleHeading({level: 3})), icon: Heading3, label: 'Heading 3' },
      { type: 'divider' as const },
      { ...createAction(chain => chain.setTextAlign('left'), () => editor.isActive({ textAlign: 'left' }), () => editor.can().setTextAlign('left')), icon: AlignLeft, label: 'Align Left' },
      { ...createAction(chain => chain.setTextAlign('center'), () => editor.isActive({ textAlign: 'center' }), () => editor.can().setTextAlign('center')), icon: AlignCenter, label: 'Align Center' },
      { ...createAction(chain => chain.setTextAlign('right'), () => editor.isActive({ textAlign: 'right' }), () => editor.can().setTextAlign('right')), icon: AlignRight, label: 'Align Right' },
      { ...createAction(chain => chain.setTextAlign('justify'), () => editor.isActive({ textAlign: 'justify' }), () => editor.can().setTextAlign('justify')), icon: AlignJustify, label: 'Align Justify' },
      { type: 'divider' as const },
      { ...createAction(chain => chain.toggleBlockquote(), () => editor.isActive('blockquote'), () => editor.can().toggleBlockquote()), icon: Quote, label: 'Blockquote' },
      { ...createAction(chain => chain.toggleBulletList(), () => editor.isActive('bulletList'), () => editor.can().toggleBulletList()), icon: List, label: 'Bullet List' },
      { ...createAction(chain => chain.toggleOrderedList(), () => editor.isActive('orderedList'), () => editor.can().toggleOrderedList()), icon: ListOrdered, label: 'Ordered List' },
      { ...createAction(chain => chain.toggleCodeBlock(), () => editor.isActive('codeBlock'), () => editor.can().toggleCodeBlock()), icon: Code2, label: 'Code Block' },
      { action: addImage, icon: ImageIcon, label: 'Add Image', type: "button" as const, disabled: !(editor && !editor.isDestroyed && editor.isEditable && editor.can().setImage({src:''})) },
      { ...createAction(chain => chain.setHorizontalRule(), undefined, () => editor.can().setHorizontalRule()), icon: Minus, label: 'Horizontal Rule' },
      { type: 'divider' as const },
      { ...createAction(chain => chain.unsetColor(), undefined, () => editor.can().unsetColor()), icon: Palette, label: 'Default Text Color' },
      ...commonColors.map(color => ({
        ...createAction(chain => chain.setColor(color.value), () => editor.isActive('textStyle', { color: color.value }), () => editor.can().setColor(color.value)),
        icon: () => <div style={{ backgroundColor: color.value }} title={`Set text to ${color.name}`} />,
        label: `Set text to ${color.name}`,
      })),
      { type: 'divider' as const },
      { ...createAction(chain => chain.unsetHighlight(), () => !editor.isActive('highlight'), () => editor.can().unsetHighlight()), icon: Highlighter, label: 'No Highlight'}, // Check for no active highlight might be tricky, rely on can()
      ...commonHighlights.map(color => ({
        ...createAction(chain => chain.toggleHighlight({ color: color.value }), () => editor.isActive('highlight', { color: color.value }), () => editor.can().toggleHighlight({color: color.value})),
        icon: () => <div style={{ backgroundColor: color.value }} title={`Highlight ${color.name}`} />,
        label: `Highlight ${color.name}`,
      })),
      { type: 'divider' as const },
      { 
        icon: Undo, 
        label: 'Undo', 
        action: () => { if (editor && !editor.isDestroyed && editor.isEditable) { editor.view.focus(); editor.chain().focus().undo().run()}}, 
        disabled: !(editor && !editor.isDestroyed && editor.isEditable && editor.can().undo()), 
        type: "button" as const 
      },
      { 
        icon: Redo, 
        label: 'Redo', 
        action: () => { if (editor && !editor.isDestroyed && editor.isEditable) { editor.view.focus(); editor.chain().focus().redo().run()}}, 
        disabled: !(editor && !editor.isDestroyed && editor.isEditable && editor.can().redo()), 
        type: "button" as const 
      },
      { ...createAction(chain => chain.unsetAllMarks().clearNodes(), undefined, () => editor.can().unsetAllMarks() && editor.can().clearNodes()), icon: Eraser, label: 'Clear Formatting' },
    ];
  }, [editor, addImage, commonColors, commonHighlights, createAction]);

  if (!editor) {
    return (
      <div className="tiptap-toolbar">
        <p className="text-muted-foreground p-2 text-sm">Editor initializing...</p>
      </div>
    );
  }
  
  return (
    <div className="tiptap-toolbar">
      {menuItems.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={`divider-${index}`} className="h-6 w-px bg-border mx-1"></div>;
        }
        const IconComponent = item.icon;
        return (
          <Button
            key={item.label || `button-${index}`} 
            type="button"
            variant={item.isActive ? 'secondary' : 'ghost'}
            size="sm"
            onClick={item.action}
            disabled={item.disabled}
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
        heading: { levels: [1, 2, 3, 4, 5, 6] }, // Keep default levels
        codeBlock: {}, 
        blockquote: {},
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
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
      if (currentEditor && !currentEditor.isDestroyed) {
        onEditorChange(currentEditor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-accent hover:prose-a:text-primary prose-strong:text-foreground/90 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-code:p-1 prose-code:rounded-sm prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-md',
      },
    },
  }, [onEditorChange, placeholder]); // Removed `value` from dependencies for initial load handling

  useEffect(() => {
    // Set initial content only once or when value genuinely changes from outside
    if (editor && !editor.isDestroyed && value !== null && value !== undefined) {
      // Avoid re-setting content if it's the same, which can cause issues
      if (value !== editor.getHTML()) {
          // Delay slightly to ensure editor is fully ready for content update
          setTimeout(() => {
              if (editor && !editor.isDestroyed) {
                  editor.commands.setContent(value, false); 
                  editor.commands.focus('end'); 
              }
          }, 0);
      }
    }
  }, [value, editor]); // Only re-run if value or editor instance changes

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
