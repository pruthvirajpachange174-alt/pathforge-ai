import { useEffect, useMemo, useState } from 'react';
import { Database, ExternalLink, Search } from 'lucide-react';
import { api } from '@/lib/api';

type DirectoryEntry = {
  id: string;
  category: string;
  title: string;
  fields: Record<string, string>;
  sourceUrl: string | null;
  sourceSection: string;
  verificationStatus: string;
  sourceNotes: string;
};

export default function IndiaDirectory() {
  const pageSize = 24;
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/directory')
      .then((response) => {
        if (!active) return;
        if (!Array.isArray(response.data.data)) {
          setError('The directory response was invalid. Please try again later.');
          return;
        }
        setEntries(response.data.data as DirectoryEntry[]);
      })
      .catch(() => {
        if (active) setError('Could not load the India directory. Please try again later.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(entries.map((entry) => entry.category).sort())],
    [entries],
  );
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (category !== 'All' && entry.category !== category) return false;
      if (!query) return true;
      return [entry.title, entry.sourceSection, ...Object.values(entry.fields)]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [category, entries, search]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleEntries = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="glass grid h-12 w-12 place-items-center rounded-2xl text-cyanx-400">
            <Database size={24} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">
              India <span className="gradient-text">Education Directory</span>
            </h1>
            <p className="text-sm text-neutral-400">
              Starter records for colleges, exams, learning resources, programs, and employers.
            </p>
          </div>
        </div>
        <p className="max-w-4xl text-sm text-amber-200/90">
          These entries come from a supplied starter-data file and have not been independently
          verified. Exam dates and open applications, hackathon editions, vacancies, eligibility,
          and institution details must be checked with the linked official source.
        </p>
      </header>

      <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search directory</span>
          <Search className="absolute left-3 top-3 text-neutral-500" size={18} />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search names, locations, categories, or details"
            className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-cyanx-400/50"
          />
        </label>
        <label>
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm sm:min-w-56"
          >
            {categories.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <p className="text-xs text-neutral-500">
        {loading
          ? 'Loading directory...'
          : `${filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length} matches (${entries.length} total records)`}
      </p>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleEntries.map((entry) => {
          const sourceUrl = safeHttpsUrl(entry.sourceUrl);
          return (
            <article key={entry.id} className="glass flex flex-col rounded-2xl p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyanx-500/10 px-2.5 py-1 text-xs text-cyanx-300">
                  {entry.category}
                </span>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200">
                  Not independently verified
                </span>
              </div>
              <h2 className="text-lg font-semibold text-white">{entry.title}</h2>
              <p className="mt-1 text-xs text-neutral-500">{entry.sourceSection}</p>

              <dl className="mt-4 space-y-3">
                {Object.entries(entry.fields).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium text-neutral-400">{label}</dt>
                    <dd className="break-words text-sm text-neutral-200">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-neutral-400">
                {entry.sourceNotes}
              </p>
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-cyanx-300 hover:text-cyanx-200"
                >
                  Open source <ExternalLink size={14} />
                </a>
              ) : null}
            </article>
          );
        })}
      </div>

      {!loading && filtered.length > pageSize && (
        <nav aria-label="Directory pages" className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="glass rounded-xl px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-400">Page {page} of {pageCount}</span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={page === pageCount}
            className="glass rounded-xl px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-neutral-400">No directory records match your search.</p>
      )}
    </div>
  );
}

function safeHttpsUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
