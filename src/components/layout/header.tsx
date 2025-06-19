
'use client'; // Required for useState

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenText, LogIn, PanelLeft } from 'lucide-react'; // Added LogIn for potential future use, PanelLeft for mobile
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet" // For mobile menu

const navLinksBase = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact Us' },
];

const adminLink = { href: '/admin/dashboard', label: 'Admin' };

export function Header() {
  // Mock authentication status - in a real app, this would come from an auth provider/context
  const [isAdmin, setIsAdmin] = useState(true); // Changed to true to show admin button
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // To test admin view, you can temporarily set isAdmin to true here, e.g., by checking localStorage or a query param.
    // For example: localStorage.setItem('isAdmin', 'true');
    // const adminStatus = localStorage.getItem('isAdmin') === 'true';
    // setIsAdmin(adminStatus);
  }, []);

  const currentNavLinks = isAdmin ? [...navLinksBase, adminLink] : navLinksBase;

  if (!isMounted) {
    // Avoid rendering mismatch during hydration by returning a simplified header or null
    return (
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors">
              <BookOpenText className="h-8 w-8" />
              <span className="text-3xl font-headline font-bold">MuseBlog</span>
            </Link>
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <PanelLeft className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors">
            <BookOpenText className="h-8 w-8" />
            <span className="text-3xl font-headline font-bold">MuseBlog</span>
          </Link>
          <nav className="hidden md:flex space-x-1">
            {currentNavLinks.map((link) => (
              <Button key={link.href} variant="ghost" asChild className="text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300">
                <Link href={link.href} className="text-md font-medium">{link.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <PanelLeft className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-sidebar text-sidebar-foreground p-6">
                <div className="mb-6">
                  <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <BookOpenText className="h-7 w-7" />
                    <span className="text-2xl font-headline font-bold">MuseBlog</span>
                  </Link>
                </div>
                <nav className="flex flex-col space-y-3">
                  {currentNavLinks.map((link) => (
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
                {/* Example of how to toggle admin for demo, remove for production */}
                <div className="mt-8 border-t border-sidebar-border pt-4">
                  <Button onClick={() => setIsAdmin(!isAdmin)} variant="outline" className="w-full">
                    Toggle Admin View (Dev)
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Admin link visibility is currently mocked. In a real app, this would be based on user authentication and roles. By default, the 'Admin' link is hidden.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
