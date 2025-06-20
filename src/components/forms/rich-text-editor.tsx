
'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, ImageIcon,
  Palette, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Eraser, Undo, Redo, SubscriptIcon, SuperscriptIcon
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  if (!editor) {
    return null;
  }

  const commonButtonProps = (actionName: keyof ReturnType<Editor['can']>, params?: any, activeName?: string) => ({
    variant: "outline" as const,
    size: "sm" as const,
    className: `p-2 h-auto ${editor.isActive(activeName || actionName as string, params) ? 'bg-primary/20 text-primary' : 'text-foreground'}`,
    onClick: () => {
      if (!editor.isEditable) return;
      editor.view.focus();
      (editor.chain().focus() as any)[actionName](params).run();
    },
    disabled: !editor.isEditable || !(editor.can() as any)[actionName](params),
  });
  
  const handleAddImageUrl = () => {
    if (!editor.isEditable || !imageUrlInput) return;
    editor.view.focus();
    editor.chain().focus().setImage({ src: imageUrlInput }).run();
    setIsImagePopoverOpen(false);
    setImageUrlInput('');
  };

  const handleAddImageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !editor.isEditable) return;
    const file = event.target.files?.[0];
    if (file) {
      editor.view.focus(); 
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        editor.chain().focus().setImage({ src: dataUri }).run();
        setIsImagePopoverOpen(false);
        if (event.target) event.target.value = ''; 
      };
      reader.readAsDataURL(file);
    }
  };

  const setLink = useCallback(() => {
    if (!editor.isEditable) return;
    editor.view.focus(); 
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL (leave empty to remove link):', previousUrl);

    if (url === null) return;
    
    editor.view.focus(); 
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const handleCodeToggle = () => {
    if (!editor.isEditable) return;
    editor.view.focus();
    if (editor.state.selection && !editor.state.selection.empty) {
      editor.chain().focus().toggleCode().run();
    } else {
      editor.chain().focus().toggleCodeBlock().run();
    }
  };

  const isCodeActive = editor.isActive('code') || editor.isActive('codeBlock');
  const canToggleCodeOrCodeBlock = (editor.can().toggleCode && editor.can().toggleCode()) || (editor.can().toggleCodeBlock && editor.can().toggleCodeBlock());


  const headingLevels: (1 | 2 | 3)[] = [1, 2, 3];
  const textAlignments = ['left', 'center', 'right', 'justify'];
  const alignmentIcons: Record<string, React.ElementType> = { left: AlignLeft, center: AlignCenter, right: AlignRight, justify: AlignJustify };

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
      
      <Button
        variant="outline"
        size="sm"
        className={`p-2 h-auto ${isCodeActive ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
        onClick={() => { if(editor.isEditable) { handleCodeToggle(); }}}
        disabled={!editor.isEditable || !canToggleCodeOrCodeBlock}
        title="Code / Code Block"
      >
        <Code size={18} />
      </Button>

      <Button
        {...commonButtonProps('setHorizontalRule')}
        title="Horizontal Rule"
      >
        <Minus size={18} />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={() => { if(editor.isEditable) { setLink(); }}} title="Set/Edit Link" disabled={!editor.isEditable || !editor.can().setLink({href: ''})}><Link2 size={18} /></Button>
      
      <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" title="Add Image" disabled={!editor.isEditable || !editor.can().setImage({src:''})}>
            <ImageIcon size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 space-y-3 bg-card border-border shadow-lg rounded-md">
            <p className="text-sm font-medium text-foreground">Add Image</p>
            <div className="space-y-1">
              <Label htmlFor="image-url-input" className="text-xs text-muted-foreground">Image URL</Label>
              <Input
                id="image-url-input"
                type="url"
                placeholder="https://example.com/image.png"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="w-full bg-input text-foreground"
              />
              <Button onClick={handleAddImageUrl} size="sm" className="w-full mt-1" disabled={!imageUrlInput || !editor.isEditable}>
                Add from URL
              </Button>
            </div>
            <Separator />
            <div className="space-y-1">
              <Label htmlFor="image-file-input" className="text-xs text-muted-foreground">Or Upload from Computer</Label>
              <Input
                id="image-file-input"
                type="file"
                accept="image/*"
                onChange={handleAddImageFile}
                className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 bg-input"
              />
            </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" title="Text Align" disabled={!editor.isEditable}>
            {React.createElement(alignmentIcons[textAlignments.find(align => editor.isActive({ textAlign: align })) || 'left'], { size: 18 })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1 flex gap-1">
          {textAlignments.map(align => (
            <Button
              key={align}
              variant="outline"
              size="icon"
              className={`p-1.5 h-auto ${editor.isActive({ textAlign: align }) ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
              onClick={() => { if(editor.isEditable) { editor.view.focus(); editor.chain().focus().setTextAlign(align).run(); } }}
              disabled={!editor.isEditable || !editor.can().setTextAlign(align)}
              title={`Align ${align}`}
              aria-label={`Align ${align}`}
            >
              {React.createElement(alignmentIcons[align], { size: 18 })}
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      <label htmlFor="tiptap-color-picker" className="cursor-pointer" title="Text Color">
        <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" asChild disabled={!editor.isEditable || !editor.can().setColor('')}>
          <span><Palette size={18} /></span>
        </Button>
        <input
          id="tiptap-color-picker"
          type="color"
          onInput={(event) => { if(editor.isEditable) { editor.view.focus(); editor.chain().focus().setColor((event.target as HTMLInputElement).value).run(); }}}
          value={editor.getAttributes('textStyle').color || (document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000')}
          className="w-0 h-0 opacity-0 absolute"
          disabled={!editor.isEditable}
        />
      </label>
      <label htmlFor="tiptap-highlight-picker" className="cursor-pointer" title="Highlight Color">
        <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" asChild disabled={!editor.isEditable || !editor.can().toggleHighlight({color: ''})}>
          <span><Highlighter size={18} /></span>
        </Button>
        <input
          id="tiptap-highlight-picker"
          type="color"
          onInput={(event) => { if(editor.isEditable) { editor.view.focus(); editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run();}}}
          value={editor.getAttributes('highlight').color || '#facc15'}
          className="w-0 h-0 opacity-0 absolute"
          disabled={!editor.isEditable}
        />
      </label>
      <Button {...commonButtonProps('toggleSubscript')} title="Subscript"><SubscriptIcon size={18} /></Button>
      <Button {...commonButtonProps('toggleSuperscript')} title="Superscript"><SuperscriptIcon size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        variant="outline" size="sm" className="p-2 h-auto text-foreground"
        onClick={() => { if(editor.isEditable) { editor.view.focus(); editor.chain().focus().unsetAllMarks().clearNodes().run(); }}}
        title="Clear Formatting"
        disabled={!editor.isEditable || !(editor.can().unsetAllMarks() && editor.can().clearNodes())}
      >
        <Eraser size={18} />
      </Button>
      <Button {...commonButtonProps('undo')} title="Undo (Ctrl+Z)"><Undo size={18} /></Button>
      <Button {...commonButtonProps('redo')} title="Redo (Ctrl+Y)"><Redo size={18} /></Button>
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
        code: true,
        blockquote: true,
        horizontalRule: true,
        history: true, 
      }),
      Underline,
      ImageExtension.configure({
        inline: false, // Allows images to be block elements
        allowBase64: true, // Important for data URIs from local uploads
      }),
      LinkExtension.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle, 
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
    ],
    content: value || '',
    editable: true,
    onUpdate: ({ editor: currentEditor }) => {
      onEditorChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none', 
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false, { preserveWhitespace: 'full' });
    }
  }, [value, editor]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="bg-card rounded-md shadow-sm border border-input">
        <Skeleton className="h-10 w-full rounded-t-md bg-card" /> 
        <Skeleton className="h-[300px] w-full rounded-b-md bg-muted/30" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-md shadow-sm border border-input">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;

    