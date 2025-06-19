
'use client';

import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createBlogPostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

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

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error Creating Post' : 'Post Created!',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      if (!state.isError && formRef.current) {
        formRef.current.reset();
        if (state.newPostSlug) {
          // Optional: Redirect to the new post or to the manage posts page
          // router.push(`/blogs/${state.newPostSlug}`);
          router.push('/admin/dashboard'); // Or /admin/posts
        }
      }
    }
  }, [state, toast, router]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <SectionTitle title="Create New Blog Post" subtitle="Craft your next masterpiece for MuseBlog." alignment="left" />
      
      <Alert className="mb-8 bg-secondary/50">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Admin Area</AlertTitle>
        <AlertDescription>
          Ensure this page and all admin functionalities are protected by authentication and authorization in a production environment.
        </AlertDescription>
      </Alert>

      <TranslucentContainer baseColor="card" backgroundOpacity={80} padding="p-6 md:p-8">
        <form ref={formRef} action={formAction} className="space-y-6">
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
            <Textarea id="excerpt" name="excerpt" placeholder="A brief summary of the post..." rows={3} required className="mt-1"/>
            {state.errors?.excerpt && <p className="text-sm text-red-500 mt-1">{state.errors.excerpt[0]}</p>}
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://placehold.co/600x400.png" className="mt-1"/>
             {state.errors?.imageUrl && <p className="text-sm text-red-500 mt-1">{state.errors.imageUrl[0]}</p>}
          </div>

           <div>
            <Label htmlFor="imageHint">Image AI Hint (Optional, 1-2 words for placeholder)</Label>
            <Input id="imageHint" name="imageHint" placeholder="e.g., abstract tech" className="mt-1"/>
             {state.errors?.imageHint && <p className="text-sm text-red-500 mt-1">{state.errors.imageHint[0]}</p>}
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              name="content" 
              placeholder="Write your blog post content here... Supports HTML." 
              rows={15} 
              required 
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Note: This is a basic textarea. A production app should integrate a rich text editor (e.g., Tiptap, Quill) for better styling, image embedding, etc. You can use HTML tags here for now.
            </p>
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
