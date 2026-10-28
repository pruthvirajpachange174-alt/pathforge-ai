/** Renders the Career Badge interface component. */
import { cn } from '@/lib/utils';

export type DemandLevel = 'Low' | 'Medium' | 'High';

export default function CareerBadge({
  level,
  className,
}: {
  level: DemandLevel | string;
  className?: string;
}) {
  const norm = String(level);
  const styles: Record<string, string> = {
    High: 'bg-rose-500/20 text-rose-200 border-rose-500/30',
    Medium: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
    Low: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
  };

  const s = styles[norm] ?? 'bg-white/10 text-white/80 border-white/15';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        s,
        className,
      )}
    >
      {norm}
    </span>
  );
}
