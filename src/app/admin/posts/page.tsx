
'use client';
import { useActionState, useEffect } from 'react';
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MOCK_BLOG_POSTS } from '@/lib/constants';
import { deletePostAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit3, Trash2, PlusCircle } from 'lucide-react';
import type { BlogPost } from '@/types';

interface PostActionState {
  message: string | null;
  isError?: boolean;
}

function DeletePostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
  const { toast } = useToast();
  const initialState: PostActionState = { message: null };
  const [state, formAction] = useActionState(deletePostAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error Deleting Post' : 'Post Action',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the post: "${postTitle}"? This action is simulated.`)) {
      const formData = new FormData();
      formData.append('id', postId);
      formAction(formData);
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} aria-label={`Delete post ${postTitle}`}>
      <Trash2 className="h-4 w-4 mr-2" />
      Delete
    </Button>
  );
}

export default function ManagePostsPage() {
  const posts: BlogPost[] = MOCK_BLOG_POSTS; // In a real app, fetch from API

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <SectionTitle 
          title="Manage Blog Posts" 
          subtitle={`You have ${posts.length} blog post(s).`}
          alignment="left"
          className="mb-0"
        />
        <Button asChild>
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
          </Link>
        </Button>
      </div>

      {posts.length > 0 ? (
        <TranslucentContainer 
          baseColor="card" 
          backgroundOpacity={70} 
          padding="p-0" // Table will have its own padding
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.category || 'N/A'}</TableCell>
                  <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/posts/${post.slug}/edit`}>
                        <Edit3 className="h-4 w-4 mr-2" /> Edit
                      </Link>
                    </Button>
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TranslucentContainer>
      ) : (
         <TranslucentContainer 
            baseColor="card" 
            backgroundOpacity={70} 
            padding="p-8 md:p-10"
            className="text-center"
          >
            <p className="text-lg text-foreground/80">No blog posts found. Get started by creating one!</p>
         </TranslucentContainer>
      )}
      <div className="mt-6 p-4 bg-secondary/30 rounded-md text-sm text-muted-foreground">
          <strong>Note:</strong> "Delete" actions are simulated (logged to console) and do not persistently alter the mock post list on page reload.
          A real backend database is required for persistent post management.
      </div>
    </div>
  );
}
