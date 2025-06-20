
'use client';

import React, { useEffect, useCallback, Fragment } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Placeholder from '@tiptap/extension-placeholder';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

import { Button } from '@/components/ui/button';
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, Heading1, Heading2, Heading3,
  Pilcrow, List, ListOrdered, Quote, Minus, Link2, ImageIcon, Baseline, SuperscriptIcon, SubscriptIcon,
  Palette, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, Eraser, Undo, Redo,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';


interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
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

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return; // User cancelled
    if (url === '') { // User wants to remove link
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const commonButtonProps = (actionName?: string, params?: any, activeName?: string) => ({
    variant: "outline" as const,
    size: "sm" as const,
    className: `p-2 h-auto ${editor.isActive(activeName || actionName || '', params) ? 'bg-primary/20 text-primary' : 'text-foreground'}`,
    onClick: actionName ? () => editor.chain().focus()[actionName](params).run() : undefined,
    disabled: actionName ? !editor.can()[actionName](params) : false,
  });

  const headingLevels: (1 | 2 | 3)[] = [1, 2, 3];
  const textAlignments = ['left', 'center', 'right', 'justify'];
  const alignmentIcons = { left: AlignLeft, center: AlignCenter, right: AlignRight, justify: AlignJustify };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border border-input rounded-t-md bg-card">
      <Button {...commonButtonProps('toggleBold')} title="Bold (Ctrl+B)"><Bold size={18} /></Button>
      <Button {...commonButtonProps('toggleItalic')} title="Italic (Ctrl+I)"><Italic size={18} /></Button>
      <Button {...commonButtonProps('toggleUnderline')} title="Underline (Ctrl+U)"><UnderlineIcon size={18} /></Button>
      <Button {...commonButtonProps('toggleStrike')} title="Strikethrough"><Strikethrough size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      {headingLevels.map(level => (
        <Button key={level} {...commonButtonProps('toggleHeading', { level })} title={`Heading ${level}`}>
          {level === 1 && <Heading1 size={18} />}
          {level === 2 && <Heading2 size={18} />}
          {level === 3 && <Heading3 size={18} />}
        </Button>
      ))}
      <Separator orientation="vertical" className="h-6" />
      <Button {...commonButtonProps('toggleBulletList')} title="Bullet List"><List size={18} /></Button>
      <Button {...commonButtonProps('toggleOrderedList')} title="Ordered List"><ListOrdered size={18} /></Button>
      <Button {...commonButtonProps('toggleBlockquote')} title="Blockquote"><Quote size={18} /></Button>
      <Button {...commonButtonProps('toggleCodeBlock')} title="Code Block"><Code size={18} /></Button>
      <Button {...commonButtonProps('setHorizontalRule')} title="Horizontal Rule"><Minus size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={setLink} title="Set/Edit Link">
        <Link2 size={18} />
      </Button>
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={addImage} title="Add Image"><ImageIcon size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" title="Text Align">
            <AlignLeft size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1">
          <ToggleGroup
            type="single"
            value={textAlignments.find(align => editor.isActive({ textAlign: align })) || 'left'}
            onValueChange={(value) => { if (value) editor.chain().focus().setTextAlign(value).run(); }}
          >
            {textAlignments.map(align => (
              <ToggleGroupItem key={align} value={align} aria-label={`Align ${align}`} className="p-1.5">
                {React.createElement(alignmentIcons[align as keyof typeof alignmentIcons], { size: 18 })}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </PopoverContent>
      </Popover>
      <label htmlFor="tiptap-color-picker" className="cursor-pointer" title="Text Color">
        <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" asChild>
          <span><Palette size={18} /></span>
        </Button>
        <input
          id="tiptap-color-picker"
          type="color"
          onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-0 h-0 opacity-0 absolute"
        />
      </label>
      <label htmlFor="tiptap-highlight-picker" className="cursor-pointer" title="Highlight Color">
        <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" asChild>
          <span><Highlighter size={18} /></span>
        </Button>
        <input
          id="tiptap-highlight-picker"
          type="color"
          onInput={(event) => editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run()}
          value={editor.getAttributes('highlight').color || '#ffff00'}
          className="w-0 h-0 opacity-0 absolute"
        />
      </label>
       <Button {...commonButtonProps('toggleSubscript')} title="Subscript"><SubscriptIcon size={18} /></Button>
      <Button {...commonButtonProps('toggleSuperscript')} title="Superscript"><SuperscriptIcon size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting"><Eraser size={18} /></Button>
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)"><Undo size={18} /></Button>
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)"><Redo size={18} /></Button>
    </div>
  );
};

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: 'language-' },
        horizontalRule: false, // We'll use the dedicated HorizontalRule extension
      }),
      Underline,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle, // Required for Color extension
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
      HorizontalRule,
    ],
    content: value || '',
    onUpdate: ({ editor: currentEditor }) => {
      onEditorChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none p-4 min-h-[300px] bg-muted/30 text-foreground border border-input border-t-0 rounded-b-md',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Use a timeout to ensure the editor is fully initialized before setting content,
      // especially if the initial value comes from an async source.
      // This can help prevent issues where content is set before the editor is ready.
      const timer = setTimeout(() => {
         // Check if editor is still there and not destroyed
        if (editor && !editor.isDestroyed) {
          editor.commands.setContent(value || '', false); // false to not trigger onUpdate
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [value, editor]);


  return (
    <div className="bg-card rounded-md shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
