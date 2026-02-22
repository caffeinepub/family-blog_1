import { useNavigate } from '@tanstack/react-router';
import { useGetAllPosts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PenSquare, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: posts, isLoading, error } = useGetAllPosts();

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(Number(timestamp) / 1000000);
      return format(date, 'MMMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  const getExcerpt = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg">Failed to load posts. Please try again later.</p>
      </div>
    );
  }

  const sortedPosts = [...(posts || [])].sort((a, b) => {
    return Number(b.publicationDate) - Number(a.publicationDate);
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            Family Stories
            <img src="/assets/generated/heart-icon.dim_64x64.png" alt="" className="h-8 w-8" />
          </h1>
          <p className="text-muted-foreground text-lg">
            Sharing our adventures, memories, and moments together
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => navigate({ to: '/create' })}
          className="bg-coral hover:bg-coral/90 text-white shadow-md"
        >
          <PenSquare className="mr-2 h-5 w-5" />
          New Post
        </Button>
      </div>

      {/* Posts List */}
      {sortedPosts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-lg mb-4">No posts yet. Start sharing your family stories!</p>
            <Button onClick={() => navigate({ to: '/create' })} className="bg-coral hover:bg-coral/90 text-white">
              <PenSquare className="mr-2 h-4 w-4" />
              Write First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-coral/30"
              onClick={() => navigate({ to: '/post/$id', params: { id: post.id } })}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <img src="/assets/generated/heart-icon.dim_64x64.png" alt="" className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl mb-2 text-foreground hover:text-coral transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-4 text-base">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.authorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.publicationDate)}
                      </span>
                      <span className="flex items-center gap-1 text-coral font-medium">
                        <img src="/assets/generated/heart-icon.dim_64x64.png" alt="" className="h-4 w-4" />
                        {Number(post.likes)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{getExcerpt(post.content)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
