import { GlassCard } from '@/components/common/GlassCard';
import { motion } from 'framer-motion';
import {
  Briefcase, Building2, Cpu, Code2, Trophy, Map, TrendingUp, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const stats = [
  { label: 'Placement Exams', value: '15+', icon: Briefcase, to: '/placements', color: 'from-purple-500 to-fuchsia-500' },
  { label: 'Govt Exams', value: '13+', icon: Building2, to: '/government', color: 'from-blue-500 to-cyan-500' },
  { label: 'Tech Careers', value: '24+', icon: Cpu, to: '/tech', color: 'from-emerald-500 to-teal-500' },
  { label: 'Languages', value: '16+', icon: Code2, to: '/languages', color: 'from-amber-500 to-orange-500' },
  { label: 'Hackathons', value: '30+', icon: Trophy, to: '/hackathons', color: 'from-pink-500 to-rose-500' },
  { label: 'Roadmaps', value: 'AI-gen', icon: Map, to: '/roadmaps', color: 'from-indigo-500 to-violet-500' },
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-fade opacity-60 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-brand-400 text-sm mb-2">
            <Sparkles size={16} /> Powered by Claude 3.5 Sonnet + RAG
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Welcome to <span className="gradient-text">PathForge AI</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mb-6">
            Your 24/7 AI career mentor. Discover placements, exams, hackathons, roadmaps, and everything you need to forge your engineering career.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/chat" className="btn-primary inline-flex items-center gap-2">
              <Sparkles size={16} /> Ask the AI Mentor
            </Link>
            <Link to="/roadmaps" className="glass px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition">
              Generate My Roadmap
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <Link key={s.label} to={s.to}>
            <GlassCard delay={i * 0.05} className="hover:scale-[1.03] transition cursor-pointer group">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} grid place-items-center mb-3`}>
                <s.icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-neutral-400 mt-1">{s.label}</p>
            </GlassCard>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-brand-400" size={18} />
            <h3 className="font-display font-semibold">Trending Tech Demand (2025)</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trendingData}>
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Bar dataKey="demand" radius={[8, 8, 0, 0]} fill="url(#g1)" />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="font-display font-semibold mb-4">🚀 Quick Actions</h3>
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
                className="block glass rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition text-neutral-300 hover:text-white"
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