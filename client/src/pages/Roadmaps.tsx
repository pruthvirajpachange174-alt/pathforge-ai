import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { api, attachToken } from '@/lib/api';
import { GlassCard } from '@/components/common/GlassCard';
import { Sparkles, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function Roadmaps() {
  const { getToken } = useAuth();
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  useEffect(() => { attachToken(() => getToken()); }, [getToken]);

  const generate = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/roadmaps/generate', { goal });
      setRoadmap(data.data);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">AI <span className="gradient-text">Roadmap Generator</span></h1>
        <p className="text-neutral-400 mt-1">Get a personalized, semester-wise plan tailored to your profile.</p>
      </div>

      <GlassCard>
        <label className="text-sm text-neutral-300 mb-2 block">What's your goal?</label>
        <textarea
          value={goal} onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Become a full-stack developer and get placed in Amazon by 4th year"
          className="w-full glass rounded-xl p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-sm min-h-24"
        />
        <button onClick={generate} disabled={loading} className="btn-primary mt-3 inline-flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          Generate Roadmap
        </button>
      </GlassCard>

      {roadmap && (
        <GlassCard>
          <h2 className="font-display text-2xl font-bold gradient-text mb-2">{roadmap.content.title}</h2>
          <p className="text-neutral-400 mb-4">{roadmap.content.summary}</p>
          <div className="space-y-4">
            {roadmap.content.semesters?.map((s: any, i: number) => (
              <div key={i} className="glass rounded-xl p-4">
                <h3 className="font-semibold text-brand-400 mb-1">{s.semester} — {s.focus}</h3>
                <div className="text-sm text-neutral-300 mt-2 grid md:grid-cols-2 gap-2">
                  <div><b>Skills:</b> {s.skills?.join(', ')}</div>
                  <div><b>Languages:</b> {s.languages?.join(', ')}</div>
                  <div><b>Projects:</b> {s.projects?.join(', ')}</div>
                  <div><b>Activities:</b> {s.activities?.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 glass rounded-xl p-4">
            <h3 className="font-semibold text-cyanx-400 mb-2">🎯 Final Advice</h3>
            <p className="text-sm text-neutral-300">{roadmap.content.finalAdvice}</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}