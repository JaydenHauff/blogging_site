
import type { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TranslucentContainer from '@/components/ui/translucent-container';
import { CalendarDays, UserCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BlogPostCardProps {
  post: BlogPost;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, orientation = 'horizontal', className }) => {
  const commonContainerProps = {
    baseColor: "card" as const,
    backgroundOpacity: 85,
    shadow: "shadow-xl hover:shadow-2xl transition-shadow duration-300",
    rounded: "rounded-lg",
    padding: "p-0", // Padding will be handled inside
  };

  if (orientation === 'vertical') {
    return (
      <TranslucentContainer
        {...commonContainerProps}
        className={cn("overflow-hidden h-full flex flex-col group border border-border/40", className)}
      >
        {post.imageUrl && (
          <div className="relative w-full aspect-square overflow-hidden"> {/* Changed h-56 to aspect-square */}
            <Image
              src={post.imageUrl}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
              data-ai-hint={post.imageHint || 'blog image'}
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
          {post.category && (
             <Badge variant="secondary" className="mb-2 self-start bg-accent/10 text-accent hover:bg-accent/20 font-medium px-2.5 py-1">{post.category}</Badge>
          )}
          <h3 className="text-xl font-headline font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
            <Link href={`/blogs/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          
          <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-3">
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1.5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <p className="text-foreground/80 mb-4 line-clamp-4 flex-grow text-sm">{post.excerpt}</p>
          
          <Button asChild variant="link" className="p-0 self-start text-primary hover:text-accent font-semibold transition-colors text-sm">
            <Link href={`/blogs/${post.slug}`}>
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TranslucentContainer>
    );
  }

  // Horizontal card layout (default)
  return (
    <TranslucentContainer
      {...commonContainerProps}
      className={cn("overflow-hidden group border border-border/40", className)}
    >
      <div className="md:flex">
        {post.imageUrl && (
          <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
              data-ai-hint={post.imageHint || 'blog preview'}
            />
          </div>
        )}
        <div className={cn("p-6 flex flex-col flex-grow", post.imageUrl ? "md:w-3/5" : "w-full")}>
          {post.category && (
             <Badge variant="secondary" className="mb-2 self-start bg-accent/10 text-accent hover:bg-accent/20 font-medium px-2.5 py-1">{post.category}</Badge>
          )}
          <h3 className="text-xl lg:text-2xl font-headline font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
            <Link href={`/blogs/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          
          <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-3">
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1.5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          <p className="text-foreground/80 mb-4 line-clamp-3 flex-grow text-sm">{post.excerpt}</p>
          
          <Button asChild variant="link" className="p-0 self-start text-primary hover:text-accent font-semibold transition-colors text-sm">
            <Link href={`/blogs/${post.slug}`}>
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </TranslucentContainer>
  );
};

export default BlogPostCard;
