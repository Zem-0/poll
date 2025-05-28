import { ChatMessage, ChatRequest } from './types';

const API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000/api/chat/stream';

export class ChatService {
  private static instance: ChatService;
  private currentController: AbortController | null = null;

  private constructor() {}

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async streamChat(
    message: string,
    threadId: string,
    onChunk: (content: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // Cancel any ongoing request
    if (this.currentController) {
      this.currentController.abort();
    }

    this.currentController = new AbortController();

    try {
      console.log('Making request to:', API_URL);
      const request: ChatRequest = {
        messages: [{ role: "user", content: message }],
        thread_id: threadId,
        auto_accepted_plan: false,
        max_plan_iterations: 3,
        max_step_num: 1,
        max_search_results: 3,
        enable_background_investigation: true
      };

      console.log('Request payload:', request);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
        body: JSON.stringify(request),
        signal: this.currentController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Response received, starting to read stream');
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream complete');
          break;
        }

        const text = new TextDecoder().decode(value);
        console.log('Received chunk:', text);
        buffer += text;

        // Process complete events
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep the last incomplete event in the buffer

        for (const event of events) {
          if (!event.trim()) continue;

          try {
            const [eventRaw, dataRaw] = event.split('\n');
            const [, eventType] = eventRaw.split('event: ');
            const [, data] = dataRaw.split('data: ');

            console.log('Processing event:', { eventType, data });

            const chatEvent = {
              type: eventType,
              data: JSON.parse(data)
            };

            if (chatEvent.type === 'message_chunk') {
              fullContent += chatEvent.data.content;
              console.log('Calling onChunk with:', chatEvent.data.content);
              onChunk(chatEvent.data.content);
            }
          } catch (e) {
            console.error('Error parsing event:', e, 'Event:', event);
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const [eventRaw, dataRaw] = buffer.split('\n');
          const [, eventType] = eventRaw.split('event: ');
          const [, data] = dataRaw.split('data: ');
          
          const chatEvent = {
            type: eventType,
            data: JSON.parse(data)
          };

          if (chatEvent.type === 'message_chunk') {
            fullContent += chatEvent.data.content;
            onChunk(chatEvent.data.content);
          }
        } catch (e) {
          console.error('Error parsing final buffer:', e);
        }
      }

      console.log('Stream processing complete, full content:', fullContent);
    } catch (error) {
      console.error('Error in streamChat:', error);
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error('An unknown error occurred'));
      }
    } finally {
      this.currentController = null;
    }
  }

  cancelCurrentRequest(): void {
    if (this.currentController) {
      this.currentController.abort();
      this.currentController = null;
    }
  }
} 