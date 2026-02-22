import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreatePost } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string; authorName?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; content?: string; authorName?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!authorName.trim()) {
      newErrors.authorName = 'Author name is required';
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
      await createPost.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        authorName: authorName.trim(),
      });
      navigate({ to: '/' });
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="hover:bg-accent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      {/* Form Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <img src="/assets/generated/heart-icon.dim_64x64.png" alt="" className="h-8 w-8" />
            Create New Post
          </CardTitle>
          <CardDescription className="text-base">Share a new story with your family</CardDescription>
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

            {/* Author Field */}
            <div className="space-y-2">
              <Label htmlFor="authorName" className="text-base font-semibold">
                Author Name
              </Label>
              <Input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name..."
                className={`text-base ${errors.authorName ? 'border-destructive' : ''}`}
              />
              {errors.authorName && <p className="text-sm text-destructive">{errors.authorName}</p>}
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
                disabled={createPost.isPending}
                className="bg-coral hover:bg-coral/90 text-white"
              >
                <Save className="mr-2 h-5 w-5" />
                {createPost.isPending ? 'Publishing...' : 'Publish Post'}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate({ to: '/' })}>
                Cancel
              </Button>
            </div>

            {createPost.isError && (
              <p className="text-destructive text-sm">Failed to create post. Please try again.</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
