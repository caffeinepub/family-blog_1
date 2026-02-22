import { Outlet, useNavigate } from '@tanstack/react-router';
import { Home, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <header className="relative w-full overflow-hidden">
        <img
          src="/assets/generated/header-banner.dim_1200x300.png"
          alt="Family Blog Header"
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate({ to: '/' })}
            className="text-lg font-semibold hover:bg-accent"
          >
            <Home className="mr-2 h-5 w-5" />
            Our Family Blog
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © {new Date().getFullYear()} Our Family Blog • Built with{' '}
            <Heart className="h-4 w-4 fill-coral text-coral inline" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
