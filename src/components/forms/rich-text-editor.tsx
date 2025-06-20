
'use client';

import React, { useEffect, useCallback, useState } from 'react';
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
  List, ListOrdered, Quote, Minus, Link2, ImageIcon, Baseline, SuperscriptIcon, SubscriptIcon,
  Palette, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, Eraser, Undo, Redo,
  CodeXml
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface MenuBarProps {
  editor: Editor | null;
  isHtmlMode: boolean;
  onHtmlToggle: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor, isHtmlMode, onHtmlToggle }) => {
  if (!editor && !isHtmlMode) {
    return null;
  }

  const commonButtonProps = (actionName: keyof ReturnType<Editor['can']>, params?: any, activeName?: string) => ({
    variant: "outline" as const,
    size: "sm" as const,
    className: `p-2 h-auto ${!isHtmlMode && editor && editor.isActive(activeName || actionName, params) ? 'bg-primary/20 text-primary' : 'text-foreground'}`,
    onClick: !isHtmlMode && editor && editor.isEditable ? () => { editor.view.focus(); editor.chain().focus()[actionName as any](params).run(); } : undefined,
    disabled: isHtmlMode || !editor || !editor.isEditable || (actionName && !editor.can()[actionName as any](params)),
  });

  const addImage = useCallback(() => {
    if (!editor || !editor.isEditable) return;
    editor.view.focus();
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor || !editor.isEditable) return;
    editor.view.focus();
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL (leave empty to remove link):', previousUrl);

    if (url === null) return; // User cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const headingLevels: (1 | 2 | 3)[] = [1, 2, 3];
  const textAlignments = ['left', 'center', 'right', 'justify'];
  const alignmentIcons: Record<string, React.ElementType> = { left: AlignLeft, center: AlignCenter, right: AlignRight, justify: AlignJustify };


  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border border-input rounded-t-md bg-card">
      <Button
        variant="outline"
        size="sm"
        className={`p-2 h-auto ${isHtmlMode ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
        onClick={onHtmlToggle}
        title={isHtmlMode ? "Switch to Visual Editor" : "Switch to HTML Editor"}
      >
        <CodeXml size={18} />
      </Button>
      <Separator orientation="vertical" className="h-6" />

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
      <Button 
        {...commonButtonProps('setHorizontalRule')} 
        onClick={!isHtmlMode && editor && editor.isEditable ? () => { editor.view.focus(); editor.chain().focus().setHorizontalRule().run(); } : undefined}
        title="Horizontal Rule"
      >
        <Minus size={18} />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={setLink} title="Set/Edit Link" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().setLink({href: ''})}><Link2 size={18} /></Button>
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={addImage} title="Add Image" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().setImage({src:''})}><ImageIcon size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" title="Text Align" disabled={isHtmlMode || !editor || !editor.isEditable}>
            {editor && editor.isEditable && !isHtmlMode ? React.createElement(alignmentIcons[textAlignments.find(align => editor.isActive({ textAlign: align })) || 'left'], { size: 18 }) : <AlignLeft size={18} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1 flex gap-1">
          {textAlignments.map(align => (
            <Button
              key={align}
              variant="outline"
              size="icon"
              className={`p-1.5 h-auto ${!isHtmlMode && editor && editor.isActive({ textAlign: align }) ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
              onClick={() => { if(!isHtmlMode && editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().setTextAlign(align).run(); } }}
              disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().setTextAlign(align)}
              title={`Align ${align}`}
              aria-label={`Align ${align}`}
            >
              {React.createElement(alignmentIcons[align], { size: 18 })}
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      <label htmlFor="tiptap-color-picker" className="cursor-pointer" title="Text Color">
        <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" asChild disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().setColor('')}>
          <span><Palette size={18} /></span>
        </Button>
        <input
          id="tiptap-color-picker"
          type="color"
          onInput={(event) => { if(!isHtmlMode && editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().setColor((event.target as HTMLInputElement).value).run(); }}}
          value={!isHtmlMode && editor?.getAttributes('textStyle').color || '#ffffff'}
          className="w-0 h-0 opacity-0 absolute"
          disabled={isHtmlMode || !editor || !editor.isEditable}
        />
      </label>
      <label htmlFor="tiptap-highlight-picker" className="cursor-pointer" title="Highlight Color">
        <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" asChild disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleHighlight({color: ''})}>
          <span><Highlighter size={18} /></span>
        </Button>
        <input
          id="tiptap-highlight-picker"
          type="color"
          onInput={(event) => { if(!isHtmlMode && editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run();}}}
          value={!isHtmlMode && editor?.getAttributes('highlight').color || '#facc15'}
          className="w-0 h-0 opacity-0 absolute"
          disabled={isHtmlMode || !editor || !editor.isEditable}
        />
      </label>
      <Button {...commonButtonProps('toggleSubscript')} title="Subscript"><SubscriptIcon size={18} /></Button>
      <Button {...commonButtonProps('toggleSuperscript')} title="Superscript"><SuperscriptIcon size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      <Button 
        variant="outline" size="sm" className="p-2 h-auto text-foreground" 
        onClick={() => { if(!isHtmlMode && editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().unsetAllMarks().clearNodes().run(); }}} 
        title="Clear Formatting" 
        disabled={isHtmlMode || !editor || !editor.isEditable || !(editor.can().unsetAllMarks() && editor.can().clearNodes())}
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
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: 'language-' },
        // Ensure blockquote and horizontalRule are enabled by StarterKit or explicitly added
        // blockquote: true, // default is true
        // horizontalRule: true, // default is true
      }),
      Underline,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
      HorizontalRule, // Explicitly adding it for clarity, StarterKit also includes it.
    ],
    content: value || '',
    editable: true,
    onUpdate: ({ editor: currentEditor }) => {
      if (!isHtmlMode) {
        const newHtml = currentEditor.getHTML();
        onEditorChange(newHtml);
        setHtmlContent(newHtml);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none p-4 min-h-[300px] bg-muted/30 text-foreground border border-input border-t-0 rounded-b-md tiptap-editor-content',
      },
    },
  });

  useEffect(() => {
    if (editor && !isHtmlMode && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false); // emitUpdate: false
      setHtmlContent(value || '');
    }
    if (isHtmlMode && editor) {
        setHtmlContent(editor.getHTML() || value || '');
    }
  }, [value, editor, isHtmlMode]);


  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleHtmlToggle = () => {
    if (!editor) return;
    if (isHtmlMode) { // Switching from HTML to Visual
      editor.commands.setContent(htmlContent, false); // emitUpdate: false to prevent loop
      onEditorChange(htmlContent); // Manually call onEditorChange if needed when switching back
    } else { // Switching from Visual to HTML
      setHtmlContent(editor.getHTML());
    }
    setIsHtmlMode(!isHtmlMode);
  };

  const handleHtmlContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlContent(event.target.value);
    // If live updates from HTML mode to parent are desired:
    // onEditorChange(event.target.value);
    // And if editor instance should reflect HTML changes live:
    // if (editor && isHtmlMode) editor.commands.setContent(event.target.value, false);
  };


  return (
    <div className="bg-card rounded-md shadow-sm border border-input">
      <MenuBar editor={editor} isHtmlMode={isHtmlMode} onHtmlToggle={handleHtmlToggle} />
      {isHtmlMode ? (
        <Textarea
          value={htmlContent}
          onChange={handleHtmlContentChange}
          className="w-full min-h-[300px] p-4 font-mono text-sm bg-muted/50 border-t-0 rounded-t-none rounded-b-md focus:outline-none focus:ring-0 tiptap-html-editor"
          placeholder="Edit HTML source..."
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
    