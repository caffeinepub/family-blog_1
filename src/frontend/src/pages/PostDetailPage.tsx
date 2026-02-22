import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetPost, useDeletePost, useLikePost } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, Edit, Trash2, Heart, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import CommentsList from '../components/CommentsList';
import CommentForm from '../components/CommentForm';

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/post/$id' });
  const { data: post, isLoading, error } = useGetPost(id);
  const deletePost = useDeletePost();
  const likePost = useLikePost();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(Number(timestamp) / 1000000);
      return format(date, 'MMMM d, yyyy \'at\' h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(id);
      navigate({ to: '/' });
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleLike = async () => {
    try {
      await likePost.mutateAsync(id);
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <p className="text-destructive text-lg">Post not found or failed to load.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="hover:bg-accent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      {/* Post Content */}
      <Card className="border-2">
        <CardHeader className="space-y-4">
          <div className="flex items-start gap-3">
            <img src="/assets/generated/heart-icon.dim_64x64.png" alt="" className="h-8 w-8 mt-1 flex-shrink-0" />
            <CardTitle className="text-4xl leading-tight text-foreground">{post.title}</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="text-base">{post.authorName}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-base">{formatDate(post.publicationDate)}</span>
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Like Section */}
          <Separator />
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLike}
              disabled={likePost.isPending}
              variant="outline"
              size="lg"
              className="border-coral text-coral hover:bg-coral hover:text-white transition-colors"
            >
              {likePost.isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <img src="/assets/generated/heart-icon.dim_64x64.png" alt="" className="mr-2 h-5 w-5" />
              )}
              <span className="font-semibold">{Number(post.likes)}</span>
              <span className="ml-1">{Number(post.likes) === 1 ? 'Like' : 'Likes'}</span>
            </Button>
          </div>

          {/* Action Buttons */}
          <Separator />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/edit/$id', params: { id: post.id } })}
              className="border-coral text-coral hover:bg-coral hover:text-white"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="space-y-6">
        <CommentsList comments={post.comments} />
        <CommentForm postId={post.id} />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={deletePost.isPending}
      />
    </div>
  );
}
