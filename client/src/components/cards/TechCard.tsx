/** Renders the Tech Card interface component. */
import { Cpu, Hammer, Rocket, BadgeCheck, IndianRupee, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TechCardProps {
  tech: {
    name: string;
    description: string;
    skills: string[];
    languages: string[];
    roadmap: Record<string, string[]>;
    projects: { beginner: string[]; intermediate: string[]; advanced: string[] };
    certifications: string[];
    salary: string;
    companies: string[];
    futureDemand: string;
  };
  className?: string;
}

export function TechCard({ tech, className }: TechCardProps) {
  return (
    <div className={cn('glass rounded-2xl p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyanx-500 grid place-items-center">
          <Cpu size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">{tech.name}</h3>
          <p className="text-xs text-neutral-400">{tech.description}</p>
        </div>
      </div>

      <Section title="Core Skills" icon={<Hammer size={14} />}>
        <Chips items={tech.skills} />
      </Section>

      <Section title="Languages" icon={<BadgeCheck size={14} />}>
        <Chips items={tech.languages} />
      </Section>

      <Section title="Roadmap">
        <div className="grid md:grid-cols-2 gap-3 text-sm text-neutral-300">
          {Object.entries(tech.roadmap).map(([k, v]) => (
            <div key={k} className="glass rounded-xl p-3">
              <p className="text-xs text-neutral-400 mb-1 uppercase">{k}</p>
              <ul className="list-disc pl-4">
                {v.map((i: string) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Projects" icon={<Rocket size={14} />}>
        <div className="grid md:grid-cols-3 gap-3 text-sm text-neutral-300">
          <ListCard title="Beginner" items={tech.projects.beginner} />
          <ListCard title="Intermediate" items={tech.projects.intermediate} />
          <ListCard title="Advanced" items={tech.projects.advanced} />
        </div>
      </Section>

      <Section title="Certifications">
        <List items={tech.certifications} />
      </Section>

      <Section title="Salary">
        <div className="glass rounded-xl p-3 text-cyanx-400 font-semibold flex items-center gap-2">
          <IndianRupee size={16} /> {tech.salary}
        </div>
      </Section>

      <Section title="Companies">
        <div className="flex items-center gap-2 text-sm text-neutral-300">
          <Building2 size={14} className="text-brand-400" />
          <span>{tech.companies.slice(0, 8).join(', ')}</span>
        </div>
      </Section>

      <Section title="Future Demand">
        <p className="text-sm text-neutral-300">{tech.futureDemand}</p>
      </Section>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs uppercase text-neutral-400 mb-2">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full glass">{i}</span>)}
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