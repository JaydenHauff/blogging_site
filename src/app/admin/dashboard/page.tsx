import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, FileText, MessageSquare, Tags, Settings, LogOut, PlusCircle, Edit } from 'lucide-react';

// Placeholder stats
const stats = [
  { title: 'Total Blogs', value: MOCK_BLOG_POSTS.length, icon: FileText, color: 'text-primary' },
  { title: 'Total Users', value: 150, icon: Users, color: 'text-accent' }, // Example value
  { title: 'Total Comments', value: 450, icon: MessageSquare, color: 'text-green-500' }, // Example value
  { title: 'Categories', value: 5, icon: Tags, color: 'text-yellow-500' }, // Example value
];

import { MOCK_BLOG_POSTS } from '@/lib/constants'; // Ensure this is imported if used for length

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <SectionTitle title="Admin Dashboard" subtitle="Manage your MuseBlog content and users." alignment="left" />

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card/70 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Blog Management */}
        <TranslucentContainer baseColor="card" backgroundOpacity={70}>
          <h3 className="text-2xl font-headline font-semibold text-primary mb-4">Blog Management</h3>
          <p className="text-muted-foreground mb-6">Create, edit, and delete blog posts. Manage categories and tags.</p>
          <div className="space-y-3">
            <Button asChild className="w-full justify-start">
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
            <h4 className="font-semibold text-foreground mb-2">Rich Text Editor Note:</h4>
            <p className="text-sm text-muted-foreground">
              A rich text editor (e.g., Quill or TinyMCE) would be integrated here for creating and editing blog posts, supporting text formatting, images, and embeds.
            </p>
          </div>
        </TranslucentContainer>

        {/* User & Site Management */}
        <TranslucentContainer baseColor="card" backgroundOpacity={70}>
          <h3 className="text-2xl font-headline font-semibold text-primary mb-4">User & Site Management</h3>
          <p className="text-muted-foreground mb-6">Manage users, site settings, and admin access.</p>
          <div className="space-y-3">
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/users"><Users className="mr-2 h-4 w-4" /> Manage Users</Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" /> Site Settings</Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/transfer-access"><Settings className="mr-2 h-4 w-4" /> Transfer Admin Access</Link>
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" /> Logout (Placeholder)
            </Button>
          </div>
           <div className="mt-6">
            <h4 className="font-semibold text-foreground mb-2">Security Note:</h4>
            <p className="text-sm text-muted-foreground">
              This admin panel should be protected by JWT-based authentication and role-based access control. Middleware would restrict access to admin users only.
            </p>
          </div>
        </TranslucentContainer>
      </div>
    </div>
  );
}
