/** Renders the Language Card interface component. */
import { Code2, Star, TrendingUp, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LanguageCardProps {
  language: {
    name: string;
    usedFor: string[];
    companies: string[];
    pros: string[];
    cons: string[];
    beginnerFriendly: number;
    demand: number;
    futureScope: string;
    color?: string;
  };
  className?: string;
}

export function LanguageCard({ language, className }: LanguageCardProps) {
  return (
    <div className={cn('glass rounded-2xl p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl grid place-items-center text-white"
          style={{ background: language.color || '#8b5cf6' }}
        >
          <Code2 size={18} />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">{language.name}</h3>
          <p className="text-xs text-neutral-400">Programming Language</p>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-neutral-400">
        <div className="flex items-center gap-1">
          <Star size={14} className="text-amber-400" />
          Beginner: <span className="text-white font-semibold">{language.beginnerFriendly}/10</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp size={14} className="text-cyanx-400" />
          Demand: <span className="text-white font-semibold">{language.demand}/10</span>
        </div>
      </div>

      <Section title="Used For">
        <Chips items={language.usedFor} />
      </Section>

      <Section title="Top Companies">
        <div className="flex items-center gap-2 text-sm text-neutral-300">
          <Building2 size={14} className="text-brand-400" />
          <span>{language.companies.slice(0, 6).join(', ')}</span>
        </div>
      </Section>

      <Section title="Pros">
        <List items={language.pros} />
      </Section>

      <Section title="Cons">
        <List items={language.cons} />
      </Section>

      <Section title="Future Scope">
        <p className="text-sm text-neutral-300">{language.futureScope}</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase text-neutral-400 mb-2">{title}</p>
      {children}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full glass">{i}</span>
      ))}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  );
}