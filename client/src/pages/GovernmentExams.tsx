/** Renders the Government Exams application page. */
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/common/GlassCard';
import { Search, Building2, GraduationCap, Link as LinkIcon } from 'lucide-react';

export default function GovernmentExams() {
  const [selected, setSelected] = useState<any | null>(null);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('');
  const {
    data: exams = [],
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ['government-exams', category],
    queryFn: async () => {
      const response = await api.get('/exams/government', {
        params: { category: category || undefined },
      });
      return response.data.data;
    },
  });

  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const e of exams) if (e.category) s.add(String(e.category));
    return Array.from(s);
  }, [exams]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return exams;
    return exams.filter((e) => {
      const hay = [e.name, e.slug, e.category, e.whoShouldTake, e.tags].flat();
      return hay.some((v) =>
        String(v ?? '')
          .toLowerCase()
          .includes(query),
      );
    });
  }, [exams, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Government <span className="gradient-text">Exams</span>
        </h1>
        <p className="mt-1 text-neutral-400">
          Curated government opportunities with syllabus & preparation cues.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search GATE, CAT, ISRO…"
            className="glass focus:ring-brand-500/40 w-full rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        <div className="flex-1">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass focus:ring-brand-500/40 w-full rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-sm text-neutral-400">Loading exams...</p>}
        {error && <p className="text-sm text-red-400">Could not load government exams.</p>}
        {filtered.map((e) => (
          <GlassCard
            key={e.slug || e.id || e.name}
            className="cursor-pointer transition hover:scale-[1.02]"
          >
            <button type="button" className="w-full text-left" onClick={() => setSelected(e)}>
              <div className="mb-3 flex items-center gap-3">
                <div className="from-brand-500 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br to-blue-500">
                  <Building2 size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display truncate text-lg font-semibold">{e.name}</h3>
                  {e.difficulty ? (
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
                  ) : null}
                </div>
              </div>

              <p className="mb-3 line-clamp-2 text-sm text-neutral-400">{e.whoShouldTake}</p>

              <div className="mb-3 flex flex-wrap gap-1">
                {(e.tags || []).slice(0, 4).map((t: string) => (
                  <span key={t} className="glass rounded-full px-2 py-0.5 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>

              {e.opportunities ? (
                <p className="text-cyanx-400 text-xs font-medium">
                  💡 {String(e.opportunities).slice(0, 48)}…
                </p>
              ) : null}
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
            className="glass-strong max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-8"
          >
            <h2 className="font-display gradient-text mb-2 text-3xl font-bold">{selected.name}</h2>
            <div className="mb-4 flex flex-wrap gap-2">
              {selected.category ? (
                <span className="glass rounded-full px-3 py-1 text-xs text-neutral-200">
                  <Building2 size={14} className="-mt-0.5 mr-1 inline-block" />
                  {selected.category}
                </span>
              ) : null}

              {selected.difficulty ? (
                <span
                  className={`glass rounded-full px-3 py-1 text-xs ${
                    selected.difficulty === 'Hard'
                      ? 'border border-red-400/30 text-red-300'
                      : selected.difficulty === 'Medium'
                        ? 'border border-amber-400/30 text-amber-200'
                        : 'border border-emerald-400/30 text-emerald-200'
                  }`}
                >
                  {selected.difficulty}
                </span>
              ) : null}

              {selected.officialUrl ? (
                safeExternalUrl(selected.officialUrl) ? (
                  <a
                    href={safeExternalUrl(selected.officialUrl) ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs hover:bg-white/10"
                  >
                    <LinkIcon size={14} /> Official
                  </a>
                ) : null
              ) : null}
            </div>

            {selected.eligibility ? (
              <p className="mb-6 text-neutral-400">{selected.eligibility}</p>
            ) : null}

            <Section title="Who should take this">
              <p className="text-sm text-neutral-300">{selected.whoShouldTake}</p>
            </Section>

            <Section title="Syllabus">
              {selected.syllabus ? (
                <div className="space-y-2">
                  {Array.isArray(selected.syllabus) ? (
                    <ul className="list-disc pl-5">
                      {selected.syllabus.map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : typeof selected.syllabus === 'object' ? (
                    Object.entries(selected.syllabus).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}</strong>
                        <ul className="mt-1 list-disc pl-5">
                          {Array.isArray(value) ? (
                            value.map((v: string) => <li key={v}>{v}</li>)
                          ) : (
                            <li>{String(value)}</li>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p>{String(selected.syllabus)}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-neutral-300">No syllabus found.</p>
              )}
            </Section>

            {selected.pattern && (
              <Section title="Exam pattern">
                <div className="space-y-2 text-sm text-neutral-300">
                  {Object.entries(selected.pattern).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}</strong>
                      <p>
                        {Array.isArray(value)
                          ? value.join(', ')
                          : typeof value === 'object' && value !== null
                            ? JSON.stringify(value)
                            : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {selected.schedule && (
              <Section title="Schedule and dates">
                <div className="space-y-2 text-sm text-neutral-300">
                  {Object.entries(selected.schedule)
                    .filter(([key]) => key !== 'officialUrl')
                    .map(([key, value]) => (
                      <div key={key}>
                        <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</strong>
                        <p>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : typeof value === 'object' && value !== null
                              ? JSON.stringify(value)
                              : String(value)}
                        </p>
                      </div>
                    ))}
                  {safeExternalUrl(selected.schedule.officialUrl) && (
                    <a
                      className="text-cyanx-400 underline"
                      href={safeExternalUrl(selected.schedule.officialUrl) ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Verify dates on the official site
                    </a>
                  )}
                </div>
              </Section>
            )}

            <Section title="Opportunities">
              <p className="text-sm text-neutral-300">{selected.opportunities}</p>
            </Section>

            <Section title="Tags">
              <div className="flex flex-wrap gap-2">
                {(selected.tags || []).map((t: string) => (
                  <span key={t} className="glass rounded-full px-3 py-1 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Quick prep cues">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="glass rounded-xl p-4">
                  <div className="text-brand-400 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <GraduationCap size={14} /> Focus
                  </div>
                  <p className="text-sm text-neutral-300">
                    Start with core syllabus topics, then iterate with practice & revision.
                  </p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-cyanx-400 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    ✨ Momentum
                  </div>
                  <p className="text-sm text-neutral-300">
                    60–90 minutes/day + weekly tests → steady improvement.
                  </p>
                </div>
              </div>
            </Section>

            <button onClick={() => setSelected(null)} className="btn-primary mt-4 w-full">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="font-display text-brand-400 mb-2 text-sm font-semibold uppercase tracking-wider">
        {title}
      </h3>
      <div className="glass rounded-xl p-4">{children}</div>
    </div>
  );
}

function safeExternalUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
