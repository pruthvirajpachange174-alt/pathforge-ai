/** Renders the Placement Exams application page. */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ExamCard } from '@/components/cards/ExamCard';
import { GlassCard } from '@/components/common/GlassCard';
import { Search, Briefcase } from 'lucide-react';

export default function PlacementExams() {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const {
    data: exams = [],
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ['placement-exams'],
    queryFn: async () => {
      const response = await api.get('/exams/placement');
      return response.data.data;
    },
  });

  const query = q.trim().toLowerCase();
  const filteredExams = query
    ? exams.filter((exam) =>
        [
          exam.company,
          exam.eligibility,
          exam.difficulty,
          ...(exam.topics ?? []),
          ...(exam.tags ?? []),
        ].some((value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(query),
        ),
      )
    : exams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Placement <span className="gradient-text">Exams</span>
        </h1>
        <p className="mt-1 text-neutral-400">
          Everything you need to crack top company placements.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search TCS, Google, Amazon…"
          className="glass focus:ring-brand-500/40 w-full rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-sm text-neutral-400">Loading exams...</p>}
        {error && <p className="text-sm text-red-400">Could not load placement exams.</p>}
        {filteredExams.map((e) => (
          <GlassCard key={e.id} className="cursor-pointer transition hover:scale-[1.02]">
            <button type="button" className="w-full text-left" onClick={() => setSelected(e)}>
              <div className="mb-3 flex items-center gap-3">
                <div className="from-brand-500 to-cyanx-500 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br">
                  <Briefcase size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{e.company}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      e.difficulty === 'Hard'
                        ? 'bg-red-500/20 text-red-400'
                        : e.difficulty === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {e.difficulty}
                  </span>
                </div>
              </div>
              <p className="mb-3 line-clamp-2 text-sm text-neutral-400">{e.eligibility}</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {e.topics.slice(0, 4).map((t: string) => (
                  <span key={t} className="glass rounded-full px-2 py-0.5 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-cyanx-400 text-xs font-medium">💰 {e.expectedSalary}</p>
            </button>
          </GlassCard>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl p-8"
          >
            <ExamCard exam={selected} />
            <button onClick={() => setSelected(null)} className="btn-primary mt-6 w-full">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
