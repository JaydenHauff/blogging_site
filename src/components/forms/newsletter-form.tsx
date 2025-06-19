'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useEffect } from 'react';
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

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Subscription Failed' : 'Subscription Successful',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);

  return (
    <form action={dispatch} className="flex flex-col sm:flex-row gap-4 items-start w-full max-w-lg mx-auto">
      <div className="w-full">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          aria-label="Email for newsletter"
          className="bg-white/80 border-primary/30 focus:border-primary focus:ring-primary"
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
