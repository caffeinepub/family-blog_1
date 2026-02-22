import { useState } from 'react';
import { useAddComment } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquarePlus, Loader2 } from 'lucide-react';

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const addComment = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authorName.trim() || !content.trim()) {
      return;
    }

    try {
      await addComment.mutateAsync({
        postId,
        authorName: authorName.trim(),
        content: content.trim(),
      });
      
      // Clear form after successful submission
      setAuthorName('');
      setContent('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  return (
    <Card className="border-2 border-coral/30">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5 text-coral" />
          Add a Comment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authorName">Your Name</Label>
            <Input
              id="authorName"
              type="text"
              placeholder="Enter your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              disabled={addComment.isPending}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Comment</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={addComment.isPending}
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={addComment.isPending || !authorName.trim() || !content.trim()}
            className="bg-coral hover:bg-coral/90 text-white w-full sm:w-auto"
          >
            {addComment.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Post Comment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
