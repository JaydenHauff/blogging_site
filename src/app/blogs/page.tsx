
import BlogPostCard from '@/components/blog/blog-post-card';
import SectionTitle from '@/components/ui/section-title';
import { MOCK_BLOG_POSTS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react'; // Removed Filter icon as it's not used

export default function BlogsPage() {
  // TODO: Implement actual filtering, search, and pagination
  const posts = MOCK_BLOG_POSTS;
  const categories = Array.from(new Set(MOCK_BLOG_POSTS.map(p => p.category).filter(Boolean)));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <SectionTitle title="Our Blog Archive" subtitle="Explore a world of ideas, stories, and insights from our talented contributors." />

      {/* Filters and Search */}
      <div className="mb-12 p-6 bg-card/70 backdrop-blur-sm rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-1">
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Search Posts</label>
            <div className="relative">
              <Input type="text" id="search" placeholder="Keywords, title, author..." className="pl-10 bg-input/80" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">Filter by Category</label>
            <Select>
              <SelectTrigger id="category" className="w-full bg-input/80">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category!}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-foreground mb-1">Sort by Date</label>
            <Select>
              <SelectTrigger id="date" className="w-full bg-input/80">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Blog Post Grid */}
      {posts.length > 0 ? (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8"> {/* Adjusted for horizontal cards */}
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} orientation="horizontal" />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg">No blog posts found. Check back soon!</p>
      )}

      {/* Pagination (Placeholder) */}
      {posts.length > 0 && (
        <div className="mt-16 flex justify-center space-x-2">
          <Button variant="outline" disabled>Previous</Button>
          <Button variant="outline">1</Button>
          <Button variant="outline" disabled>Next</Button>
        </div>
      )}
    </div>
  );
}
