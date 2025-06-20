
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSiteSettingsAction } from '@/lib/actions';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'; // For default values
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Settings, Info } from 'lucide-react';
import React from 'react'; // Added React import for useState

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
      {pending ? 'Saving Settings...' : 'Save Settings'}
    </Button>
  );
}

interface SiteSettingsState {
  message: string | null;
  errors?: any;
  isError?: boolean;
}

export default function SiteSettingsPage() {
  const initialState: SiteSettingsState = { message: null };
  const [state, formAction] = useActionState(updateSiteSettingsAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // For demo, using mock initial values for switches
  const [allowRegistrations, setAllowRegistrations] = React.useState(true);
  const [enableComments, setEnableComments] = React.useState(true);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error Saving Settings' : 'Settings Saved!',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      // Note: Form reset is not done here as users might want to see their saved values.
      // In a real app, you'd refetch settings or rely on the form state.
    }
  }, [state, toast]);

  return (
    <>
      <SectionTitle
        title="Site Settings"
        subtitle="Manage general configuration for your MuseBlog site."
        alignment="left"
      />

      <Alert className="mb-8 bg-secondary/50 border-secondary">
        <Info className="h-4 w-4" />
        <AlertTitle>Demonstration Note</AlertTitle>
        <AlertDescription>
          These settings are for demonstration purposes. Changes are validated and logged to the server console but are not persistently stored or dynamically reflected across the site in this prototype. A backend database is required for full functionality.
        </AlertDescription>
      </Alert>

      <TranslucentContainer
        baseColor="card"
        backgroundOpacity={80}
        padding="p-6 md:p-8"
        shadow="shadow-xl"
        rounded="rounded-lg"
      >
        <form ref={formRef} action={formAction} className="space-y-8">
          <div>
            <Label htmlFor="siteName" className="text-lg font-semibold text-primary">Site Name</Label>
            <Input
              id="siteName"
              name="siteName"
              placeholder="e.g., MuseBlog"
              defaultValue={SITE_NAME}
              required
              className="mt-2"
            />
            {state.errors?.siteName && <p className="text-sm text-red-500 mt-1">{state.errors.siteName[0]}</p>}
          </div>

          <div>
            <Label htmlFor="siteDescription" className="text-lg font-semibold text-primary">Site Description</Label>
            <Textarea
              id="siteDescription"
              name="siteDescription"
              placeholder="A short, catchy description of your site."
              defaultValue={SITE_DESCRIPTION}
              required
              rows={3}
              className="mt-2"
            />
            {state.errors?.siteDescription && <p className="text-sm text-red-500 mt-1">{state.errors.siteDescription[0]}</p>}
          </div>

          <div>
            <Label htmlFor="footerCopyrightText" className="text-lg font-semibold text-primary">Footer Copyright Text</Label>
            <Input
              id="footerCopyrightText"
              name="footerCopyrightText"
              placeholder="e.g., © {year} Your Company. All rights reserved."
              defaultValue={`© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`}
              className="mt-2"
            />
            {state.errors?.footerCopyrightText && <p className="text-sm text-red-500 mt-1">{state.errors.footerCopyrightText[0]}</p>}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-background/30">
              <div>
                <Label htmlFor="allowNewUserRegistrations" className="font-medium text-foreground">Allow New User Registrations</Label>
                <p className="text-xs text-muted-foreground">Enable or disable new users from creating accounts (Mock).</p>
              </div>
              <Switch
                id="allowNewUserRegistrations"
                name="allowNewUserRegistrations"
                checked={allowRegistrations}
                onCheckedChange={setAllowRegistrations}
              />
            </div>
             {state.errors?.allowNewUserRegistrations && <p className="text-sm text-red-500 mt-1">{state.errors.allowNewUserRegistrations[0]}</p>}


            <div className="flex items-center justify-between p-4 border rounded-lg bg-background/30">
               <div>
                <Label htmlFor="enableCommentsGlobally" className="font-medium text-foreground">Enable Comments Globally</Label>
                <p className="text-xs text-muted-foreground">Turn comments on or off for all blog posts (Mock).</p>
              </div>
              <Switch
                id="enableCommentsGlobally"
                name="enableCommentsGlobally"
                checked={enableComments}
                onCheckedChange={setEnableComments}
              />
            </div>
            {state.errors?.enableCommentsGlobally && <p className="text-sm text-red-500 mt-1">{state.errors.enableCommentsGlobally[0]}</p>}
          </div>

          <div className="flex justify-end mt-8">
            <SubmitButton />
          </div>
        </form>
      </TranslucentContainer>
    </>
  );
}
