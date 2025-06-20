
'use client';
import { useActionState, useEffect } from 'react';
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Button } from '@/components/ui/button';
import { MOCK_SUBSCRIBERS } from '@/lib/constants';
import { removeSubscriberAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

interface SubscriberActionState {
  message: string | null;
  isError?: boolean;
}

function RemoveButton({ subscriberId, subscriberEmail }: { subscriberId: string; subscriberEmail: string }) {
  const { toast } = useToast();
  const initialState: SubscriberActionState = { message: null };
  const [state, formAction] = useActionState(removeSubscriberAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error' : 'Subscriber Action',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={subscriberId} />
      <Button variant="destructive" size="sm" type="submit" aria-label={`Remove subscriber ${subscriberEmail}`}>
        <Trash2 className="h-4 w-4 mr-2" />
        Remove
      </Button>
    </form>
  );
}

export default function ManageSubscribersPage() {
  const subscribers = MOCK_SUBSCRIBERS;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <SectionTitle 
        title="Manage Subscribers" 
        subtitle={`View and manage newsletter subscribers. Currently showing ${subscribers.length} mock subscriber(s).`}
        alignment="left"
      />
      {subscribers.length > 0 ? (
        <TranslucentContainer 
          baseColor="card" 
          backgroundOpacity={70} 
          padding="p-0" // Table will have its own padding
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>{new Date(subscriber.subscribedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <RemoveButton subscriberId={subscriber.id} subscriberEmail={subscriber.email} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TranslucentContainer>
      ) : (
         <TranslucentContainer 
            baseColor="card" 
            backgroundOpacity={70} 
            padding="p-8 md:p-10"
            className="text-center"
          >
          <p className="text-lg text-foreground/80">No subscribers found.</p>
        </TranslucentContainer>
      )}
       <div className="mt-6 p-4 bg-secondary/30 rounded-md text-sm text-muted-foreground">
          <strong>Note:</strong> Subscriber additions via the newsletter form are logged to the console. 
          This list displays statically defined mock subscribers from <code>src/lib/constants.ts</code>. 
          "Remove" actions are simulated (logged to console) and do not persistently alter this mock list on page reload.
          A real backend database is required for persistent subscriber management.
        </div>
    </div>
  );
}
