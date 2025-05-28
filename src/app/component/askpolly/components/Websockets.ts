interface WebSocketMessage {
  content: string;
  conversation_id: string;
  poll_id?: string;
  type?: string;
  timestamp?: string;
  conversation_title: string;
}

export class WebSocketService {
    private ws: WebSocket | null = null;
    private messageQueue: WebSocketMessage[] = [];
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private isConnecting = false;
    private currentTitle: string;
    private currentConversationId: string | null = null;

    constructor(
        private userId: string,
        private apiSecret: string,
        private onMessage: (data: any) => void,
        initialTitle: string
    ) {
        this.currentTitle = initialTitle;
        console.log('WebSocketService constructed with title:', initialTitle);
    }
    
  connect() {
    if (this.isConnecting) {
        console.log('Connection already in progress');
        return;
    }

    if (!this.currentTitle) {
        console.error('Cannot connect without a title');
        return;
    }

    this.isConnecting = true;

    try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
        const params = new URLSearchParams({
            api_secret: encodeURIComponent(this.apiSecret),
            conversation_title: encodeURIComponent(this.currentTitle)
        });
        
        const fullUrl = `${wsUrl}/chat/${encodeURIComponent(this.userId)}?${params}`;
        
        console.log('Connecting to WebSocket...', {
            wsUrl,
            userId: this.userId,
            hasSecret: !!this.apiSecret,
            title: this.currentTitle
        });

        this.ws = new WebSocket(fullUrl);
        this.ws.onopen = this.handleOpen.bind(this);
        this.ws.onmessage = this.handleMessage.bind(this);
        this.ws.onclose = this.handleClose.bind(this);
        this.ws.onerror = this.handleError.bind(this);
        this.setupWebSocketHandlers();
    } catch (error) {
        console.error('Error initializing WebSocket:', error);
        this.isConnecting = false;
        throw error;
    }
}

  private setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
        console.log('WebSocket connected with title:', this.currentTitle);
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.processQueue();
    };
}
  private handleOpen() {
      console.log('WebSocket connection established');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.processQueue();
  }

  private handleMessage(event: MessageEvent) {
      try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', {
              type: data.type,
              hasContent: !!data.content
          });
          this.onMessage(data);
      } catch (error) {
          console.error('Error processing WebSocket message:', error);
      }
  }

  private handleClose(event: CloseEvent) {
      this.isConnecting = false;
      console.log('WebSocket closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
      });
      this.handleReconnection();
  }
  updateTitle(newTitle: string) {
    this.currentTitle = newTitle;
    console.log('Updated WebSocket title:', newTitle);
}
  private handleError(event: Event) {
      this.isConnecting = false;
      console.error('WebSocket error:', event);
  }

  setConversationId(id: string) {
    this.currentConversationId = id;
  }

  sendMessage(message: WebSocketMessage) {
    const messageWithContext = {
      ...message,
      conversation_title: this.currentTitle,
      conversation_id: message.conversation_id || this.currentConversationId || ''
    };

    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not ready, queueing message');
      this.messageQueue.push(messageWithContext);
      if (!this.isConnecting) {
        this.connect();
      }
      return;
    }

    try {
      console.log('Sending message:', messageWithContext);
      this.ws.send(JSON.stringify(messageWithContext));
    } catch (error) {
      console.error('Error sending message:', error);
      this.messageQueue.push(messageWithContext);
    }
  }


  private processQueue() {
      while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          if (message) {
              this.sendMessage(message);
          }
      }
  }

  private handleReconnection() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = 1000 * Math.pow(2, this.reconnectAttempts);
          console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
          
          setTimeout(() => {
              if (!this.isConnecting) {
                  this.connect();
              }
          }, delay);
      }
  }

  disconnect() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          console.log('Disconnecting WebSocket');
          this.ws.close();
      }
      this.ws = null;
      this.isConnecting = false;
  }
}