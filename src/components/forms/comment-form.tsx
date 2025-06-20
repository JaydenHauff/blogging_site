
'use client';

import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { addCommentAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface CommentFormProps {
  blogPostId: string;
  blogPostSlug: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? 'Submitting...' : 'Submit Comment'}
      {!pending && <Send className="ml-2 h-4 w-4" />}
    </Button>
  );
}

export function CommentForm({ blogPostId, blogPostSlug }: CommentFormProps) {
  const initialState: { message: string | null; errors?: any; isError?: boolean } = { message: null };
  const [state, formAction] = useActionState(addCommentAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error' : 'Comment Submitted',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      if (!state.isError && formRef.current) {
        formRef.current.reset();
      }
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 mt-6">
      <input type="hidden" name="blogPostId" value={blogPostId} />
      <input type="hidden" name="blogPostSlug" value={blogPostSlug} />
      <div>
        <Label htmlFor="authorName">Name</Label>
        <Input id="authorName" name="authorName" required placeholder="Your Name" className="mt-1 bg-input/80" />
        {state.errors?.authorName && <p className="text-sm text-red-500 mt-1">{state.errors.authorName[0]}</p>}
      </div>
      <div>
        <Label htmlFor="authorEmail">Email (Optional)</Label>
        <Input id="authorEmail" name="authorEmail" type="email" placeholder="your.email@example.com" className="mt-1 bg-input/80" />
        {state.errors?.authorEmail && <p className="text-sm text-red-500 mt-1">{state.errors.authorEmail[0]}</p>}
      </div>
      <div>
        <Label htmlFor="text">Comment</Label>
        <Textarea id="text" name="text" rows={4} required placeholder="Share your thoughts..." className="mt-1 bg-input/80" />
        {state.errors?.text && <p className="text-sm text-red-500 mt-1">{state.errors.text[0]}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
