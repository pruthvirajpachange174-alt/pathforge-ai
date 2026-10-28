/** Renders the Chips interface component. */
import { cn } from '@/lib/utils';

export default function Chips({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((it) => (
        <span
          key={it}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
        >
          {it}
        </span>
      ))}
    </div>
  );
}
