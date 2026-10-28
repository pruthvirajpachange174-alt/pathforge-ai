/** Renders the Glass Section interface component. */
import { ReactNode } from 'react';

export default function GlassSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(255,255,255,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        {icon ? <div className="text-white/80">{icon}</div> : null}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}
