import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Building2, Cpu, Code2, Trophy, Map, MessageSquare, GitCompare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'AI Mentor', icon: MessageSquare },
  { to: '/placements', label: 'Placements', icon: Briefcase },
  { to: '/government', label: 'Govt Exams', icon: Building2 },
  { to: '/tech', label: 'Tech Careers', icon: Cpu },
  { to: '/languages', label: 'Languages', icon: Code2 },
  { to: '/hackathons', label: 'Hackathons', icon: Trophy },
  { to: '/roadmaps', label: 'Roadmaps', icon: Map },
  { to: '/compare', label: 'India vs Global', icon: GitCompare },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 p-4 glass-strong border-r border-white/5">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyanx-500" />
        <div>
          <h1 className="font-display font-bold text-lg">PathForge<span className="gradient-text"> AI</span></h1>
          <p className="text-[10px] text-neutral-500">Career Mentor</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                isActive
                  ? 'bg-gradient-to-r from-brand-500/20 to-cyanx-500/20 text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <n.icon size={18} />
                <span>{n.label}</span>
                {isActive && (
                  <motion.div layoutId="dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto glass rounded-xl p-4 text-xs text-neutral-400">
        <p className="font-semibold text-white mb-1">💡 Pro tip</p>
        Complete your profile to unlock personalized hackathon & tech recommendations.
      </div>
    </aside>
  );
}