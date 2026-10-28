/** Renders the Chat Window interface component. */
import { ChatMessage, Message } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function ChatWindow({
  messages,
  input,
  onInputChange,
  onSend,
  loading,
}: {
  messages: Message[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
      </div>
      <ChatInput value={input} onChange={onInputChange} onSend={onSend} loading={loading} />
    </div>
  );
}