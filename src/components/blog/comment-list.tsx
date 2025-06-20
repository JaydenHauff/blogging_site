
import type { Comment } from '@/types';
import CommentItem from './comment-item';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p className="text-muted-foreground mt-4">No comments yet. Be the first to share your thoughts!</p>;
  }

  return (
    <div className="mt-6 space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
