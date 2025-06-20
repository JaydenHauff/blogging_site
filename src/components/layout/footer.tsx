
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto bg-background/80 backdrop-blur-md border-t border-border/50"> {/* Adjusted opacity for light theme */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} MuseBlog. All rights reserved.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Crafted with <span role="img" aria-label="love">❤️</span> by AI and humans.</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary transition-colors duration-300">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary transition-colors duration-300">
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary transition-colors duration-300">
              <Link href="mailto:info@museblog.com" aria-label="Email">
                <Mail className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="text-center md:text-right text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors duration-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
