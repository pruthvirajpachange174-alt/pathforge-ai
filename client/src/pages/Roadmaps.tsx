/** Renders the Roadmaps application page. */
import { useState } from 'react';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/common/GlassCard';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface RoadmapSemester {
  semester: string;
  focus: string;
  skills: string[];
  languages: string[];
  projects: string[];
  activities: string[];
}

interface GeneratedRoadmap {
  id: string;
  title: string;
  goal: string;
  content: {
    title: string;
    summary: string;
    semesters: RoadmapSemester[];
    finalAdvice: string;
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response;
    if (typeof response === 'object' && response !== null && 'data' in response) {
      const data = response.data;
      if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
        return data.message;
      }
    }
  }
  return 'Could not generate your roadmap. Check your connection and try again.';
}

export default function Roadmaps() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<GeneratedRoadmap | null>(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/roadmaps/generate', { goal });
      setRoadmap(data.data as GeneratedRoadmap);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
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
          maxLength={500}
          placeholder="e.g., Become a full-stack developer and get placed in Amazon by 4th year"
          className="w-full glass rounded-xl p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-sm min-h-24"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
          <span>Be specific about your target role and timeline.</span>
          <span>{goal.length}/500</span>
        </div>
        <button onClick={generate} disabled={loading || !goal.trim()} className="btn-primary mt-3 inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {loading ? 'Generating your roadmap…' : 'Generate Roadmap'}
        </button>
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300" role="alert">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </GlassCard>

      {roadmap && (
        <GlassCard>
          <h2 className="font-display text-2xl font-bold gradient-text mb-2">{roadmap.content.title}</h2>
          <p className="text-neutral-400 mb-4">{roadmap.content.summary}</p>
          <div className="space-y-4">
            {roadmap.content.semesters.map((s, i) => (
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