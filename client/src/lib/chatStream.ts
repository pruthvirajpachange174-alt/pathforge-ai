export interface ChatStreamHandlers {
  onConversationId: (id: string) => void;
  onToken: (text: string) => void;
  onError: (message: string) => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function consumeChatStream(
  stream: ReadableStream<Uint8Array>,
  handlers: ChatStreamHandlers,
): Promise<boolean> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completed = false;

  const handleFrame = (frame: string) => {
    let event = 'message';
    const data: string[] = [];

    for (const line of frame.split(/\r?\n/)) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      if (line.startsWith('data:')) data.push(line.slice(5).trimStart());
    }
    if (data.length === 0) return;

    let payload: unknown;
    try {
      payload = JSON.parse(data.join('\n'));
    } catch {
      handlers.onError('The response stream contained malformed data. Please try again.');
      return;
    }
    if (!isRecord(payload)) return;

    if (event === 'meta' && typeof payload.conversationId === 'string') {
      handlers.onConversationId(payload.conversationId);
    } else if (event === 'token' && typeof payload.text === 'string') {
      handlers.onToken(payload.text);
    } else if (event === 'error') {
      handlers.onError(typeof payload.message === 'string' ? payload.message : 'The response was interrupted.');
    } else if (event === 'done') {
      completed = true;
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const frames = buffer.split(/\r?\n\r?\n/);
      buffer = frames.pop() ?? '';
      frames.forEach(handleFrame);
      if (done) break;
    }
    if (buffer.trim()) handleFrame(buffer);
  } finally {
    reader.releaseLock();
  }

  return completed;
}
