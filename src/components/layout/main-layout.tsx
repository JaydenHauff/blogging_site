import type React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-20"> {/* pt-20 to offset fixed header height */}
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
