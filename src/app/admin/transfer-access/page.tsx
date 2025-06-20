
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TransferAdminAccessPage() {
  return (
    <>
      <SectionTitle 
        title="Transfer Admin Access" 
        subtitle="Functionality to transfer primary admin ownership will be developed here." 
        alignment="left"
      />
      <TranslucentContainer 
        baseColor="card" 
        backgroundOpacity={80} 
        padding="p-8 md:p-10"
        className="text-center"
        shadow="shadow-xl"
        rounded="rounded-lg"
      >
        <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
        <h3 className="text-2xl font-headline font-semibold text-primary mb-4">Coming Soon!</h3>
        <p className="text-lg text-foreground/80 mb-8">
          This secure feature for transferring administrative privileges is planned for a future release.
        </p>
        <Button asChild>
          <Link href="/admin/dashboard">Back to Admin Dashboard</Link>
        </Button>
      </TranslucentContainer>
    </>
  );
}
