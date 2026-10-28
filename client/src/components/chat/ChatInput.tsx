/** Renders the Chat Input interface component. */
import { Send, Loader2 } from 'lucide-react';

export function ChatInput({
  value,
  onChange,
  onSend,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
}) {
  return (
    <div className="glass-strong rounded-2xl p-3 flex items-end gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Ask about placements, exams, hackathons, roadmaps…"
        rows={1}
        className="flex-1 bg-transparent resize-none focus:outline-none text-sm py-2 px-3 max-h-40"
      />
      <button onClick={onSend} disabled={loading || !value.trim()} className="btn-primary disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
      </button>
    </div>
  );
}