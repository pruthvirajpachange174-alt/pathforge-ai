import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/common/GlassCard';
import { motion } from 'framer-motion';
import { Search, Briefcase } from 'lucide-react';

export default function PlacementExams() {
  const [exams, setExams] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    api.get('/exams/placement', { params: { q } }).then((r) => setExams(r.data.data));
  }, [q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Placement <span className="gradient-text">Exams</span></h1>
        <p className="text-neutral-400 mt-1">Everything you need to crack top company placements.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search TCS, Google, Amazon…"
          className="w-full glass rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((e, i) => (
          <GlassCard key={e.id} delay={i * 0.03} className="hover:scale-[1.02] transition cursor-pointer" >
            <div onClick={() => setSelected(e)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyanx-500 grid place-items-center">
                  <Briefcase size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">{e.company}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    e.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                    e.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>{e.difficulty}</span>
                </div>
              </div>
              <p className="text-sm text-neutral-400 line-clamp-2 mb-3">{e.eligibility}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {e.topics.slice(0, 4).map((t: string) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full glass">{t}</span>
                ))}
              </div>
              <p className="text-xs text-cyanx-400 font-medium">💰 {e.expectedSalary}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 grid place-items-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
          >
            <h2 className="font-display text-3xl font-bold gradient-text mb-2">{selected.company}</h2>
            <p className="text-neutral-400 mb-6">{selected.eligibility}</p>

            <Section title="Exam Pattern">
              <pre className="text-xs overflow-x-auto">{JSON.stringify(selected.examPattern, null, 2)}</pre>
            </Section>

            <Section title="Topics">
              <div className="flex flex-wrap gap-2">
                {selected.topics.map((t: string) => <span key={t} className="glass px-3 py-1 rounded-full text-xs">{t}</span>)}
              </div>
            </Section>

            <Section title="Preparation Roadmap">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(selected.roadmap, null, 2)}</pre>
            </Section>

            <Section title="Previous Trends">
              <p className="text-sm text-neutral-300">{selected.previousTrends}</p>
            </Section>

            <Section title="Expected Salary">
              <p className="text-lg font-semibold text-cyanx-400">{selected.expectedSalary}</p>
            </Section>

            <Section title="Hiring Process">
              <pre className="text-xs">{JSON.stringify(selected.hiringProcess, null, 2)}</pre>
            </Section>

            <button onClick={() => setSelected(null)} className="btn-primary w-full mt-4">Close</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="font-display font-semibold text-sm text-brand-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="glass rounded-xl p-4">{children}</div>
    </div>
  );
}