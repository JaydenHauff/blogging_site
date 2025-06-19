
'use client';

import { useActionState, useRef, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createBlogPostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import RichTextEditor from '@/components/forms/rich-text-editor';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
      {pending ? 'Publishing...' : 'Publish Post'}
    </Button>
  );
}

export default function CreatePostPage() {
  const initialState: { message: string | null; errors?: any; isError?: boolean; newPostSlug?: string } = { message: null };
  const [state, formAction] = useActionState(createBlogPostAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error Creating Post' : 'Post Created!',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      if (!state.isError && formRef.current) {
        formRef.current.reset();
        setImagePreviewUrl(null);
        setImageDataUri(null);
        setImageUrlInput('');
        setEditorContent('');
        if (state.newPostSlug) {
          router.push('/admin/dashboard');
        }
      }
    }
  }, [state, toast, router]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreviewUrl(dataUri);
        setImageDataUri(dataUri);
        setImageUrlInput('');
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
      setImageDataUri(null);
    }
  };

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrlInput(url);
    if (url) {
      setImagePreviewUrl(url);
      setImageDataUri(null);
      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } else if (!imageDataUri) {
      setImagePreviewUrl(null);
    }
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <SectionTitle title="Create New Blog Post" subtitle="Craft your next masterpiece for MuseBlog." alignment="left" />

      <Alert className="mb-8 bg-secondary/50">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Admin Area & TinyMCE Editor Configuration</AlertTitle>
        <AlertDescription>
          Ensure this page and all admin functionalities are protected by authentication in production.
          <br />
          The TinyMCE editor uses an API key. <strong>If the editor is read-only (you cannot type in it), or if it displays a 'This domain is not registered...' notice:</strong>
          This almost always means your current development domain needs to be added to your TinyMCE account's "Approved Domains" list for the API key.
          <ul className="list-disc pl-5 mt-2">
            <li>Log in to your <a href="https://www.tiny.cloud/my-account/dashboard/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">TinyMCE account dashboard</a>.</li>
            <li>Navigate to your API key settings (the key currently in use is: <code>apf4vetipf1mll3j1pksv3ennu1wfld2ehi4qv9e8zwztj6f</code>).</li>
            <li>Find the "Approved Domains" section.</li>
            <li>Add the <strong>exact domain and port</strong> shown in your browser's address bar when you see the read-only editor.
                Examples:
                <ul className="list-disc pl-5 mt-1">
                    <li>If running locally: <code>localhost</code>. If using a specific port, add that too, e.g., <code>localhost:9002</code>.</li>
                    <li>If using a cloud development environment (like Firebase Studio): it might be a long URL like <code>your-project-name.cloudworkstations.dev</code> or <code>6000-firebase-studio-....cloudworkstations.dev</code>. TinyMCE might also support wildcards like <code>*.cloudworkstations.dev</code> for convenience.</li>
                </ul>
            </li>
            <li>Save the changes in your TinyMCE dashboard. You may need to wait a few minutes for the changes to propagate.</li>
            <li>Refresh this page in your application.</li>
          </ul>
        </AlertDescription>
      </Alert>

      <TranslucentContainer baseColor="card" backgroundOpacity={80} padding="p-6 md:p-8">
        <form ref={formRef} action={formAction} className="space-y-6">
          <input type="hidden" name="imageDataUri" value={imageDataUri || ''} />
          <input type="hidden" name="content" value={editorContent} />

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Enter post title" required className="mt-1"/>
            {state.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title[0]}</p>}
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL-friendly-name)</Label>
            <Input id="slug" name="slug" placeholder="e.g., my-awesome-post-title" required className="mt-1"/>
            <p className="text-xs text-muted-foreground mt-1">Should be unique, URL-friendly (lowercase, hyphens for spaces).</p>
            {state.errors?.slug && <p className="text-sm text-red-500 mt-1">{state.errors.slug[0]}</p>}
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" placeholder="Author's name" required className="mt-1"/>
            {state.errors?.author && <p className="text-sm text-red-500 mt-1">{state.errors.author[0]}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Technology, Lifestyle" className="mt-1"/>
            {state.errors?.category && <p className="text-sm text-red-500 mt-1">{state.errors.category[0]}</p>}
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" placeholder="e.g., nextjs, react, webdev" className="mt-1"/>
            {state.errors?.tags && <p className="text-sm text-red-500 mt-1">{state.errors.tags[0]}</p>}
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
            <Input id="excerpt" name="excerpt" placeholder="A brief summary of the post..." required className="mt-1"/>
            {state.errors?.excerpt && <p className="text-sm text-red-500 mt-1">{state.errors.excerpt[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageFile">Featured Image (Upload)</Label>
            <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleImageFileChange} className="mt-1"/>
            <p className="text-xs text-muted-foreground mt-1">Or</p>
            <Label htmlFor="imageUrl">Featured Image URL (Paste Link)</Label>
            <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://placehold.co/600x400.png" value={imageUrlInput} onChange={handleImageUrlChange} className="mt-1"/>
            {state.errors?.imageUrl && <p className="text-sm text-red-500 mt-1">{state.errors.imageUrl[0]}</p>}
          </div>

          {imagePreviewUrl && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <Label>Featured Image Preview:</Label>
              <div className="relative w-full h-64 mt-2 rounded-md overflow-hidden border">
                <Image src={imagePreviewUrl} alt="Selected image preview" layout="fill" objectFit="contain" />
              </div>
            </div>
          )}

           <div>
            <Label htmlFor="imageHint">Featured Image AI Hint (Optional, 1-2 words for placeholder)</Label>
            <Input id="imageHint" name="imageHint" placeholder="e.g., abstract tech" className="mt-1"/>
             {state.errors?.imageHint && <p className="text-sm text-red-500 mt-1">{state.errors.imageHint[0]}</p>}
          </div>

          <div>
            <Label htmlFor="contentEditor">Content</Label>
            <div className="mt-1">
              <RichTextEditor
                value={editorContent}
                onEditorChange={handleEditorChange}
              />
            </div>
            {state.errors?.content && <p className="text-sm text-red-500 mt-1">{state.errors.content[0]}</p>}
          </div>

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </TranslucentContainer>
    </div>
  );
}
