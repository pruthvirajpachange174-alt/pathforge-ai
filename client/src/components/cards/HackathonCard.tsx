/** Renders the Hackathon Card interface component. */
import { Award, Calendar, Globe, Users, Trophy, CheckCircle2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HackathonCardProps {
  hackathon: {
    name: string;
    type: string;
    organizer: string;
    website?: string;
    registrationPeriod?: string;
    eligibility: string;
    teamSize: string;
    mode: string;
    difficulty: string;
    domains: string[];
    prizePool: string;
    benefits?: { internship?: string; ppo?: string; certificates?: string };
    tips?: string[];
    selectionProcess?: string;
    problemStatements?: string[];
    judgingCriteria?: Record<string, unknown>;
    timeline?: Record<string, unknown>;
    previousWinners?: string[];
    tags?: string[];
  };
  className?: string;
}

export function HackathonCard({ hackathon, className }: HackathonCardProps) {
  return (
    <div className={cn('glass rounded-2xl p-6 space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold">{hackathon.name}</h3>
          <p className="text-xs text-neutral-400">by {hackathon.organizer}</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full glass">{hackathon.type}</span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="glass rounded-full px-2 py-1">{hackathon.difficulty}</span>
        {hackathon.tags?.map((tag) => (
          <span key={tag} className="glass rounded-full px-2 py-1">{tag}</span>
        ))}
      </div>

      {safeExternalUrl(hackathon.website) && (
        <a
          href={safeExternalUrl(hackathon.website) ?? undefined}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-cyanx-400 underline"
        >
          Official event information <ExternalLink size={14} />
        </a>
      )}

      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <Info icon={<Calendar size={14} />} label="Registration" value={hackathon.registrationPeriod || 'TBA'} />
        <Info icon={<Users size={14} />} label="Team Size" value={hackathon.teamSize} />
        <Info icon={<Globe size={14} />} label="Mode" value={hackathon.mode} />
        <Info icon={<Trophy size={14} />} label="Prize Pool" value={hackathon.prizePool} />
      </div>

      <div className="text-sm text-neutral-300">
        <p className="text-xs text-neutral-400 mb-1">Eligibility</p>
        <p>{hackathon.eligibility}</p>
      </div>

      {hackathon.selectionProcess && (
        <div className="text-sm text-neutral-300">
          <p className="mb-1 text-xs text-neutral-400">Selection process</p>
          <p>{hackathon.selectionProcess}</p>
        </div>
      )}

      {hackathon.problemStatements?.length ? (
        <div className="text-sm text-neutral-300">
          <p className="mb-1 text-xs text-neutral-400">Challenge format</p>
          <ul className="list-disc space-y-1 pl-5">
            {hackathon.problemStatements.map((statement) => <li key={statement}>{statement}</li>)}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="text-xs text-neutral-400 mb-2">Domains</p>
        <div className="flex flex-wrap gap-2">
          {hackathon.domains.map((d) => (
            <span key={d} className="text-[10px] px-2 py-0.5 rounded-full glass">{d}</span>
          ))}
        </div>
      </div>

      {hackathon.benefits && (
        <div className="grid md:grid-cols-3 gap-3 text-sm text-neutral-300">
          {hackathon.benefits.internship && <Benefit label="Internship" value={hackathon.benefits.internship} />}
          {hackathon.benefits.ppo && <Benefit label="PPO" value={hackathon.benefits.ppo} />}
          {hackathon.benefits.certificates && <Benefit label="Certificates" value={hackathon.benefits.certificates} />}
        </div>
      )}

      {hackathon.timeline && (
        <DataSection title="Dates and timeline" value={hackathon.timeline} />
      )}

      {hackathon.judgingCriteria && (
        <DataSection title="Judging criteria" value={hackathon.judgingCriteria} />
      )}

      <div>
        <p className="mb-1 text-xs text-neutral-400">Previous winners</p>
        {hackathon.previousWinners?.length ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-300">
            {hackathon.previousWinners.map((winner) => <li key={winner}>{winner}</li>)}
          </ul>
        ) : (
          <p className="text-sm text-neutral-300">No verified winner list is included; check the official event archive.</p>
        )}
      </div>

      {hackathon.tips?.length ? (
        <div>
          <p className="text-xs text-neutral-400 mb-2">Winning Tips</p>
          <ul className="space-y-1 text-sm text-neutral-300">
            {hackathon.tips.slice(0, 4).map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 size={14} className="text-cyanx-400 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3 flex items-center gap-2">
      {icon}
      <div>
        <p className="text-[10px] text-neutral-400">{label}</p>
        <p className="text-xs text-neutral-200">{value}</p>
      </div>
    </div>
  );
}

function Benefit({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="text-sm text-neutral-200">{value}</p>
    </div>
  );
}

function DataSection({ title, value }: { title: string; value: Record<string, unknown> }) {
  return (
    <div>
      <p className="mb-2 text-xs text-neutral-400">{title}</p>
      <dl className="space-y-2 text-sm text-neutral-300">
        {Object.entries(value).map(([key, item]) => (
          <div key={key}>
            <dt className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
            <dd>
              {Array.isArray(item) ? item.join(', ') : String(item)}
            </dd>
          </div>
        ))}
      </dl>
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