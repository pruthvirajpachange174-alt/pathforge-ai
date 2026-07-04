import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/common/GlassCard';
import { Code2 } from 'lucide-react';

export default function Languages() {
  const [langs, setLangs] = useState<any[]>([]);
  useEffect(() => { api.get('/languages').then((r) => setLangs(r.data.data)); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Programming <span className="gradient-text">Languages</span></h1>
        <p className="text-neutral-400 mt-1">Discover, compare, and choose your next language.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {langs.map((l, i) => (
          <GlassCard key={l.id} delay={i * 0.03}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: l.color || '#8b5cf6' }}>
                <Code2 size={18} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg">{l.name}</h3>
            </div>
            <div className="flex gap-4 text-xs text-neutral-400 mb-3">
              <div>Beginner: <span className="text-white font-bold">{l.beginnerFriendly}/10</span></div>
              <div>Demand: <span className="text-cyanx-400 font-bold">{l.demand}/10</span></div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {l.usedFor.slice(0, 4).map((u: string) => <span key={u} className="text-[10px] px-2 py-0.5 rounded-full glass">{u}</span>)}
            </div>
            <p className="text-xs text-neutral-300 line-clamp-2">{l.futureScope}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}