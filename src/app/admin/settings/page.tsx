
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function SiteSettingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <SectionTitle 
        title="Site Settings" 
        subtitle="Configuration options for your MuseBlog site will be available here." 
        alignment="left"
      />
      <TranslucentContainer 
        baseColor="card" 
        backgroundOpacity={70} 
        padding="p-8 md:p-10"
        className="text-center"
      >
        <AlertTriangle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h3 className="text-2xl font-headline font-semibold text-primary mb-4">Coming Soon!</h3>
        <p className="text-lg text-foreground/80 mb-8">
          Adjust site-wide settings, themes, and integrations from this panel in a future update.
        </p>
        <Button asChild>
          <Link href="/admin/dashboard">Back to Admin Dashboard</Link>
        </Button>
      </TranslucentContainer>
    </div>
  );
}
