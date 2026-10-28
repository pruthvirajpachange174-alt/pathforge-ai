/** Renders the Dashboard application page. */
import { GlassCard } from '@/components/common/GlassCard';
import {
  Briefcase,
  Building2,
  Cpu,
  Code2,
  Trophy,
  Map,
  TrendingUp,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  {
    label: 'Placement Exams',
    value: '15+',
    icon: Briefcase,
    to: '/placements',
    color: 'from-purple-500 to-fuchsia-500',
  },
  {
    label: 'Govt Exams',
    value: '13+',
    icon: Building2,
    to: '/government',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Tech Careers',
    value: '24+',
    icon: Cpu,
    to: '/tech',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'Languages',
    value: '16+',
    icon: Code2,
    to: '/languages',
    color: 'from-amber-500 to-orange-500',
  },
  {
    label: 'Hackathons',
    value: '30+',
    icon: Trophy,
    to: '/hackathons',
    color: 'from-pink-500 to-rose-500',
  },
  {
    label: 'Roadmaps',
    value: 'AI-gen',
    icon: Map,
    to: '/roadmaps',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    label: 'Top Colleges',
    value: '5',
    icon: GraduationCap,
    to: '/colleges',
    color: 'from-sky-500 to-blue-500',
  },
];

const trendingData = [
  { name: 'AI/ML', demand: 95 },
  { name: 'Cloud', demand: 88 },
  { name: 'Cybersec', demand: 82 },
  { name: 'FullStack', demand: 90 },
  { name: 'Data Sci', demand: 87 },
  { name: 'DevOps', demand: 80 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="glass-strong relative overflow-hidden rounded-3xl p-8">
        <div className="bg-grid-fade pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <div className="text-brand-400 mb-2 flex items-center gap-2 text-sm">
            <Sparkles size={16} /> Create By Pruthviraj Pachange (AI Integrated)
          </div>
          <h1 className="font-display mb-2 text-4xl font-bold md:text-5xl">
            Welcome to <span className="gradient-text">PathForge AI</span>
          </h1>
          <p className="mb-6 max-w-2xl text-neutral-400">
            Your 24/7 AI career mentor. Discover placements, exams, hackathons, roadmaps, and
            everything you need to forge your engineering career.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/chat" className="btn-primary inline-flex items-center gap-2">
              <Sparkles size={16} /> Ask the AI Mentor
            </Link>
            <Link
              to="/roadmaps"
              className="glass rounded-xl px-4 py-2 text-sm transition hover:bg-white/10"
            >
              Generate My Roadmap
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <GlassCard className="group cursor-pointer transition hover:scale-[1.03]">
              <div
                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${s.color} mb-3 grid place-items-center`}
              >
                <s.icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-neutral-400">{s.label}</p>
            </GlassCard>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-brand-400" size={18} />
            <h3 className="font-display font-semibold">Trending Tech Demand (2025)</h3>
          </div>
          <div
            role="img"
            aria-label="Trending technology demand chart"
            className="grid h-[280px] grid-cols-6 items-end gap-3 pt-4"
          >
            {trendingData.map(({ name, demand }) => (
              <div key={name} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="text-xs text-neutral-400">{demand}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500 to-violet-500"
                  style={{ height: `${demand}%` }}
                />
                <span className="text-center text-[10px] text-neutral-400">{name}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-display mb-4 font-semibold">🚀 Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'What should I learn after Java?', to: '/chat' },
              { label: 'Prepare for GATE', to: '/chat' },
              { label: 'Am I eligible for SIH?', to: '/chat' },
              { label: 'Best language for AI?', to: '/chat' },
              { label: 'Full-stack roadmap', to: '/roadmaps' },
            ].map((q) => (
              <Link
                key={q.label}
                to={q.to}
                className="glass block rounded-lg px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/10 hover:text-white"
              >
                💬 {q.label}
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
