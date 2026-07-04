import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Search } from 'lucide-react';

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-white/5 px-6 py-3 flex items-center gap-4">
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          placeholder="Search exams, tech, languages…"
          className="w-full glass rounded-xl pl-9 pr-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-sm"
        />
      </div>
      <ThemeToggle />
      <SignedIn><UserButton /></SignedIn>
      <SignedOut><SignInButton mode="modal"><button className="btn-primary text-sm">Sign In</button></SignInButton></SignedOut>
    </header>
  );
}