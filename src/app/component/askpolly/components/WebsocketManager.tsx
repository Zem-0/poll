import React, { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { 
  setWebSocketStatus,
  addMessage,
  updateConversationPollId 
} from '@/lib/features/askPolly/askPollySlice';

interface WebSocketManagerProps {
  userId: string;
  apiSecret: string;
  currentTitle: string;
  onMessage: (data: any) => void;
}

// Define proper types
type MessageRole = 'assistant' | 'user';

interface Message {
    role: MessageRole;
    content: string;
    timestamp: string;
    insights?: any;
    metadata?: any;
}

interface WebSocketResponse {
    type: string;
    content: string;
    conversation_id?: string;
    insights?: any;
    metadata?: any;
    timestamp?: string;
}

const WebSocketManager: React.FC<WebSocketManagerProps> = ({
  userId,
  apiSecret,
  currentTitle,
  onMessage
}) => {
  const dispatch = useAppDispatch();
  const wsRef = useRef<WebSocket | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 2000;

  const { selectedConversation, currentPollId } = useAppSelector(state => state.askPolly);

  const cleanupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  const handleWebSocketMessage = useCallback((data: WebSocketResponse) => {
    if (data.type === 'response' && data.conversation_id === selectedConversation) {
      const message: Message = {
        role: 'assistant' as MessageRole,
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString(),
        insights: data.insights,
        metadata: data.metadata
      };

      dispatch(addMessage({
        conversationId: selectedConversation,
        message,
        shouldStore: true
      }));

      if (currentPollId && data.conversation_id) {
        dispatch(updateConversationPollId({
          conversationId: data.conversation_id,
          pollId: currentPollId
        }));
      }

      onMessage(data);
    }
  }, [selectedConversation, currentPollId, dispatch, onMessage]);

  const connectWebSocket = useCallback(() => {
    if (!selectedConversation || !userId || !apiSecret) {
      console.log('Missing required connection parameters');
      return;
    }

    try {
      cleanupWebSocket();

      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
      const params = new URLSearchParams({
        api_secret: apiSecret,
        conversation_title: encodeURIComponent(currentTitle || 'New Chat'),
        conversation_id: selectedConversation
      });

      console.log('Connecting to WebSocket...', {
        userId,
        conversationId: selectedConversation,
        title: currentTitle
      });

      const ws = new WebSocket(`${wsUrl}/chat/${encodeURIComponent(userId)}?${params}`);

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        dispatch(setWebSocketStatus({ 
          connected: true, 
          error: null,
          reconnecting: false 
        }));
        retryCountRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketResponse;
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event);
        dispatch(setWebSocketStatus({ connected: false }));
        wsRef.current = null;

        if (retryCountRef.current < MAX_RETRIES) {
          dispatch(setWebSocketStatus({ reconnecting: true }));
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current += 1;
            console.log(`Retrying connection (${retryCountRef.current}/${MAX_RETRIES})...`);
            connectWebSocket();
          }, RETRY_DELAY * Math.pow(2, retryCountRef.current));
        } else {
          dispatch(setWebSocketStatus({ 
            error: 'Failed to establish WebSocket connection after multiple attempts' 
          }));
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        dispatch(setWebSocketStatus({ 
          connected: false, 
          error: 'WebSocket connection failed' 
        }));
      };

      wsRef.current = ws;

    } catch (error) {
      console.error('Error initiating WebSocket connection:', error);
      dispatch(setWebSocketStatus({ 
        connected: false, 
        error: 'Failed to initiate WebSocket connection' 
      }));
    }
  }, [selectedConversation, userId, apiSecret, currentTitle, dispatch, handleWebSocketMessage, cleanupWebSocket]);

  useEffect(() => {
    connectWebSocket();
    return cleanupWebSocket;
  }, [selectedConversation, userId, apiSecret, currentTitle, connectWebSocket, cleanupWebSocket]);

  useEffect(() => {
    return cleanupWebSocket;
  }, [cleanupWebSocket]);

  return null;
};

export default WebSocketManager;