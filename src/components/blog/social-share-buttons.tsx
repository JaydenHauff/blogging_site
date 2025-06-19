'use client';

import { Twitter, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast hook is available

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ url, title }) => {
  const { toast } = useToast();

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Link Copied!", description: "The blog post URL has been copied to your clipboard." });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({ title: "Error", description: "Failed to copy link.", variant: "destructive" });
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      <Button variant="outline" size="icon" asChild className="transition-colors hover:border-primary hover:text-primary">
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild className="transition-colors hover:border-primary hover:text-primary">
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild className="transition-colors hover:border-primary hover:text-primary">
        <a href={`mailto:?subject=${encodedTitle}&body=Check%20out%20this%20article:%20${encodedUrl}`} aria-label="Share via Email">
          <Mail className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" onClick={copyLink} className="transition-colors hover:border-primary hover:text-primary" aria-label="Copy link">
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SocialShareButtons;
