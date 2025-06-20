
import type { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TranslucentContainer from '@/components/ui/translucent-container';
import { CalendarDays, UserCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BlogPostCardProps {
  post: BlogPost;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, orientation = 'horizontal', className }) => {
  if (orientation === 'vertical') {
    return (
      <TranslucentContainer
        className={cn("overflow-hidden h-full flex flex-col group", className)}
        padding="p-0"
        baseColor="card"
        backgroundOpacity={80}
        shadow="shadow-lg hover:shadow-xl transition-shadow duration-300"
        rounded="rounded-lg"
      >
        {post.imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
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
             <Badge variant="secondary" className="mb-2 self-start bg-primary/20 text-primary hover:bg-primary/30">{post.category}</Badge>
          )}
          <h3 className="text-2xl font-headline font-semibold text-primary mb-2">
            <Link href={`/blogs/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1.5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <p className="text-foreground/80 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
          
          <Button asChild variant="link" className="p-0 self-start text-accent hover:text-primary transition-colors">
            <Link href={`/blogs/${post.slug}`}>
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TranslucentContainer>
    );
  }

  // Horizontal card layout
  return (
    <TranslucentContainer
      className={cn("overflow-hidden group", className)}
      baseColor="card"
      backgroundOpacity={70}
      shadow="shadow-lg hover:shadow-xl transition-shadow duration-300"
      rounded="rounded-lg"
      padding="p-0" 
    >
      <div className="md:flex">
        {post.imageUrl && (
          <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
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
        <div className={cn("p-6 flex flex-col flex-grow", post.imageUrl ? "md:w-2/3" : "w-full")}>
          {post.category && (
             <Badge variant="secondary" className="mb-2 self-start bg-primary/20 text-primary hover:bg-primary/30">{post.category}</Badge>
          )}
          <h3 className="text-2xl font-headline font-semibold text-primary mb-2">
            <Link href={`/blogs/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-3 space-x-3 sm:space-x-4">
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1.5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          <p className="text-foreground/80 mb-4 line-clamp-2 sm:line-clamp-3 flex-grow">{post.excerpt}</p>
          
          <Button asChild variant="link" className="p-0 self-start text-accent hover:text-primary transition-colors">
            <Link href={`/blogs/${post.slug}`}>
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </TranslucentContainer>
  );
};

function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(' ');
}


export default BlogPostCard;
