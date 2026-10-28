/** Renders the Sidebar interface component. */
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Cpu,
  Code2,
  Trophy,
  Map,
  MessageSquare,
  GitCompare,
  GraduationCap,
  Database,
  User,
  X,
} from 'lucide-react';
import { Shield } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { useAdminStatus } from '@/hooks/useAdminStatus';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'AI Mentor', icon: MessageSquare },
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/placements', label: 'Placements', icon: Briefcase },
  { to: '/government', label: 'Govt Exams', icon: Building2 },
  { to: '/tech', label: 'Tech Careers', icon: Cpu },
  { to: '/colleges', label: 'Top Colleges', icon: GraduationCap },
  { to: '/directory', label: 'India Directory', icon: Database },
  { to: '/admin', label: 'Admin', icon: Shield },
  { to: '/languages', label: 'Languages', icon: Code2 },
  { to: '/hackathons', label: 'Hackathons', icon: Trophy },
  { to: '/roadmaps', label: 'Roadmaps', icon: Map },
  { to: '/compare', label: 'India vs Global', icon: GitCompare },
];

export function Sidebar({ onClose }: { onClose: () => void }) {
  const { status: adminStatus } = useAdminStatus();
  const visibleNav = nav.filter((item) => item.to !== '/admin' || adminStatus === 'admin');

  return (
    <>
      <aside className="glass-strong sticky top-0 hidden h-screen w-64 flex-col border-r border-white/5 p-4 lg:flex">
        <SidebarContents visibleNav={visibleNav} />
      </aside>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
        <Dialog.Content className="glass-strong fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col overflow-y-auto border-r border-white/10 p-4 shadow-2xl focus:outline-none lg:hidden">
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close navigation menu"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
          </Dialog.Close>
          <SidebarContents visibleNav={visibleNav} onNavigate={onClose} />
        </Dialog.Content>
      </Dialog.Portal>
    </>
  );
}

function SidebarContents({
  visibleNav,
  onNavigate,
}: {
  visibleNav: typeof nav;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="from-brand-500 to-cyanx-500 h-9 w-9 rounded-xl bg-gradient-to-br" />
        <div>
          <h1 className="font-display text-lg font-bold">
            PathForge<span className="gradient-text"> AI</span>
          </h1>
          <p className="text-[10px] text-neutral-500">Career Mentor</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {visibleNav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/dashboard'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                isActive
                  ? 'from-brand-500/20 to-cyanx-500/20 bg-gradient-to-r text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white',
              )
            }
          >
            {({ isActive }) => (
              <>
                <n.icon size={18} />
                <span>{n.label}</span>
                {isActive && <span className="bg-brand-400 ml-auto h-1.5 w-1.5 rounded-full" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="glass mt-auto rounded-xl p-4 text-xs text-neutral-400">
        <p className="mb-1 font-semibold text-white">💡 Pro tip</p>
        Complete your profile to unlock personalized hackathon & tech recommendations.
      </div>
    </>
  );
}
