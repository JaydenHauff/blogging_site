
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, FileText, MessageSquare, Tags, Settings, LogOut, PlusCircle, Edit, Eye, MailCheck, BarChart3 } from 'lucide-react';
import { MOCK_BLOG_POSTS, MOCK_SUBSCRIBERS } from '@/lib/constants';

const stats = [
  { title: 'Total Blogs', value: MOCK_BLOG_POSTS.length, icon: FileText, color: 'text-primary', href: '/admin/posts' },
  { title: 'Total Subscribers', value: MOCK_SUBSCRIBERS.length, icon: MailCheck, color: 'text-accent', href: '/admin/subscribers' }, 
  { title: 'Categories', value: Array.from(new Set(MOCK_BLOG_POSTS.map(p => p.category).filter(Boolean))).length, icon: Tags, color: 'text-yellow-500', href: '/admin/categories' },
  { title: 'Comments (Mock)', value: 450, icon: MessageSquare, color: 'text-green-500', href: '#' }, // Placeholder
];

export default function AdminDashboardPage() {
  return (
    // Container and padding are handled by AdminLayout's SidebarInset
    <>
      <SectionTitle title="Admin Dashboard" subtitle="Manage your MuseBlog content and users." alignment="left" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href || '#'} className="block">
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color || 'text-primary'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TranslucentContainer baseColor="card" backgroundOpacity={80} padding="p-6 md:p-8" shadow="shadow-xl" rounded="rounded-lg">
          <h3 className="text-2xl font-headline font-semibold text-primary mb-4 flex items-center">
            <FileText className="mr-3 h-6 w-6" /> Blog Management
          </h3>
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
          <div className="mt-6 p-3 bg-secondary/30 rounded-md">
            <h4 className="font-semibold text-foreground mb-1">Content Editor Note:</h4>
            <p className="text-sm text-muted-foreground">
              The "Create New Post" page uses an advanced Tiptap editor for rich text formatting.
            </p>
          </div>
        </TranslucentContainer>

        <TranslucentContainer baseColor="card" backgroundOpacity={80} padding="p-6 md:p-8" shadow="shadow-xl" rounded="rounded-lg">
          <h3 className="text-2xl font-headline font-semibold text-primary mb-4 flex items-center">
            <Users className="mr-3 h-6 w-6" /> User & Site Management
          </h3>
          <p className="text-muted-foreground mb-6">Manage subscribers, site settings, and admin access.</p>
          <div className="space-y-3">
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/subscribers"><MailCheck className="mr-2 h-4 w-4" /> Manage Subscribers</Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" /> Site Settings (Coming Soon)</Link>
            </Button>
             <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/transfer-access"><Eye className="mr-2 h-4 w-4" /> Transfer Admin Access (CS)</Link>
            </Button>
          </div>
           <div className="mt-6 p-3 bg-secondary/30 rounded-md">
            <h4 className="font-semibold text-foreground mb-1">Security Note:</h4>
            <p className="text-sm text-muted-foreground">
              This admin panel must be protected by robust authentication (e.g., JWT-based with role checks via Next.js Middleware).
            </p>
          </div>
        </TranslucentContainer>
      </div>
       <TranslucentContainer baseColor="card" backgroundOpacity={80} padding="p-6 md:p-8" shadow="shadow-xl" rounded="rounded-lg" className="mt-8">
          <h3 className="text-2xl font-headline font-semibold text-primary mb-4 flex items-center">
            <BarChart3 className="mr-3 h-6 w-6" /> Site Analytics (Placeholder)
          </h3>
          <p className="text-muted-foreground mb-6">Overview of site traffic and engagement metrics.</p>
          <div className="text-center py-10">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Analytics charts and data will be displayed here.</p>
            <p className="text-xs text-muted-foreground mt-2">(Integration with an analytics service needed)</p>
          </div>
        </TranslucentContainer>
    </>
  );
}
