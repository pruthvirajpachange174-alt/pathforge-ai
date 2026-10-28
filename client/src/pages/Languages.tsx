/** Renders the Languages application page. */
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/common/GlassCard';
import { Code2 } from 'lucide-react';

export default function Languages() {
  const [langs, setLangs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/languages')
      .then((response) => {
        if (active) setLangs(response.data.data);
      })
      .catch(() => {
        if (active) setError('Could not load language information. Please try again later.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Programming <span className="gradient-text">Languages</span>
        </h1>
        <p className="mt-1 text-neutral-400">Discover, compare, and choose your next language.</p>
      </div>
      {loading && <p className="text-sm text-neutral-400">Loading languages...</p>}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {langs.map((l) => (
          <GlassCard key={l.id}>
            <div className="mb-3 flex items-center gap-3">
              <div
                className="grid h-10 w-10 place-items-center rounded-xl"
                style={{ background: l.color || '#8b5cf6' }}
              >
                <Code2 size={18} className="text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold">{l.name}</h3>
            </div>
            <div className="mb-3 flex gap-4 text-xs text-neutral-400">
              <div>
                Beginner: <span className="font-bold text-white">{l.beginnerFriendly}/10</span>
              </div>
              <div>
                Demand: <span className="text-cyanx-400 font-bold">{l.demand}/10</span>
              </div>
            </div>
            <div className="mb-3 flex flex-wrap gap-1">
              {l.usedFor.map((u: string) => (
                <span key={u} className="glass rounded-full px-2 py-0.5 text-[10px]">
                  {u}
                </span>
              ))}
            </div>
            <p className="line-clamp-2 text-xs text-neutral-300">{l.futureScope}</p>
            <div className="mt-4">
              <h4 className="mb-1 text-xs font-semibold uppercase text-emerald-400">Strengths</h4>
              <ul className="list-disc pl-5 text-xs text-neutral-300">
                {(l.pros ?? []).map((item: string) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="mt-3">
              <h4 className="mb-1 text-xs font-semibold uppercase text-amber-400">Trade-offs</h4>
              <ul className="list-disc pl-5 text-xs text-neutral-300">
                {(l.cons ?? []).map((item: string) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="mt-3">
              <h4 className="mb-1 text-xs font-semibold uppercase text-neutral-400">Example projects</h4>
              <ul className="list-disc pl-5 text-xs text-neutral-300">
                {(l.exampleProjects ?? []).map((item: string) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="mt-3">
              <h4 className="mb-1 text-xs font-semibold uppercase text-neutral-400">Used by / relevant to</h4>
              <p className="text-xs text-neutral-300">{(l.companies ?? []).join(', ')}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
