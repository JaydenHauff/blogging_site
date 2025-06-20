
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useEffect, useRef } from 'react'; // Added useRef
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90 text-accent-foreground transition-colors duration-300">
      {pending ? 'Subscribing...' : 'Subscribe'}
      {!pending && <Mail className="ml-2 h-4 w-4" />}
    </Button>
  );
}

export function NewsletterForm() {
  const initialState = { message: null, errors: null, isError: false };
  const [state, dispatch] = useActionState(subscribeToNewsletter, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null); // Added formRef

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Subscription Failed' : 'Subscription Successful',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      if (!state.isError && formRef.current) { // Reset form on success
        formRef.current.reset();
      }
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={dispatch} className="flex flex-col sm:flex-row gap-4 items-start w-full max-w-lg mx-auto">
      <div className="w-full">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          aria-label="Email for newsletter"
          className="bg-card border-primary/30 focus:border-primary focus:ring-primary" // Adjusted for light theme (bg-card usually white)
          required
        />
        {state.errors?.email && state.errors.email.map((error: string) => (
          <p key={error} className="text-sm text-red-500 mt-1">{error}</p>
        ))}
      </div>
      <SubmitButton />
    </form>
  );
}
