
'use client';
import { useActionState, useEffect, useState, useRef } from 'react';
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Button } from '@/components/ui/button';
import { MOCK_COMMENTS, MOCK_BLOG_POSTS } from '@/lib/constants';
import { deleteCommentAction, replyToCommentAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, MessageSquareReply, FileText, User, CalendarDays } from 'lucide-react';
import type { Comment } from '@/types';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

interface CommentActionState {
  message: string | null;
  isError?: boolean;
  errors?: any;
}

function DeleteCommentButton({ commentId, commentText }: { commentId: string; commentText: string }) {
  const { toast } = useToast();
  const initialState: CommentActionState = { message: null };
  const [state, formAction] = useActionState(deleteCommentAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error Deleting Comment' : 'Comment Action',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to "delete" the comment: "${commentText.substring(0, 50)}..."? This action is simulated.`)) {
      const formData = new FormData();
      formData.append('commentId', commentId);
      formAction(formData);
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} aria-label={`Delete comment ${commentText.substring(0,20)}`}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

function ReplySubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
        {pending ? 'Submitting Reply...' : 'Submit Reply'}
        </Button>
    );
}

function ReplyCommentDialog({ comment, open, onOpenChange }: { comment: Comment; open: boolean; onOpenChange: (open: boolean) => void; }) {
  const { toast } = useToast();
  const initialState: CommentActionState = { message: null };
  const [state, formAction] = useActionState(replyToCommentAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error Replying' : 'Reply Submitted',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      if (!state.isError) {
        onOpenChange(false); // Close dialog on success
      }
    }
  }, [state, toast, onOpenChange]);
  
  const currentReplyText = comment.replyText || '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Reply to Comment by {comment.authorName}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground italic p-2 border rounded-md bg-secondary/30">
          Original: "{comment.text.length > 100 ? `${comment.text.substring(0, 100)}...` : comment.text}"
        </p>
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="commentId" value={comment.id} />
          <div>
            <Label htmlFor="replyText">Your Reply</Label>
            <Textarea
              id="replyText"
              name="replyText"
              rows={4}
              required
              placeholder="Type your reply here..."
              className="mt-1"
              defaultValue={currentReplyText}
            />
            {state.errors?.replyText && <p className="text-sm text-red-500 mt-1">{state.errors.replyText[0]}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <ReplySubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export default function ManageCommentsPage() {
  const comments: Comment[] = MOCK_COMMENTS.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  const handleOpenReplyDialog = (comment: Comment) => {
    setSelectedComment(comment);
    setIsReplyDialogOpen(true);
  };

  const getPostTitle = (blogPostId: string) => {
    const post = MOCK_BLOG_POSTS.find(p => p.id === blogPostId);
    return post ? post.title : 'Unknown Post';
  };


  return (
    <>
      <SectionTitle 
        title="Manage Comments" 
        subtitle={`Found ${comments.length} comments across all blog posts.`}
        alignment="left"
      />
      {comments.length > 0 ? (
        <TranslucentContainer 
          baseColor="card" 
          backgroundOpacity={80} 
          padding="p-0" 
          shadow="shadow-xl"
          rounded="rounded-lg"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">Comment</TableHead>
                <TableHead className="hidden md:table-cell w-[15%]">Author</TableHead>
                <TableHead className="hidden lg:table-cell w-[20%]">Blog Post</TableHead>
                <TableHead className="hidden md:table-cell w-[15%]">Date</TableHead>
                <TableHead className="w-[15%]">Reply</TableHead>
                <TableHead className="text-right w-[10%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium align-top">
                    <p className="line-clamp-3">{comment.text}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell align-top">
                     <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" /> 
                        {comment.authorName}
                     </div>
                    {comment.authorEmail && <p className="text-xs text-muted-foreground truncate">{comment.authorEmail}</p>}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell align-top">
                    <Link href={`/blogs/${comment.blogPostSlug}`} className="hover:underline text-primary flex items-start">
                        <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-muted-foreground" /> 
                        <span className="line-clamp-2">{getPostTitle(comment.blogPostId)}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell align-top">
                    <div className="flex items-center text-xs">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        {new Date(comment.date).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleTimeString()}</p>
                  </TableCell>
                  <TableCell className="align-top">
                    {comment.replyText ? (
                        <p className="text-xs text-green-600 line-clamp-2 italic">"{comment.replyText}"</p>
                    ): (
                        <p className="text-xs text-muted-foreground">No reply yet.</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1 align-top">
                    <Button variant="outline" size="sm" onClick={() => handleOpenReplyDialog(comment)}>
                      <MessageSquareReply className="h-4 w-4" />
                    </Button>
                    <DeleteCommentButton commentId={comment.id} commentText={comment.text} />
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
            shadow="shadow-xl"
            rounded="rounded-lg"
          >
          <p className="text-lg text-foreground/80">No comments found.</p>
        </TranslucentContainer>
      )}
      <div className="mt-6 p-4 bg-secondary/30 rounded-md text-sm text-muted-foreground">
          <strong>Note:</strong> Comment submissions, replies, and deletions are simulated (logged to console) and do not persistently alter the mock comment list on page reload.
          A real backend database is required for persistent comment management.
      </div>
      {selectedComment && (
        <ReplyCommentDialog
          comment={selectedComment}
          open={isReplyDialogOpen}
          onOpenChange={setIsReplyDialogOpen}
        />
      )}
    </>
  );
}
