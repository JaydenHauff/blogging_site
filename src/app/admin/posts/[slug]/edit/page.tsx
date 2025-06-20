
'use client';

import { useActionState, useRef, useEffect, useState, use, useCallback } from 'react'; 
import { useFormStatus } from 'react-dom';
import { useRouter, notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { updateBlogPostAction } from '@/lib/actions';
import { MOCK_BLOG_POSTS } from '@/lib/constants';
import type { BlogPost } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const TiptapEditor = dynamic(() => import('@/components/forms/rich-text-editor'), { 
  ssr: false,
  loading: () => (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  )
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
      {pending ? 'Updating Post...' : 'Update Post'}
    </Button>
  );
}

interface EditPostPageProps {
  params: { slug: string };
}

export default function EditPostPage({ params: paramsAsProp }: EditPostPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const resolvedParams = use(paramsAsProp);
  const slug = resolvedParams.slug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');

  useEffect(() => {
    const foundPost = MOCK_BLOG_POSTS.find(p => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
      setImageUrlInput(foundPost.imageUrl || '');
      setImagePreviewUrl(foundPost.imageUrl || null);
      setEditorContent(foundPost.content || '');
    } else {
      notFound();
    }
  }, [slug]);

  const initialState: { message: string | null; errors?: any; isError?: boolean; updatedPostSlug?: string } = { message: null };
  const [state, formAction] = useActionState(updateBlogPostAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error Updating Post' : 'Post Updated!',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      if (!state.isError && state.updatedPostSlug) {
        router.push(`/admin/posts`); // Redirect to posts list
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
      setImagePreviewUrl(post?.imageUrl || null); 
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
      setImagePreviewUrl(post?.imageUrl || null);
    }
  };

  const handleEditorChange = useCallback((content: string) => {
    setEditorContent(content);
  }, []); 

  if (!post) {
    return <div className="text-center">Loading post data...</div>;
  }

  return (
    <>
      <SectionTitle title="Edit Blog Post" subtitle={`Editing: ${post.title}`} alignment="left" />

      <Alert className="mb-8 bg-secondary/50 border-secondary">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Content Editor</AlertTitle>
        <AlertDescription>
          You are editing an existing post. The Tiptap editor provides various formatting options.
        </AlertDescription>
      </Alert>

      <TranslucentContainer baseColor="card" backgroundOpacity={80} padding="p-6 md:p-8" shadow="shadow-xl" rounded="rounded-lg">
        <form ref={formRef} action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="content" value={editorContent} />
          <input type="hidden" name="imageDataUri" value={imageDataUri || ''} />

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Enter post title" required defaultValue={post.title} className="mt-1"/>
            {state.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title[0]}</p>}
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL-friendly-name)</Label>
            <Input id="slug" name="slug" placeholder="e.g., my-awesome-post-title" required defaultValue={post.slug} className="mt-1"/>
            <p className="text-xs text-muted-foreground mt-1">Should be unique, URL-friendly (lowercase, hyphens for spaces).</p>
            {state.errors?.slug && <p className="text-sm text-red-500 mt-1">{state.errors.slug[0]}</p>}
          </div>
          
          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" placeholder="Author's name" required defaultValue={post.author} className="mt-1"/>
            {state.errors?.author && <p className="text-sm text-red-500 mt-1">{state.errors.author[0]}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Technology, Lifestyle" defaultValue={post.category || ''} className="mt-1"/>
            {state.errors?.category && <p className="text-sm text-red-500 mt-1">{state.errors.category[0]}</p>}
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" placeholder="e.g., nextjs, react, webdev" defaultValue={post.tags?.join(', ') || ''} className="mt-1"/>
            {state.errors?.tags && <p className="text-sm text-red-500 mt-1">{state.errors.tags[0]}</p>}
          </div>
          
          <div>
            <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
            <Input id="excerpt" name="excerpt" placeholder="A brief summary of the post..." required defaultValue={post.excerpt} className="mt-1"/>
            {state.errors?.excerpt && <p className="text-sm text-red-500 mt-1">{state.errors.excerpt[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageFile">Featured Image (Upload to Change)</Label>
            <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleImageFileChange} className="mt-1"/>
            <p className="text-xs text-muted-foreground mt-1">Or</p>
            <Label htmlFor="imageUrl">Featured Image URL (Paste Link to Change)</Label>
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
            <Input id="imageHint" name="imageHint" placeholder="e.g., abstract tech" defaultValue={post.imageHint || ''} className="mt-1"/>
             {state.errors?.imageHint && <p className="text-sm text-red-500 mt-1">{state.errors.imageHint[0]}</p>}
          </div>

          <div>
            <Label htmlFor="contentEditor">Content</Label>
            <div className="mt-1">
              <TiptapEditor
                value={editorContent}
                onEditorChange={handleEditorChange}
                placeholder="Continue editing your blog post..."
              />
            </div>
            {state.errors?.content && <p className="text-sm text-red-500 mt-1">{state.errors.content[0]}</p>}
          </div>

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </TranslucentContainer>
    </>
  );
}
