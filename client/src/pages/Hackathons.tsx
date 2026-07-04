import { useEffect, useState } from 'react';
import { api, attachToken } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Trophy, Calendar, Users, Award } from 'lucide-react';

export default function Hackathons() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [tab, setTab] = useState<'all' | 'National' | 'Company' | 'recommended'>('all');
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => { attachToken(() => getToken()); }, [getToken]);

  useEffect(() => {
    if (tab === 'recommended') {
      api.get('/hackathons/recommended').then((r) => setRecommended(r.data.data));
    } else {
      api.get('/hackathons', { params: tab === 'all' ? {} : { type: tab } })
        .then((r) => setItems(r.data.data));
    }
  }, [tab]);

  const list = tab === 'recommended' ? recommended : items;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Hackathon <span className="gradient-text">Hub</span></h1>
        <p className="text-neutral-400 mt-1">Discover, prepare, and win — national & company hackathons.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'National', 'Company', 'recommended'] as const).map((t) => (
          <button
            key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              tab === t ? 'bg-gradient-to-r from-brand-600 to-cyanx-500 text-white' : 'glass hover:bg-white/10'
            }`}
          >{t === 'recommended' ? '✨ For You' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((h, i) => (
          <GlassCard key={h.id} delay={i * 0.03} className="hover:scale-[1.02] transition">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 grid place-items-center">
                <Trophy size={18} className="text-white" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full glass">{h.type}</span>
            </div>
            <h3 className="font-display font-semibold text-lg mb-1">{h.name}</h3>
            <p className="text-xs text-neutral-400 mb-3">by {h.organizer}</p>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2"><Calendar size={12} /> {h.registrationPeriod}</div>
              <div className="flex items-center gap-2"><Users size={12} /> Team of {h.teamSize}</div>
              <div className="flex items-center gap-2"><Award size={12} /> {h.prizePool}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {h.domains.slice(0, 3).map((d: string) => (
                <span key={d} className="text-[10px] px-2 py-0.5 rounded-full glass">{d}</span>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}