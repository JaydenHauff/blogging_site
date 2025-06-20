
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/section-title';
import BlogPostCard from '@/components/blog/blog-post-card';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { MOCK_BLOG_POSTS, SITE_NAME, SITE_DESCRIPTION, MOCK_TEAM_MEMBERS } from '@/lib/constants';
import TranslucentContainer from '@/components/ui/translucent-container';
import { ArrowRight, Zap, Users, Edit3, BarChart3, BookOpenCheck, Lightbulb, MessageSquareHeart, Rocket } from 'lucide-react';
import TeamMemberCard from '@/components/about/team-member-card'; 

const featuredCategories = [
  { name: 'Technology', icon: Zap, description: 'Latest in tech, AI, and gadgets.', slug: 'technology', hint: "modern circuit" },
  { name: 'Creative Writing', icon: Edit3, description: 'Tips, inspiration, and showcases.', slug: 'creative-writing', hint: "elegant pen" },
  { name: 'Personal Growth', icon: BarChart3, description: 'Insights for a better you.', slug: 'personal-growth', hint: "person silhouette sunrise" },
  { name: 'Book Reviews', icon: BookOpenCheck, description: 'Deep dives into compelling reads.', slug: 'book-reviews', hint: "stack books" },
];

const whyMuseBlog = [
  { title: "Inspiring Content", icon: Lightbulb, text: "Curated articles to spark your curiosity and creativity." },
  { title: "Diverse Voices", icon: Users, text: "A platform for writers from all backgrounds to share their unique perspectives." },
  { title: "Engaging Community", icon: MessageSquareHeart, text: "Connect with fellow readers and writers in a supportive environment." },
  { title: "Modern Platform", icon: Rocket, text: "Enjoy a seamless reading experience on our beautifully designed site." },
];

export default function Home() {
  const recentPosts = MOCK_BLOG_POSTS.slice(0, 3);
  const authorSpotlight = MOCK_TEAM_MEMBERS.length > 0 ? MOCK_TEAM_MEMBERS[0] : null;

  return (
    <div className="space-y-24 md:space-y-32 pb-16">
      {/* Hero Section */}
      <section 
        className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }} 
        data-ai-hint="bright abstract geometric" 
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 backdrop-blur-sm"></div> {/* Adjusted overlay for light theme */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <TranslucentContainer 
            className="max-w-3xl mx-auto" 
            padding="p-8 md:p-12"
            baseColor="background" 
            backgroundOpacity={60} 
            blurStrength="md"
            shadow="shadow-2xl"
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
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8"> 
          {recentPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} orientation="horizontal" />
          ))}
        </div>
        {MOCK_BLOG_POSTS.length > 3 && (
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
              <Link href="/blogs">View All Posts</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Featured Categories Section */}
      <section className="py-16 md:py-24 bg-muted/50"> 
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Explore Topics" subtitle="Dive into categories that pique your interest." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map(category => (
              <TranslucentContainer
                key={category.slug}
                baseColor="card"
                backgroundOpacity={90} 
                padding="p-6"
                className="text-center group hover:scale-105 transition-transform duration-300"
                shadow="shadow-xl"
                rounded="rounded-lg"
              >
                <Link href={`/blogs?category=${category.slug}`} className="flex flex-col items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <category.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-headline font-semibold text-primary mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </Link>
              </TranslucentContainer>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why MuseBlog Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={`Why ${SITE_NAME}?`} subtitle="Experience content that enlightens and connects." />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyMuseBlog.map((item) => (
            <TranslucentContainer 
              key={item.title}
              baseColor="card"
              backgroundOpacity={95} 
              padding="p-6"
              className="flex flex-col items-center text-center"
            >
              <item.icon className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-headline font-semibold text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/80">{item.text}</p>
            </TranslucentContainer>
          ))}
        </div>
      </section>

      {/* Author Spotlight Section */}
      {authorSpotlight && (
        <section className="py-16 md:py-24 bg-secondary/30"> {/* secondary/30 provides a subtle bg variation */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Meet Our Voice" subtitle={`Get to know ${authorSpotlight.name}, one of the creative minds at ${SITE_NAME}.`} />
            <div className="max-w-xl mx-auto">
               <TeamMemberCard member={authorSpotlight} />
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Subscription Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/5 to-accent/5"> 
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TranslucentContainer 
            className="max-w-2xl mx-auto"
            padding="p-8 md:p-12"
            baseColor="card" 
            backgroundOpacity={80} 
            blurStrength="lg"
            shadow="shadow-xl"
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
