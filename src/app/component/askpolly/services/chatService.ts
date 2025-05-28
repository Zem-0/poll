import { Message } from "@/app/api/ask polly/polly";
import { WebSocketService } from "../components/Websockets";

const API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000/api/chat/stream';

export class AskPollyChatService {
  private static instance: AskPollyChatService;
  private wsService: WebSocketService | null = null;
  private currentController: AbortController | null = null;

  private constructor() {}

  static getInstance(): AskPollyChatService {
    if (!AskPollyChatService.instance) {
      AskPollyChatService.instance = new AskPollyChatService();
    }
    return AskPollyChatService.instance;
  }

  initializeWebSocket(
    userEmail: string,
    apiSecret: string,
    onMessage: (data: any) => void,
    initialTitle: string
  ): void {
    if (this.wsService) {
      this.wsService.disconnect();
    }

    this.wsService = new WebSocketService(
      userEmail,
      apiSecret,
      onMessage,
      initialTitle
    );
    this.wsService.connect();
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
      const request = {
        messages: [{ role: "user", content: message }],
        thread_id: threadId,
        auto_accepted_plan: false,
        max_plan_iterations: 3,
        max_step_num: 1,
        max_search_results: 3,
        enable_background_investigation: true
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: this.currentController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const events = text.split('\n\n');

        for (const event of events) {
          if (!event.trim()) continue;

          const [eventRaw, dataRaw] = event.split('\n');
          const [, eventType] = eventRaw.split('event: ');
          const [, data] = dataRaw.split('data: ');

          try {
            const chatEvent = {
              type: eventType,
              data: JSON.parse(data)
            };

            if (chatEvent.type === 'message_chunk') {
              fullContent += chatEvent.data.content;
              onChunk(chatEvent.data.content);
            }
          } catch (e) {
            console.error('Error parsing event:', e);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error('An unknown error occurred'));
      }
    } finally {
      this.currentController = null;
    }
  }

  disconnect(): void {
    if (this.wsService) {
      this.wsService.disconnect();
      this.wsService = null;
    }
    if (this.currentController) {
      this.currentController.abort();
      this.currentController = null;
    }
  }
} 