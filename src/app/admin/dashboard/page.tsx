
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, FileText, MessageSquare, Tags, Settings, LogOut, PlusCircle, Edit, Eye, MailCheck } from 'lucide-react';
import { MOCK_BLOG_POSTS, MOCK_SUBSCRIBERS } from '@/lib/constants';

const stats = [
  { title: 'Total Blogs', value: MOCK_BLOG_POSTS.length, icon: FileText, color: 'text-primary', href: '/admin/posts' },
  { title: 'Total Subscribers', value: MOCK_SUBSCRIBERS.length, icon: MailCheck, color: 'text-accent', href: '/admin/subscribers' }, 
  { title: 'Total Comments', value: 450, icon: MessageSquare, color: 'text-green-500', href: '#' }, // Placeholder
  { title: 'Categories', value: Array.from(new Set(MOCK_BLOG_POSTS.map(p => p.category).filter(Boolean))).length, icon: Tags, color: 'text-yellow-500', href: '/admin/categories' },
];

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <SectionTitle title="Admin Dashboard" subtitle="Manage your MuseBlog content and users." alignment="left" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href || '#'} className="block">
            <Card className="bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TranslucentContainer baseColor="card" backgroundOpacity={70} padding="p-6 md:p-8">
          <h3 className="text-2xl font-headline font-semibold text-primary mb-4">Blog Management</h3>
          <p className="text-muted-foreground mb-6">Create, edit, and delete blog posts. Manage categories and tags.</p>
          <div className="space-y-3">
            <Button asChild className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/admin/posts/new"><PlusCircle className="mr-2 h-4 w-4" /> Create New Post</Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/posts"><Edit className="mr-2 h-4 w-4" /> Manage Posts</Link>
            </Button>
             <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/categories"><Tags className="mr-2 h-4 w-4" /> Manage Categories</Link>
            </Button>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold text-foreground mb-2">Content Editor Note:</h4>
            <p className="text-sm text-muted-foreground">
              The "Create New Post" page uses Tiptap for rich text editing.
            </p>
          </div>
        </TranslucentContainer>

        <TranslucentContainer baseColor="card" backgroundOpacity={70} padding="p-6 md:p-8">
          <h3 className="text-2xl font-headline font-semibold text-primary mb-4">User & Site Management</h3>
          <p className="text-muted-foreground mb-6">Manage subscribers, site settings, and admin access.</p>
          <div className="space-y-3">
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/subscribers"><Users className="mr-2 h-4 w-4" /> Manage Subscribers</Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" /> Site Settings (Coming Soon)</Link>
            </Button>
             <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/transfer-access"><Eye className="mr-2 h-4 w-4" /> Transfer Admin Access (Coming Soon)</Link>
            </Button>
            <Button variant="destructive" className="w-full justify-start" disabled>
              <LogOut className="mr-2 h-4 w-4" /> Logout (Placeholder)
            </Button>
          </div>
           <div className="mt-6">
            <h4 className="font-semibold text-foreground mb-2">Security Note:</h4>
            <p className="text-sm text-muted-foreground">
              This admin panel and all associated routes (e.g., /admin/*) must be protected by robust authentication and authorization (e.g., JWT-based with role checks via Next.js Middleware). Ensure only authorized administrators can access these sections.
            </p>
          </div>
        </TranslucentContainer>
      </div>
    </div>
  );
}
