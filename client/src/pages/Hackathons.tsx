/** Renders the Hackathons application page. */
import { useEffect, useState } from 'react';
import { api, attachToken } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { HackathonCard } from '@/components/cards/HackathonCard';

export default function Hackathons() {
  const { getToken, isSignedIn } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [tab, setTab] = useState<'all' | 'National' | 'Company' | 'recommended'>('all');
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return attachToken(() => getToken());
  }, [getToken]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const request = tab === 'recommended'
      ? isSignedIn
        ? api.get('/hackathons/recommended')
        : Promise.resolve({ data: { data: [] } })
      : api.get('/hackathons', { params: tab === 'all' ? {} : { type: tab } });

    request
      .then((response) => {
        if (!active) return;
        if (tab === 'recommended') setRecommended(response.data.data);
        else setItems(response.data.data);
      })
      .catch(() => {
        if (active) setError('Could not load hackathons. Please try again later.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [tab, isSignedIn]);

  const list = tab === 'recommended' ? recommended : items;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Hackathon <span className="gradient-text">Hub</span>
        </h1>
        <p className="mt-1 text-neutral-400">
          Discover, prepare, and win — national & company hackathons.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'National', 'Company', 'recommended'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            disabled={t === 'recommended' && !isSignedIn}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              tab === t
                ? 'from-brand-600 to-cyanx-500 bg-gradient-to-r text-white'
                : 'glass hover:bg-white/10'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {t === 'recommended' ? (isSignedIn ? '✨ For You' : '✨ For You (sign in)') : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-neutral-400">Loading hackathons...</p>}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((hackathon) => (
          <HackathonCard key={hackathon.id} hackathon={hackathon} />
        ))}
      </div>
      {!loading && !error && !list.length && (
        <p className="text-sm text-neutral-400">
          {tab === 'recommended' ? 'Sign in and complete your profile to see recommendations.' : 'No hackathons found.'}
        </p>
      )}
    </div>
  );
}
