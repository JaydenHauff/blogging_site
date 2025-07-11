
import { MOCK_BLOG_POSTS, MOCK_COMMENTS } from '@/lib/constants';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import SocialShareButtons from '@/components/blog/social-share-buttons';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle, Tag, Edit3, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import CommentList from '@/components/blog/comment-list';
import { CommentForm } from '@/components/forms/comment-form';
import SectionTitle from '@/components/ui/section-title';

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = MOCK_BLOG_POSTS.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const postComments = MOCK_COMMENTS.filter(comment => comment.blogPostId === post.id && comment.isApproved)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://museblog.com/blogs/${post.slug}`;

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <article>
          <header className="mb-8 md:mb-12">
            {post.category && (
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary text-sm px-3 py-1">{post.category}</Badge>
            )}
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center text-md text-muted-foreground space-x-4 sm:space-x-6">
              <div className="flex items-center">
                <UserCircle className="h-5 w-5 mr-2 text-accent" />
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-accent" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </header>

          {post.imageUrl && (
            <div className="relative w-full h-64 md:h-96 mb-8 md:mb-12 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={post.imageUrl}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint={post.imageHint || 'blog header'}
              />
            </div>
          )}
          
          <TranslucentContainer 
            className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-accent hover:prose-a:text-primary prose-strong:text-foreground/90"
            baseColor="card"
            backgroundOpacity={70}
            padding="p-6 md:p-8"
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </TranslucentContainer>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Tag className="h-5 w-5 text-accent mr-1" />
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-accent text-accent">{tag}</Badge>
              ))}
            </div>
          )}

          <Separator className="my-8 md:my-12" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <SocialShareButtons url={currentUrl} title={post.title} />
            <Button variant="outline" asChild>
              <Link href={`/admin/posts/${post.slug}/edit`}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Post (Admin)
              </Link>
            </Button>
          </div>
        </article>

        <section className="mt-12 md:mt-16">
          <div className="flex items-center mb-6">
            <MessageSquare className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-headline font-semibold text-primary">
              Comments ({postComments.length})
            </h2>
          </div>
          <TranslucentContainer baseColor="card" backgroundOpacity={80} padding="p-6 md:p-8" shadow="shadow-xl" rounded="rounded-lg">
            <CommentForm blogPostId={post.id} blogPostSlug={post.slug} />
            <Separator className="my-8" />
            <CommentList comments={postComments} />
          </TranslucentContainer>
        </section>
      </div>
    </div>
  );
}
