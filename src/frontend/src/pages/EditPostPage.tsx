import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetPost, useUpdatePost } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditPostPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/edit/$id' });
  const { data: post, isLoading, error } = useGetPost(id);
  const updatePost = useUpdatePost();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updatePost.mutateAsync({
        id,
        title: title.trim(),
        content: content.trim(),
      });
      navigate({ to: '/post/$id', params: { id } });
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
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
      <Button variant="ghost" onClick={() => navigate({ to: '/post/$id', params: { id } })} className="hover:bg-accent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Post
      </Button>

      {/* Form Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <img src="/assets/generated/heart-icon.dim_64x64.png" alt="" className="h-8 w-8" />
            Edit Post
          </CardTitle>
          <CardDescription className="text-base">
            Update your story • Author: {post.authorName} (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title..."
                className={`text-base ${errors.title ? 'border-destructive' : ''}`}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-base font-semibold">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story here..."
                rows={12}
                className={`text-base resize-none ${errors.content ? 'border-destructive' : ''}`}
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={updatePost.isPending}
                className="bg-coral hover:bg-coral/90 text-white"
              >
                <Save className="mr-2 h-5 w-5" />
                {updatePost.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate({ to: '/post/$id', params: { id } })}
              >
                Cancel
              </Button>
            </div>

            {updatePost.isError && (
              <p className="text-destructive text-sm">Failed to update post. Please try again.</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
