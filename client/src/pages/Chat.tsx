import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { api, attachToken } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Msg { role: 'user' | 'assistant'; content: string; }

export default function Chat() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { attachToken(() => getToken()); }, [getToken]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: input };
    setMessages((m) => [...m, userMsg, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat/message', { conversationId, message: userMsg.content });
      setConversationId(data.data.conversationId);
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: data.data.reply };
        return copy;
      });
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' };
        return copy;
      });
    } finally { setLoading(false); }
  };

  const suggestions = [
    'What should I learn after Java?',
    'Am I eligible for Smart India Hackathon?',
    'Give me a 2nd year full-stack roadmap',
    'Compare AI vs Cybersecurity careers',
    'How to prepare for Google interview?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-cyanx-500 grid place-items-center mx-auto mb-4">
              <Sparkles className="text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-2">Ask <span className="gradient-text">PathForge AI</span></h2>
            <p className="text-neutral-400 mb-6">Your 24/7 career mentor. Ask anything about placements, exams, tech, or hackathons.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="glass px-4 py-2 rounded-full text-sm hover:bg-white/10 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                m.role === 'user'
                  ? 'bg-gradient-to-br from-brand-600 to-cyanx-500 text-white'
                  : 'glass text-neutral-100'
              }`}>
                {m.content ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:gradient-text">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <Loader2 className="animate-spin" size={16} />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="glass-strong rounded-2xl p-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about placements, exams, hackathons, roadmaps…"
          rows={1}
          className="flex-1 bg-transparent resize-none focus:outline-none text-sm py-2 px-3 max-h-40"
        />
        <button onClick={send} disabled={loading || !input.trim()} className="btn-primary disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}