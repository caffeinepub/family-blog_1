import { format } from 'date-fns';
import { MessageCircle, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Comment } from '../backend';

interface CommentsListProps {
  comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) / 1000000);
      return format(date, 'MMMM d, yyyy \'at\' h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-coral" />
        Comments ({comments.length})
      </h3>
      <div className="space-y-3">
        {comments.map((comment, index) => (
          <Card key={index} className="border-l-4 border-l-coral">
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <User className="h-4 w-4" />
                  {comment.authorName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(comment.timestamp)}
                </span>
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
