'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-colors duration-300">
      {pending ? 'Sending...' : 'Send Message'}
      {!pending && <Send className="ml-2 h-4 w-4" />}
    </Button>
  );
}

export function ContactForm() {
  const initialState = { message: null, errors: null, isError: false };
  const [state, dispatch] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error' : 'Message Sent!',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      if (!state.isError && formRef.current) {
        formRef.current.reset(); // Reset form on success
      }
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={dispatch} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
        <Input 
          type="text" 
          name="name" 
          id="name" 
          placeholder="John Doe" 
          required 
          className="mt-1 bg-background/70 border-primary/30 focus:border-primary focus:ring-primary"
        />
        {state.errors?.name && state.errors.name.map((error: string) => (
          <p key={error} className="text-sm text-red-500 mt-1">{error}</p>
        ))}
      </div>
      <div>
        <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
        <Input 
          type="email" 
          name="email" 
          id="email" 
          placeholder="you@example.com" 
          required 
          className="mt-1 bg-background/70 border-primary/30 focus:border-primary focus:ring-primary"
        />
         {state.errors?.email && state.errors.email.map((error: string) => (
          <p key={error} className="text-sm text-red-500 mt-1">{error}</p>
        ))}
      </div>
      <div>
        <Label htmlFor="message" className="text-foreground/80">Message</Label>
        <Textarea 
          name="message" 
          id="message" 
          rows={5} 
          placeholder="Your message..." 
          required 
          className="mt-1 bg-background/70 border-primary/30 focus:border-primary focus:ring-primary"
        />
        {state.errors?.message && state.errors.message.map((error: string) => (
          <p key={error} className="text-sm text-red-500 mt-1">{error}</p>
        ))}
      </div>
      <SubmitButton />
    </form>
  );
}
