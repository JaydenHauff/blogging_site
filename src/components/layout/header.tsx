
'use client'; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenText, PanelLeft } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react'; 
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet" 

const navLinksBase = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/admin/dashboard', label: 'Admin Panel' }, // Admin link always visible
];

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Basic header structure for SSR/initial mount to avoid hydration mismatch
  const ssrHeader = (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors">
            <BookOpenText className="h-8 w-8" />
            <span className="text-3xl font-headline font-bold">MuseBlog</span>
          </Link>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <PanelLeft className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );

  if (!isMounted) {
    return ssrHeader;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors">
            <BookOpenText className="h-8 w-8" />
            <span className="text-3xl font-headline font-bold">MuseBlog</span>
          </Link>
          <nav className="hidden md:flex space-x-1">
            {navLinksBase.map((link) => (
              <Button key={link.href} variant="ghost" asChild className="text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors duration-300">
                <Link href={link.href} className="text-md font-medium">{link.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <PanelLeft className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-sidebar text-sidebar-foreground p-6 flex flex-col">
                <SheetHeader className="mb-6 border-b border-sidebar-border pb-4">
                  <SheetTitle asChild>
                     <Link href="/" className="flex items-center space-x-2 text-sidebar-primary hover:text-sidebar-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        <BookOpenText className="h-7 w-7" />
                        <span className="text-2xl font-headline font-bold">MuseBlog</span>
                      </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-3 flex-grow">
                  {navLinksBase.map((link) => (
                    <Button
                      key={link.href}
                      variant="ghost"
                      asChild
                      className="justify-start text-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}
                </nav>
                {/* Removed the dev-only toggle button for admin view */}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
