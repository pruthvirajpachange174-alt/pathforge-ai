/** Renders the Chat Message interface component. */
import { Loader2 } from 'lucide-react';
import { MarkdownResponse } from './MarkdownResponse';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  interrupted?: string;
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const roadmapCards = message.role === 'assistant';

  return (
    <div className={`flex min-w-0 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`min-w-0 max-w-[92%] overflow-hidden rounded-2xl px-4 py-3 sm:max-w-[85%] ${
          isUser
            ? 'chat-user-message bg-gradient-to-br from-brand-600 to-cyanx-500 text-white'
            : 'glass w-full'
        }`}
      >
        {message.content
          ? <MarkdownResponse content={message.content} roadmapCards={roadmapCards} />
          : message.streaming
            ? <div className="flex items-center gap-2 text-sm text-neutral-500" role="status"><Loader2 className="animate-spin" size={16} />PathForge is thinking…</div>
            : null}
        {message.interrupted && (
          <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200" role="status">
            {message.interrupted}
          </p>
        )}
      </div>
    </div>
  );
}