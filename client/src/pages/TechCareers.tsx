/** Renders the Tech Careers application page. */
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import GlassSection from '@/components/common/GlassSection';
import CareerBadge from '@/components/common/CareerBadge';
import Chips from '@/components/common/Chips';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';


type Career = {
  slug: string;
  name: string;
  description: string;
  requiredSkills: string[];
  learningRoadmap: {
    phases: Array<{ title: string; duration: string; bullets: string[] }>;
  };
  salaryRange: string;
  demandLevel: string;
  companiesHiring: string[];
  resources: {
    books: string[];
    courses: string[];
    practiceWebsites: string[];
  };
};

type Technology = {
  slug: string;
  name: string;
  category: string;
  description: string;
  skills: string[];
  languages: string[];
  roadmap: Record<string, string[]>;
  projects: Record<string, string[]>;
  certifications: string[];
  salary: string;
  companies: string[];
  futureDemand: string;
};

export default function TechCareers() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'careers' | 'technology'>('careers');
  const [q, setQ] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [careerResponse, technologyResponse] = await Promise.all([
          api.get('/tech/careers'),
          api.get('/tech'),
        ]);
        if (!mounted) return;
        setCareers(careerResponse.data?.data ?? []);
        setTechnologies(technologyResponse.data?.data ?? []);
      } catch {
        if (!mounted) return;
        setError('Could not load career information. Please try again later.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return careers;
    return careers.filter((c) => {
      const hay = [c.name, c.description, c.slug, ...(c.requiredSkills ?? [])]
        .join(' ')
        .toLowerCase();
      return hay.includes(s);
    });
  }, [careers, q]);

  const filteredTechnologies = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return technologies;
    return technologies.filter((technology) =>
      [
        technology.name,
        technology.category,
        technology.description,
        ...technology.skills,
        ...technology.languages,
      ].join(' ').toLowerCase().includes(query),
    );
  }, [technologies, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Tech <span className="gradient-text">Careers</span>
          </h1>
          <p className="text-neutral-400 mt-1">
            Explore role-wise skill sets, roadmaps, salary ranges, and resources.
          </p>
        </div>

        <div className="w-full md:w-[420px]">
          <div className="relative max-w-md w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search careers, skills, or keywords..."
              className="w-full glass rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 text-sm border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          ['careers', 'Career paths'],
          ['technology', 'Technology guides'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            className={`rounded-xl px-4 py-2 text-sm ${view === key ? 'bg-brand-600 text-white' : 'glass text-neutral-300'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-6 animate-pulse border border-white/10 bg-white/5"
            >
              <div className="h-4 w-1/2 rounded bg-white/10" />
              <div className="mt-4 h-3 w-full rounded bg-white/10" />
              <div className="mt-2 h-3 w-5/6 rounded bg-white/10" />
              <div className="mt-4 h-8 w-2/3 rounded bg-white/10" />
            </motion.div>
          ))}
        </div>
      ) : view === 'careers' && filtered.length === 0 ? (
        <GlassSection title="No careers found">
          <p className="text-sm text-neutral-300">Try a different search term.</p>
        </GlassSection>
      ) : view === 'careers' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <GlassSection key={c.slug} title={c.name}>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <CareerBadge level={c.demandLevel} />
                  <span className="text-xs font-semibold text-white/70">{c.salaryRange}</span>
                </div>

                <p className="text-sm leading-relaxed text-neutral-200">{c.description}</p>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                    Required Skills
                  </div>
                  <Chips items={c.requiredSkills ?? []} />
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                    Learning Roadmap
                  </div>
                  <div className="space-y-3">
                    {(c.learningRoadmap?.phases ?? []).map((p) => (
                      <div
                        key={p.title}
                        className="rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-sm font-semibold text-white">{p.title}</div>
                          <div className="text-xs text-white/60">{p.duration}</div>
                        </div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-200">
                          {p.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                    Companies Hiring
                  </div>
                  <Chips items={c.companiesHiring ?? []} />
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                    Resources
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-xs font-semibold text-white/70">Books</div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-neutral-200">
                        {(c.resources?.books ?? []).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white/70">Courses</div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-neutral-200">
                        {(c.resources?.courses ?? []).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white/70">Practice Websites</div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-neutral-200">
                        {(c.resources?.practiceWebsites ?? []).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </GlassSection>
          ))}
        </div>
      ) : filteredTechnologies.length === 0 ? (
        <GlassSection title="No technology guides found">
          <p className="text-sm text-neutral-300">Try a different search term.</p>
        </GlassSection>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTechnologies.map((technology) => (
            <GlassSection key={technology.slug} title={technology.name}>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-wide text-cyanx-400">{technology.category}</p>
                <p className="text-sm leading-relaxed text-neutral-200">{technology.description}</p>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">Skills</div>
                  <Chips items={technology.skills ?? []} />
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">Languages and tools</div>
                  <Chips items={technology.languages ?? []} />
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">Learning roadmap</div>
                  <div className="space-y-2">
                    {Object.entries(technology.roadmap ?? {}).map(([phase, items]) => (
                      <div key={phase} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <h3 className="text-sm font-semibold capitalize text-white">{phase.replace(/([0-9])/g, ' $1')}</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-200">
                          {items.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <TechnologyList title="Project ideas by level" groups={technology.projects} />
                <TechnologyList title="Certifications and learning paths" groups={{ options: technology.certifications ?? [] }} />
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">India career context</h3>
                  <p>{technology.salary}</p>
                  <p className="mt-2 text-neutral-300">{technology.futureDemand}</p>
                  <div className="mt-2"><Chips items={technology.companies ?? []} /></div>
                </div>
              </div>
            </GlassSection>
          ))}
        </div>
      )}
    </div>
  );
}

function TechnologyList({ title, groups }: { title: string; groups: Record<string, string[]> }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">{title}</h3>
      <div className="space-y-2">
        {Object.entries(groups ?? {}).map(([group, items]) => (
          <div key={group} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-sm font-semibold capitalize">{group}</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-neutral-200">
              {(items ?? []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

