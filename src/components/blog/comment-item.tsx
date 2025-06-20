
import type { Comment } from '@/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { CornerDownRight } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const authorInitials = comment.authorName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card className="mb-4 bg-card/80 backdrop-blur-sm shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={comment.userAvatarUrl} alt={comment.authorName} />
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">{comment.authorName}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(comment.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">{comment.text}</p>
            
            {comment.replyText && (
              <Card className="mt-3 bg-secondary/50 border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-2">
                     <CornerDownRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-primary mb-0.5">Admin Reply:</p>
                      <p className="text-sm text-foreground/80 whitespace-pre-wrap">{comment.replyText}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentItem;
