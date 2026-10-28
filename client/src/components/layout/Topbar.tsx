/** Renders the Topbar interface component. */
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Menu, Search } from 'lucide-react';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 glass-strong flex items-center gap-3 border-b border-white/5 px-4 py-3 sm:gap-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
      >
        <Menu size={22} />
      </button>
      <div className="relative min-w-0 max-w-md flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          placeholder="Search exams, tech, languages…"
          className="glass w-full rounded-xl bg-transparent py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
      </div>
      <ThemeToggle />
      <SignedIn><UserButton /></SignedIn>
      <SignedOut><SignInButton mode="modal"><button className="btn-primary text-sm">Sign In</button></SignInButton></SignedOut>
    </header>
  );
}