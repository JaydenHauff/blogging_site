import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/admin/dashboard', label: 'Admin' }, // Temporary link for admin access
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors">
            <BookOpenText className="h-8 w-8" />
            <span className="text-3xl font-headline font-bold">MuseBlog</span>
          </Link>
          <nav className="hidden md:flex space-x-2">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" asChild className="text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300">
                <Link href={link.href} className="text-lg font-medium">{link.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="md:hidden">
            {/* Mobile menu button placeholder */}
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
