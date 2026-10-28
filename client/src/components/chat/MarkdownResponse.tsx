import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Flag, Target } from 'lucide-react';

const components: Components = {
  h1: ({ children }) => <h1 className="mb-4 mt-6 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-3 mt-6 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-5 text-lg font-semibold text-neutral-900 dark:text-white">{children}</h3>,
  p: ({ children }) => <p className="my-3 leading-7 text-neutral-700 dark:text-neutral-200">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 pl-6 marker:text-brand-500">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-6 marker:font-semibold marker:text-brand-500">{children}</ol>,
  li: ({ children }) => <li className="ps-1 leading-7 text-neutral-700 dark:text-neutral-200">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-neutral-950 dark:text-white">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 rounded-r-xl border-l-4 border-brand-500 bg-brand-500/5 px-4 py-2 text-neutral-700 dark:text-neutral-200">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-neutral-200 dark:border-white/10" />,
  table: ({ children }) => (
    <div className="my-4 max-w-full overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/10">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="bg-brand-500/10 px-4 py-3 font-semibold text-neutral-900 dark:text-white">{children}</th>,
  td: ({ children }) => <td className="border-t border-neutral-200 px-4 py-3 align-top text-neutral-700 dark:border-white/10 dark:text-neutral-200">{children}</td>,
  pre: ({ children }) => (
    <div className="my-4 max-w-full overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/10">
      <pre className="!m-0 min-w-max p-4 text-sm leading-6">{children}</pre>
    </div>
  ),
  code: ({ node: _node, className, children, ...props }) => {
    const isCodeBlock = className?.includes('hljs') || className?.includes('language-');
    return (
      <code className={`${className ?? ''} font-mono text-[0.9em] ${isCodeBlock ? '' : 'rounded-md bg-neutral-100 px-1.5 py-0.5 dark:bg-white/10'}`} {...props}>
        {children}
      </code>
    );
  },
  a: ({ href, children }) => {
    const safeHref = getSafeHref(href);
    return safeHref ? (
      <a className="font-medium text-brand-700 underline decoration-brand-500/40 underline-offset-2 hover:decoration-brand-500 dark:text-brand-400" href={safeHref} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : <span>{children}</span>;
  },
};

function getSafeHref(href?: string): string | undefined {
  if (!href) return undefined;
  try {
    const parsed = new URL(href, 'https://pathforge.invalid');
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) return href;
  } catch {
    return undefined;
  }
  return undefined;
}

function Markdown({ content }: { content: string }) {
  return (
    <div className="chat-markdown min-w-0 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
        urlTransform={(url) => getSafeHref(url) ?? ''}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

interface RoadmapPhase {
  title: string;
  body: string;
}

function getRoadmapPhases(content: string): { intro: string; phases: RoadmapPhase[] } | undefined {
  const headingPattern = /^#{2,3}\s+(Phase\s+\d+\b[^\r\n]*)\s*$/gim;
  const headings = [...content.matchAll(headingPattern)];
  if (headings.length === 0) return undefined;

  const firstHeading = headings[0];
  if (firstHeading.index === undefined) return undefined;

  const phases = headings.map((heading, index) => {
    const bodyStart = (heading.index ?? 0) + heading[0].length;
    const bodyEnd = headings[index + 1]?.index ?? content.length;
    return { title: heading[1].trim(), body: content.slice(bodyStart, bodyEnd).trim() };
  });

  return { intro: content.slice(0, firstHeading.index).trim(), phases };
}

export function MarkdownResponse({ content, roadmapCards = false }: { content: string; roadmapCards?: boolean }) {
  const roadmap = roadmapCards ? getRoadmapPhases(content) : undefined;
  if (!roadmap) return <Markdown content={content} />;

  return (
    <div className="space-y-4">
      {roadmap.intro && <Markdown content={roadmap.intro} />}
      <div className="grid gap-3 sm:grid-cols-2">
        {roadmap.phases.map((phase, index) => {
          const phaseNumber = phase.title.match(/^Phase\s+(\d+)/i)?.[1] ?? String(index + 1);
          const title = phase.title.replace(/^Phase\s+\d+\s*[:—–-]?\s*/i, '');
          const Icon = index === 0 ? Flag : Target;

          return (
            <section key={`${phase.title}-${index}`} className="min-w-0 rounded-2xl border border-brand-500/15 bg-gradient-to-br from-brand-500/[0.07] to-cyanx-500/[0.04] p-4 shadow-sm">
              <div className="mb-3 flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">Phase {phaseNumber}</p>
                  {title && <h3 className="mt-1 break-words text-base font-semibold text-neutral-900 dark:text-white">{title}</h3>}
                </div>
              </div>
              <Markdown content={phase.body} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
