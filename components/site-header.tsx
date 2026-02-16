import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>
        <nav className="flex items-center">
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/generate">Generuj wezwanie</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
