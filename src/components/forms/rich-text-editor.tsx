
'use client';

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import TextAlignExtension from '@tiptap/extension-text-align';
import TextStyleExtension from '@tiptap/extension-text-style';
import ColorExtension from '@tiptap/extension-color';
import HighlightExtension from '@tiptap/extension-highlight';
import SubscriptExtension from '@tiptap/extension-subscript';
import SuperscriptExtension from '@tiptap/extension-superscript';
import PlaceholderExtension from '@tiptap/extension-placeholder';

import {
  Bold, Italic, Strikethrough, Code, Pilcrow, Heading1, Heading2, Heading3,
  Quote, List, ListOrdered, Code2, Minus, Undo, Redo, Underline as UnderlineIcon,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Palette,
  Baseline, Eraser, Superscript as SuperscriptIcon, Subscript as SubscriptIcon, Highlighter,
  CodeXml // For HTML toggle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea'; // For HTML mode

interface RichTextEditorProps {
  value?: string;
  onEditorChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar: React.FC<{ editor: Editor | null; isHtmlMode: boolean; toggleHtmlMode: () => void; }> = ({ editor, isHtmlMode, toggleHtmlMode }) => {
  const commonColors = useMemo(() => [
    { name: 'Black', value: '#000000' }, { name: 'Red', value: '#e60000' },
    { name: 'Blue', value: '#0073e6' }, { name: 'Green', value: '#008a00' },
    { name: 'Primary', value: 'hsl(var(--primary))' },
  ], []);

  const commonHighlights = useMemo(() => [
    { name: 'Yellow', value: '#FFF3A3' }, { name: 'Light Blue', value: '#ADD8E6' },
    { name: 'Light Green', value: '#90EE90' }, { name: 'None', value: ''}
  ], []);

  const addImage = useCallback(() => {
    if (!editor || editor.isDestroyed || !editor.isEditable) return;
    editor.view.focus();
    const url = window.prompt('Enter image URL:');
    if (url && url.trim() !== '') {
      editor.chain().focus().setImage({ src: url.trim(), alt: 'User provided image' }).run();
    }
  }, [editor]);

  const createAction = useCallback((
    commandCallback: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>,
    isActiveCheckName?: string | { name: string; attributes?: Record<string, any> },
    canExecuteCheckName?: string | { name: string; attributes?: Record<string, any> },
    commandAttributes?: Record<string, any>
  ) => {
    const isEditorReadyAndEditable = editor && !editor.isDestroyed && editor.isEditable;
    
    let canExecute = false;
    if (isEditorReadyAndEditable) {
        if (typeof canExecuteCheckName === 'string') {
            canExecute = editor.can().chain().focus()[canExecuteCheckName as keyof ReturnType<Editor['chain']>]?.(commandAttributes || {}).run();
        } else if (typeof canExecuteCheckName === 'object') {
             canExecute = editor.can().chain().focus()[canExecuteCheckName.name as keyof ReturnType<Editor['chain']>]?.(canExecuteCheckName.attributes || {}).run();
        } else {
            // A generic check if no specific `can` method is provided (e.g. for undo/redo or complex toggles)
            // This might need refinement for specific commands that don't have simple `can().commandName()`
            canExecute = true; // Assume can execute if no specific check, rely on editor.isEditable
        }
    }


    return {
      action: () => {
        if (isEditorReadyAndEditable) {
          editor.view.focus();
          commandCallback(editor.chain().focus()).run();
        }
      },
      isActive: isEditorReadyAndEditable && isActiveCheckName ? 
        (typeof isActiveCheckName === 'string' ? editor.isActive(isActiveCheckName, commandAttributes) : editor.isActive(isActiveCheckName.name, isActiveCheckName.attributes)) 
        : false,
      disabled: !isEditorReadyAndEditable || !canExecute,
      type: "button" as const,
    };
  }, [editor]);

  const menuItems = useMemo(() => {
    if (!editor) return [];

    return [
      { action: toggleHtmlMode, icon: CodeXml, label: isHtmlMode ? 'Visual Editor' : 'HTML Editor', type: "button" as const, disabled: false, isActive: isHtmlMode },
      { type: 'divider' as const },
      { ...createAction(chain => chain.toggleBold(), 'bold', 'toggleBold'), icon: Bold, label: 'Bold' },
      { ...createAction(chain => chain.toggleItalic(), 'italic', 'toggleItalic'), icon: Italic, label: 'Italic' },
      { ...createAction(chain => chain.toggleUnderline(), 'underline', 'toggleUnderline'), icon: UnderlineIcon, label: 'Underline' },
      { ...createAction(chain => chain.toggleStrike(), 'strike', 'toggleStrike'), icon: Strikethrough, label: 'Strikethrough' },
      { ...createAction(chain => chain.toggleCode(), 'code', 'toggleCode'), icon: Code, label: 'Inline Code' },
      { ...createAction(chain => chain.toggleSubscript(), 'subscript', 'toggleSubscript'), icon: SubscriptIcon, label: 'Subscript'},
      { ...createAction(chain => chain.toggleSuperscript(), 'superscript', 'toggleSuperscript'), icon: SuperscriptIcon, label: 'Superscript'},
      { type: 'divider' as const },
      { ...createAction(chain => chain.setParagraph(), 'paragraph', 'setParagraph'), icon: Pilcrow, label: 'Paragraph' },
      { ...createAction(chain => chain.toggleHeading({ level: 1 }), {name: 'heading', attributes: { level: 1 }}, {name: 'toggleHeading', attributes: { level: 1 }}), icon: Heading1, label: 'Heading 1' },
      { ...createAction(chain => chain.toggleHeading({ level: 2 }), {name: 'heading', attributes: { level: 2 }}, {name: 'toggleHeading', attributes: { level: 2 }}), icon: Heading2, label: 'Heading 2' },
      { ...createAction(chain => chain.toggleHeading({ level: 3 }), {name: 'heading', attributes: { level: 3 }}, {name: 'toggleHeading', attributes: { level: 3 }}), icon: Heading3, label: 'Heading 3' },
      { type: 'divider' as const },
      { ...createAction(chain => chain.setTextAlign('left'), {name: 'textAlign', attributes: {textAlign: 'left'}}, {name: 'setTextAlign', attributes: 'left'}), icon: AlignLeft, label: 'Align Left' },
      { ...createAction(chain => chain.setTextAlign('center'), {name: 'textAlign', attributes: {textAlign: 'center'}}, {name: 'setTextAlign', attributes: 'center'}), icon: AlignCenter, label: 'Align Center' },
      { ...createAction(chain => chain.setTextAlign('right'), {name: 'textAlign', attributes: {textAlign: 'right'}}, {name: 'setTextAlign', attributes: 'right'}), icon: AlignRight, label: 'Align Right' },
      { ...createAction(chain => chain.setTextAlign('justify'), {name: 'textAlign', attributes: {textAlign: 'justify'}}, {name: 'setTextAlign', attributes: 'justify'}), icon: AlignJustify, label: 'Align Justify' },
      { type: 'divider' as const },
      { ...createAction(chain => chain.toggleBlockquote(), 'blockquote', 'toggleBlockquote'), icon: Quote, label: 'Blockquote' },
      { ...createAction(chain => chain.toggleBulletList(), 'bulletList', 'toggleBulletList'), icon: List, label: 'Bullet List' },
      { ...createAction(chain => chain.toggleOrderedList(), 'orderedList', 'toggleOrderedList'), icon: ListOrdered, label: 'Ordered List' },
      { ...createAction(chain => chain.toggleCodeBlock(), 'codeBlock', 'toggleCodeBlock'), icon: Code2, label: 'Code Block' },
      { action: addImage, icon: ImageIcon, label: 'Add Image', type: "button" as const, disabled: !(editor && !editor.isDestroyed && editor.isEditable && editor.can().setImage({src:''})) },
      { ...createAction(chain => chain.setHorizontalRule(), undefined, 'setHorizontalRule'), icon: Minus, label: 'Horizontal Rule' },
      { type: 'divider' as const },
      { ...createAction(chain => chain.unsetColor(), undefined, 'unsetColor'), icon: Palette, label: 'Default Text Color' },
      ...commonColors.map(color => ({
        ...createAction(chain => chain.setColor(color.value), {name: 'textStyle', attributes: { color: color.value }}, 'setColor', color.value),
        icon: () => <div style={{ backgroundColor: color.value }} title={`Set text to ${color.name}`} />,
        label: `Set text to ${color.name}`,
      })),
      { type: 'divider' as const },
      { ...createAction(chain => chain.unsetHighlight(), () => !editor.isActive('highlight'), 'unsetHighlight'), icon: Highlighter, label: 'No Highlight'},
      ...commonHighlights.map(color => ({
        ...createAction(chain => chain.toggleHighlight({ color: color.value }), {name: 'highlight', attributes: { color: color.value }}, 'toggleHighlight', {color: color.value}),
        icon: () => <div style={{ backgroundColor: color.value }} title={`Highlight ${color.name}`} />,
        label: `Highlight ${color.name}`,
      })),
      { type: 'divider' as const },
      { 
        icon: Undo, label: 'Undo', 
        action: () => { if (editor && !editor.isDestroyed && editor.isEditable) { editor.view.focus(); editor.chain().focus().undo().run()}}, 
        disabled: !(editor && !editor.isDestroyed && editor.isEditable && editor.can().undo()), type: "button" as const 
      },
      { 
        icon: Redo, label: 'Redo', 
        action: () => { if (editor && !editor.isDestroyed && editor.isEditable) { editor.view.focus(); editor.chain().focus().redo().run()}}, 
        disabled: !(editor && !editor.isDestroyed && editor.isEditable && editor.can().redo()), type: "button" as const 
      },
      { ...createAction(chain => chain.unsetAllMarks().clearNodes(), undefined, 'unsetAllMarks'), icon: Eraser, label: 'Clear Formatting' },
    ];
  }, [editor, addImage, commonColors, commonHighlights, createAction, isHtmlMode, toggleHtmlMode]);

  if (!editor && !isHtmlMode) { // Show loading only if editor isn't ready and not in HTML mode
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
        // For HTML toggle button, disable other editor-specific buttons if in HTML mode
        const isDisabledInHtmlMode = isHtmlMode && item.label !== (isHtmlMode ? 'Visual Editor' : 'HTML Editor');
        
        return (
          <Button
            key={item.label || `button-${index}`} 
            type="button"
            variant={item.isActive ? 'secondary' : 'ghost'}
            size="sm"
            onClick={item.action}
            disabled={item.disabled || isDisabledInHtmlMode}
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
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
         heading: { levels: [1, 2, 3, 4, 5, 6] },
         codeBlock: {}, 
         blockquote: {},
      }),
      PlaceholderExtension.configure({
        placeholder: placeholder || "Start writing...",
      }),
      UnderlineExtension,
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md border my-4 mx-auto block',
        },
      }),
      TextAlignExtension.configure({ types: ['heading', 'paragraph', 'image'] }),
      TextStyleExtension,
      ColorExtension,
      HighlightExtension.configure({ multicolor: true }),
      SuperscriptExtension,
      SubscriptExtension,
    ],
    content: value || '',
    editable: true,
    onUpdate: ({ editor: currentEditor }) => {
      if (currentEditor && !currentEditor.isDestroyed) {
        // Only propagate change if not in HTML mode to avoid feedback loop from textarea
        if (!isHtmlMode) { 
          const newContent = currentEditor.getHTML();
          onEditorChange(newContent);
          setHtmlContent(newContent); // Keep htmlContent synced if changes happen in WYSIWYG
        }
      }
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-accent hover:prose-a:text-primary prose-strong:text-foreground/90 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-code:p-1 prose-code:rounded-sm prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-md',
      },
    },
  }, []); // Intentionally empty dependencies to create editor once. Content sync handled by useEffect.

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      if (value !== editor.getHTML() && !isHtmlMode) { // Only update if value changes AND not in HTML mode
        editor.commands.setContent(value || '', false);
      }
      // If switching to WYSIWYG from HTML, htmlContent is the source of truth
      if (!isHtmlMode && value !== htmlContent && editor.getHTML() !== htmlContent) {
        //This check is important because `value` (from parent form) might be stale
        //if changes were made in HTML mode and `onEditorChange` wasn't called yet for parent form.
      }
    }
  }, [value, editor, isHtmlMode, htmlContent]);


  useEffect(() => {
    // Sync external value to htmlContent when not in HTML mode, or on initial load
     if (!isHtmlMode && value !== htmlContent) {
        setHtmlContent(value || '');
    }
  }, [value, isHtmlMode]);


  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        editor.destroy();
      }
    };
  }, [editor]);

  const toggleHtmlMode = useCallback(() => {
    if (!editor || editor.isDestroyed) return;

    setIsHtmlMode(prevIsHtmlMode => {
      const newModeIsHtml = !prevIsHtmlMode;
      if (newModeIsHtml) {
        // Entering HTML mode: get current content from Tiptap
        setHtmlContent(editor.getHTML());
      } else {
        // Exiting HTML mode: set Tiptap content from textarea
        // Use the current `htmlContent` state, which textarea would have updated
        editor.commands.setContent(htmlContent, false); // false to avoid firing onUpdate
        onEditorChange(htmlContent); // Manually call onEditorChange to sync parent form state
      }
      return newModeIsHtml;
    });
  }, [editor, htmlContent, onEditorChange]);


  if (!editor && !isHtmlMode) {
    return (
      <div className="rounded-md border border-input bg-card shadow-sm">
        <div className="tiptap-toolbar">
          <p className="text-muted-foreground p-2 text-sm">Editor initializing...</p>
        </div>
        <div className="tiptap p-4 min-h-[300px]">
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-input bg-card shadow-sm">
      <MenuBar editor={editor} isHtmlMode={isHtmlMode} toggleHtmlMode={toggleHtmlMode} />
      {isHtmlMode ? (
        <Textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          className="w-full min-h-[300px] p-4 font-mono text-sm border-t border-input rounded-b-md bg-muted/50 focus:outline-none focus:ring-0"
          placeholder="Edit HTML source..."
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
};

export default RichTextEditor;

    