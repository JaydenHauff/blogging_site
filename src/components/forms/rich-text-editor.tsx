
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
import HorizontalRule from '@tiptap/extension-horizontal-rule'; // Added this import

import { Button } from '@/components/ui/button';
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, ImageIcon, Baseline, SuperscriptIcon, SubscriptIcon, // Removed Pilcrow as it's not used
  Palette, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, Eraser, Undo, Redo,
  CodeXml // For HTML toggle
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// Removed ToggleGroup imports as the component is missing
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea'; // For HTML mode

interface MenuBarProps {
  editor: Editor | null;
  isHtmlMode: boolean;
  onHtmlToggle: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor, isHtmlMode, onHtmlToggle }) => {
  if (!editor && !isHtmlMode) { // If editor is null and not in HTML mode, don't render
    return null;
  }
  
  const commonButtonProps = (actionName?: string, params?: any, activeName?: string) => ({
    variant: "outline" as const,
    size: "sm" as const,
    className: `p-2 h-auto ${editor && editor.isActive(activeName || actionName || '', params) ? 'bg-primary/20 text-primary' : 'text-foreground'}`,
    onClick: actionName && editor ? () => { editor.view.focus(); editor.chain().focus()[actionName](params).run(); } : undefined,
    disabled: !editor || !editor.isEditable || (actionName && !editor.can()[actionName](params)),
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
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const headingLevels: (1 | 2 | 3)[] = [1, 2, 3];
  const textAlignments = ['left', 'center', 'right', 'justify'];
  const alignmentIcons = { left: AlignLeft, center: AlignCenter, right: AlignRight, justify: AlignJustify };

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

      {/* Disable editor controls if in HTML mode or editor not available/editable */}
      <Button {...commonButtonProps('toggleBold')} title="Bold (Ctrl+B)" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleBold()}><Bold size={18} /></Button>
      <Button {...commonButtonProps('toggleItalic')} title="Italic (Ctrl+I)" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleItalic()}><Italic size={18} /></Button>
      <Button {...commonButtonProps('toggleUnderline')} title="Underline (Ctrl+U)" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleUnderline()}><UnderlineIcon size={18} /></Button>
      <Button {...commonButtonProps('toggleStrike')} title="Strikethrough" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleStrike()}><Strikethrough size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      {headingLevels.map(level => (
        <Button key={level} {...commonButtonProps('toggleHeading', { level })} title={`Heading ${level}`} disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleHeading({level})}>
          {level === 1 && <Heading1 size={18} />}
          {level === 2 && <Heading2 size={18} />}
          {level === 3 && <Heading3 size={18} />}
        </Button>
      ))}
      <Separator orientation="vertical" className="h-6" />
      <Button {...commonButtonProps('toggleBulletList')} title="Bullet List" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleBulletList()}><List size={18} /></Button>
      <Button {...commonButtonProps('toggleOrderedList')} title="Ordered List" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleOrderedList()}><ListOrdered size={18} /></Button>
      <Button {...commonButtonProps('toggleBlockquote')} title="Blockquote" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleBlockquote()}><Quote size={18} /></Button>
      <Button {...commonButtonProps('toggleCodeBlock')} title="Code Block" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleCodeBlock()}><Code size={18} /></Button>
      <Button {...commonButtonProps('setHorizontalRule')} title="Horizontal Rule" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().setHorizontalRule()}><Minus size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={setLink} title="Set/Edit Link" disabled={isHtmlMode || !editor || !editor.isEditable}><Link2 size={18} /></Button>
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={addImage} title="Add Image" disabled={isHtmlMode || !editor || !editor.isEditable}><ImageIcon size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" title="Text Align" disabled={isHtmlMode || !editor || !editor.isEditable}>
            {editor && editor.isEditable ? React.createElement(alignmentIcons[textAlignments.find(align => editor.isActive({ textAlign: align })) || 'left'  as keyof typeof alignmentIcons], { size: 18 }) : <AlignLeft size={18} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1 flex gap-1">
          {textAlignments.map(align => (
            <Button
              key={align}
              variant="outline"
              size="icon"
              className={`p-1.5 h-auto ${editor && editor.isActive({ textAlign: align }) ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
              onClick={() => { if(editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().setTextAlign(align).run(); } }}
              disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().setTextAlign(align)}
              title={`Align ${align}`}
              aria-label={`Align ${align}`}
            >
              {React.createElement(alignmentIcons[align as keyof typeof alignmentIcons], { size: 18 })}
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      <label htmlFor="tiptap-color-picker" className="cursor-pointer" title="Text Color">
        <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" asChild disabled={isHtmlMode || !editor || !editor.isEditable}>
          <span><Palette size={18} /></span>
        </Button>
        <input
          id="tiptap-color-picker"
          type="color"
          onInput={(event) => { if(editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().setColor((event.target as HTMLInputElement).value).run(); }}}
          value={editor?.getAttributes('textStyle').color || '#ffffff'} // Default to white for dark theme
          className="w-0 h-0 opacity-0 absolute"
          disabled={isHtmlMode || !editor || !editor.isEditable}
        />
      </label>
      <label htmlFor="tiptap-highlight-picker" className="cursor-pointer" title="Highlight Color">
        <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" asChild disabled={isHtmlMode || !editor || !editor.isEditable}>
          <span><Highlighter size={18} /></span>
        </Button>
        <input
          id="tiptap-highlight-picker"
          type="color"
          onInput={(event) => { if(editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run();}}}
          value={editor?.getAttributes('highlight').color || '#facc15'} // Default to a yellow for dark theme
          className="w-0 h-0 opacity-0 absolute"
          disabled={isHtmlMode || !editor || !editor.isEditable}
        />
      </label>
      <Button {...commonButtonProps('toggleSubscript')} title="Subscript" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleSubscript()}><SubscriptIcon size={18} /></Button>
      <Button {...commonButtonProps('toggleSuperscript')} title="Superscript" disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().toggleSuperscript()}><SuperscriptIcon size={18} /></Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={() => { if(editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().unsetAllMarks().clearNodes().run(); }}} title="Clear Formatting" disabled={isHtmlMode || !editor || !editor.isEditable}><Eraser size={18} /></Button>
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={() => { if(editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().undo().run(); }}} disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().undo()} title="Undo (Ctrl+Z)"><Undo size={18} /></Button>
      <Button variant="outline" size="sm" className="p-2 h-auto text-foreground" onClick={() => { if(editor && editor.isEditable) { editor.view.focus(); editor.chain().focus().redo().run(); }}} disabled={isHtmlMode || !editor || !editor.isEditable || !editor.can().redo()} title="Redo (Ctrl+Y)"><Redo size={18} /></Button>
    </div>
  );
};

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onEditorChange, placeholder }) => {
  const [isHtmlMode, setIsHtmlMode] = React.useState(false);
  const [htmlContent, setHtmlContent] = React.useState(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: 'language-' },
        horizontalRule: false, 
      }),
      Underline,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
      HorizontalRule,
    ],
    content: value || '',
    editable: true,
    onUpdate: ({ editor: currentEditor }) => {
      if (!isHtmlMode) {
        const newHtml = currentEditor.getHTML();
        onEditorChange(newHtml);
        setHtmlContent(newHtml); // Keep htmlContent in sync
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
      editor.commands.setContent(value || '', false);
      setHtmlContent(value || '');
    }
    if (isHtmlMode) { // When switching to HTML mode, ensure htmlContent has latest editor value
        setHtmlContent(editor?.getHTML() || value || '');
    }
  }, [value, editor, isHtmlMode]);

  useEffect(() => {
    return () => { // Cleanup when component unmounts
      editor?.destroy();
    };
  }, [editor]);

  const handleHtmlToggle = () => {
    if (!editor) return;
    if (isHtmlMode) { // Switching from HTML to Visual
      editor.commands.setContent(htmlContent, false); // Set editor content from textarea
      onEditorChange(htmlContent); // Ensure parent form gets the update
    } else { // Switching from Visual to HTML
      setHtmlContent(editor.getHTML()); // Update textarea content from editor
    }
    setIsHtmlMode(!isHtmlMode);
  };

  const handleHtmlContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlContent(event.target.value);
    // Optionally, if you want live updates to parent FROM HTML mode:
    // onEditorChange(event.target.value); 
  };


  return (
    <div className="bg-card rounded-md shadow-sm border border-input">
      <MenuBar editor={editor} isHtmlMode={isHtmlMode} onHtmlToggle={handleHtmlToggle} />
      {isHtmlMode ? (
        <Textarea
          value={htmlContent}
          onChange={handleHtmlContentChange}
          className="w-full min-h-[300px] p-4 font-code text-sm bg-muted/50 border-t-0 rounded-t-none rounded-b-md focus:outline-none focus:ring-0 tiptap-html-editor"
          placeholder="Edit HTML source..."
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
};

export default RichTextEditor;

