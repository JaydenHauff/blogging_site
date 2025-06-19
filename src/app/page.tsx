import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/section-title';
import BlogPostCard from '@/components/blog/blog-post-card';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { MOCK_BLOG_POSTS, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import TranslucentContainer from '@/components/ui/translucent-container';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const recentPosts = MOCK_BLOG_POSTS.slice(0, 3);

  return (
    <div className="space-y-24 md:space-y-32 pb-16">
      {/* Hero Section */}
      <section 
        className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
        data-ai-hint="abstract creative background"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <TranslucentContainer 
            className="max-w-3xl mx-auto" 
            padding="p-8 md:p-12"
            baseColor="white"
            backgroundOpacity={10}
            blurStrength="md"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-headline font-extrabold mb-6 text-primary">
              Welcome to {SITE_NAME}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-10 max-w-2xl mx-auto">
              {SITE_DESCRIPTION}
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground transition-colors duration-300 text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105">
              <Link href="/blogs">
                Explore Our Blogs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </TranslucentContainer>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Latest Musings" subtitle="Discover our most recent articles and dive into compelling stories." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
        {MOCK_BLOG_POSTS.length > 3 && (
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10 transition-colors duration-300">
              <Link href="/blogs">View All Posts</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter Subscription Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/5 to-accent/5">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TranslucentContainer 
            className="max-w-2xl mx-auto"
            padding="p-8 md:p-12"
            baseColor="background"
            backgroundOpacity={50}
            blurStrength="lg"
          >
            <SectionTitle
              title="Stay Inspired"
              subtitle="Subscribe to our newsletter for the latest articles, tips, and creative insights delivered straight to your inbox."
              className="mb-8"
            />
            <NewsletterForm />
          </TranslucentContainer>
        </div>
      </section>
    </div>
  );
}
