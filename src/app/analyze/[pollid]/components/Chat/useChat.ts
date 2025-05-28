import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  type?: 'message' | 'plan' | 'tool_result';
  data?: any;
};

export type ChatMode = 'chat' | 'research';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>('chat');
  const threadId = useRef(uuidv4());
  const abortController = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: mode === 'research' ? JSON.stringify({ title: content }) : content,
      type: 'message'
    };
    
    // Create messages array to send (include history + new user message)
    const messagesToSend = [...messages, userMessage];

    setMessages(prev => [...prev, userMessage]);

    // Add initial assistant message placeholder for streaming
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      type: 'message'
    };
    setMessages(prev => [...prev, assistantMessage]);

    // Create new abort controller
    abortController.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToSend, // Send the full history + new user message
          thread_id: threadId.current,
          auto_accepted_plan: false,
          max_plan_iterations: 3,
          max_step_num: 1,
          max_search_results: 3,
          enable_background_investigation: true,
          mcp_settings: {
            servers: {
              "default": {
                transport: "stdio",
                command: "uvx",
                args: ["mcp-github-trending"],
                enabled_tools: ["web_search", "crawl_tool"],
                add_to_agents: ["researcher"]
              }
            }
          }
        }),
        signal: abortController.current.signal
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.event === 'message_chunk') {
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content += data.content;
                }
                return newMessages;
              });
            } else if (data.event === 'plan') {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: '',
                type: 'plan',
                data: data
              }]);
            } else if (data.event === 'tool_call_result') {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: '',
                type: 'tool_result',
                data: data
              }]);
            }
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    } finally {
      setIsLoading(false);
      abortController.current = null;
    }
  }, [isLoading, mode, messages]);

  const cancelRequest = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'chat' ? 'research' : 'chat');
  }, []);

  return {
    messages,
    isLoading,
    error,
    mode,
    sendMessage,
    cancelRequest,
    toggleMode
  };
}; 