/** Renders the Chat application page. */
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { api } from '@/lib/api';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, type Message } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { consumeChatStream } from '@/lib/chatStream';

type Msg = Message;

export default function Chat() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: input };
    const assistantIndex = messages.length + 1;
    setMessages((current) => [...current, userMsg, { role: 'assistant', content: '', streaming: true }]);
    setInput('');
    setLoading(true);

    try {
      const baseUrl = api.defaults.baseURL?.replace(/\/+$/, '');
      if (!baseUrl) throw new Error('The chat API URL is not configured.');

      const token = await getToken();
      const response = await fetch(`${baseUrl}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ conversationId, message: userMsg.content }),
      });
      if (!response.ok) throw new Error(`Chat request failed with status ${response.status}.`);
      if (!response.body) throw new Error('The chat response stream is unavailable.');

      let streamError: string | undefined;

      const updateAssistant = (update: (message: Msg) => Msg) => {
        setMessages((current) => current.map((message, index) => (
          index === assistantIndex ? update(message) : message
        )));
      };

      const completed = await consumeChatStream(response.body, {
        onConversationId: setConversationId,
        onToken: (text) => updateAssistant((message) => ({ ...message, content: message.content + text })),
        onError: (message) => {
          streamError = message;
          updateAssistant((assistant) => ({ ...assistant, streaming: false, interrupted: message }));
        },
      });
      if (completed) updateAssistant((message) => ({ ...message, streaming: false }));

      if (!completed && !streamError) streamError = 'The connection ended before the answer was complete.';
      if (streamError) {
        updateAssistant((message) => ({
          ...message,
          content: message.content || 'I could not complete that response. Please try again.',
          streaming: false,
          interrupted: message.content ? streamError : undefined,
        }));
      } else {
        updateAssistant((message) => ({
          ...message,
          content: message.content || 'I could not generate a response. Please try again.',
          streaming: false,
        }));
      }
    } catch {
      setMessages((current) => current.map((message, index) => {
        if (index !== assistantIndex) return message;
        const assistant = message;
        return {
          ...assistant,
          content: assistant.content || 'I could not connect to PathForge AI. Please try again.',
          streaming: false,
          interrupted: assistant.content ? 'The response was interrupted before it finished.' : undefined,
        };
      }));
    } finally {
      setLoading(false);
    }
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
              <ChatMessage message={m} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <ChatInput value={input} onChange={setInput} onSend={send} loading={loading} />
    </div>
  );
}