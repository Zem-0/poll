import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch } from '@/lib/store';
import { addMessage, updateConversationPollId } from '@/lib/features/askPolly/askPollySlice';

type MessageRole = 'assistant' | 'user';

interface Message {
    role: MessageRole;
    content: string;
    timestamp: string;
    insights?: any;
    metadata?: any;
}

export function useWebSocket(
    userId: string | null,
    apiSecret: string | null,
    conversationId: string | null,
    pollId: string | null,
    conversationTitle: string
) {
    const dispatch = useAppDispatch();
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const connectionAttempts = useRef(0);
    const maxRetries = 3;
    const retryDelay = 1000;

    const connect = useCallback(() => {
        if (!userId || !apiSecret || !conversationTitle) {
            setError('Missing required connection parameters');
            return;
        }

        if (isConnecting) {
            return;
        }

        setIsConnecting(true);

        // Close any existing connection
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        try {
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
            const params = new URLSearchParams({
                api_secret: apiSecret,
                conversation_title: encodeURIComponent(conversationTitle)
            });

            if (conversationId) {
                params.append('conversation_id', conversationId);
            }
            if (pollId) {
                params.append('poll_id', pollId);
            }

            // console.log('Connecting WebSocket...', {
            //     userId,
            //     conversationId,
            //     title: conversationTitle,
            //     pollId
            // });

            const ws = new WebSocket(`${wsUrl}/chat/${encodeURIComponent(userId)}?${params}`);

            ws.onopen = () => {
                console.log('WebSocket connected successfully');
                setIsConnected(true);
                setIsConnecting(false);
                setError(null);
                connectionAttempts.current = 0;
            };

            ws.onclose = () => {
                console.log('WebSocket closed');
                setIsConnected(false);
                wsRef.current = null;

                // Attempt reconnection if appropriate
                if (connectionAttempts.current < maxRetries) {
                    connectionAttempts.current++;
                    setTimeout(() => {
                        setIsConnecting(false);
                        connect();
                    }, retryDelay * Math.pow(2, connectionAttempts.current));
                } else {
                    setError('Failed to establish connection after multiple attempts');
                    setIsConnecting(false);
                }
            };

            ws.onerror = (event) => {
                console.error('WebSocket error:', event);
                setError('Connection error occurred');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'response' && conversationId) {
                        const message: Message = {
                            role: 'assistant',
                            content: data.content,
                            timestamp: new Date().toISOString(),
                            insights: data.insights,
                            metadata: data.metadata
                        };

                        dispatch(addMessage({
                            conversationId,
                            message,
                            shouldStore: true
                        }));

                        if (pollId) {
                            dispatch(updateConversationPollId({
                                conversationId,
                                pollId
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            };

            wsRef.current = ws;

        } catch (error) {
            console.error('Error initiating WebSocket connection:', error);
            setError('Failed to initiate connection');
            setIsConnecting(false);
        }
    }, [userId, apiSecret, conversationId, pollId, conversationTitle, dispatch]);

    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [connect]);

    const sendMessage = useCallback(async (content: string) => {
        // Wait for connection before sending
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            let attempts = 0;
            while (attempts < 3) {
                await new Promise(resolve => setTimeout(resolve, 500));
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    break;
                }
                attempts++;
            }
            
            if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
                throw new Error('WebSocket connection not available');
            }
        }

        const message = {
            content,
            conversation_id: conversationId,
            conversation_title: conversationTitle,
            poll_id: pollId,
            timestamp: new Date().toISOString()
        };

        try {
            wsRef.current.send(JSON.stringify(message));
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
            throw error;
        }
    }, [wsRef, conversationId, conversationTitle, pollId]);

    return {
        sendMessage,
        isConnected,
        error,
        isConnecting
    };
}