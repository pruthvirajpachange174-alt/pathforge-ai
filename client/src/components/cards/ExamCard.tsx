/** Renders the Exam Card interface component. */
import { BadgeCheck, BookOpen, Briefcase, CalendarClock, CheckCircle2, IndianRupee, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ExamCardProps {
  exam: {
    company: string;
    eligibility: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topics: string[];
    examPattern: { sections?: string[]; duration?: string; mode?: string; [key: string]: any };
    roadmap: Record<string, string>;
    hiringProcess: { rounds?: string[]; [key: string]: any };
    expectedSalary: string;
    resources: { practice?: string[]; books?: string[]; courses?: string[]; [key: string]: any };
    previousTrends?: string;
    tags?: string[];
  };
  className?: string;
}

const difficultyColor = {
  Easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-400/30',
  Hard: 'bg-red-500/20 text-red-400 border-red-400/30',
};

export function ExamCard({ exam, className }: ExamCardProps) {
  return (
    <div className={cn('glass rounded-2xl p-6 space-y-5', className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold">{exam.company}</h3>
          <p className="text-xs text-neutral-400 mt-1">{exam.eligibility}</p>
        </div>
        <span className={cn('text-xs px-3 py-1 rounded-full border', difficultyColor[exam.difficulty])}>
          {exam.difficulty}
        </span>
      </div>

      {/* Topics */}
      <Section icon={<BookOpen size={16} />} title="Topics">
        <div className="flex flex-wrap gap-2">
          {exam.topics.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full glass">
              {t}
            </span>
          ))}
        </div>
      </Section>

      {exam.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {exam.tags.map((tag) => (
            <span key={tag} className="glass rounded-full px-2 py-1 text-xs text-neutral-300">{tag}</span>
          ))}
        </div>
      ) : null}

      {/* Exam Pattern */}
      <Section icon={<ListChecks size={16} />} title="Exam Pattern">
        <div className="grid md:grid-cols-3 gap-3 text-sm text-neutral-300">
          {exam.examPattern?.sections && (
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-neutral-400 mb-1">Sections</p>
              <ul className="list-disc pl-4">
                {exam.examPattern.sections.map((s: string) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          )}
          {exam.examPattern?.duration && (
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-neutral-400 mb-1">Duration</p>
              <p>{exam.examPattern.duration}</p>
            </div>
          )}
          {exam.examPattern?.mode && (
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-neutral-400 mb-1">Mode</p>
              <p>{exam.examPattern.mode}</p>
            </div>
          )}
        </div>
      </Section>

      {exam.examPattern?.schedule ? (
        <Section icon={<CalendarClock size={16} />} title="Dates and hiring schedule">
          <p className="text-sm text-neutral-300">{String(exam.examPattern.schedule)}</p>
        </Section>
      ) : null}

      {/* Roadmap */}
      <Section icon={<CalendarClock size={16} />} title="Preparation Roadmap">
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {Object.entries(exam.roadmap).map(([k, v]) => (
            <div key={k} className="glass rounded-xl p-3">
              <p className="text-xs text-neutral-400 mb-1 uppercase">{k}</p>
              <p className="text-neutral-300">{v}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Hiring Process */}
      <Section icon={<Briefcase size={16} />} title="Hiring Process">
        <ul className="space-y-2 text-sm text-neutral-300">
          {(exam.hiringProcess?.rounds || []).map((r: string, i: number) => (
            <li key={r} className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-cyanx-400" />
              <span>Round {i + 1}: {r}</span>
            </li>
          ))}
        </ul>
      </Section>

      {exam.previousTrends ? (
        <Section icon={<BookOpen size={16} />} title="Preparation notes">
          <p className="text-sm text-neutral-300">{exam.previousTrends}</p>
        </Section>
      ) : null}

      {/* Salary */}
      <Section icon={<IndianRupee size={16} />} title="Expected Salary">
        <div className="glass rounded-xl p-3 text-lg font-semibold text-cyanx-400">{exam.expectedSalary}</div>
      </Section>

      {/* Resources */}
      <Section icon={<BadgeCheck size={16} />} title="Resources">
        <div className="grid md:grid-cols-3 gap-3 text-sm text-neutral-300">
          {exam.resources.practice?.length ? (
            <ListCard title="Practice" items={exam.resources.practice} />
          ) : null}
          {exam.resources.books?.length ? (
            <ListCard title="Books" items={exam.resources.books} />
          ) : null}
          {exam.resources.courses?.length ? (
            <ListCard title="Courses" items={exam.resources.courses} />
          ) : null}
        </div>
      </Section>

      {safeExternalUrl(exam.resources.officialSource) ? (
        <a
          href={safeExternalUrl(exam.resources.officialSource) ?? undefined}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm text-cyanx-400 underline"
        >
          Check official careers information
        </a>
      ) : null}
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-brand-400">
        {icon}
        <h4 className="uppercase tracking-wide">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-xl p-3">
      <p className="text-xs text-neutral-400 mb-2">{title}</p>
      <ul className="list-disc pl-4 space-y-1">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
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