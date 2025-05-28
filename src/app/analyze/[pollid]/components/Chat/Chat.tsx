import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage as ChatMessageType } from './types';
import ReactMarkdown from 'react-markdown';
import { ChatService } from './chatService';
import ConversationHistory from '@/app/component/askpolly/components/ConversationHistory';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatService = ChatService.getInstance();
  const threadId = useRef(uuidv4());
  const currentMessageContent = useRef("");

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    currentMessageContent.current = "";
    const userMessage: ChatMessageType = { role: 'user', content: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    const assistantMessage: ChatMessageType = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);
    try {
      await chatService.streamChat(
        userMessage.content,
        threadId.current,
        (chunk) => {
          currentMessageContent.current += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content = currentMessageContent.current;
            }
            return newMessages;
          });
        },
        (error) => {
          setError(error.message);
          setIsLoading(false);
        }
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#f8f9fb]">
      {/* Sidebar */}
      <div className="w-[340px] min-w-[280px] max-w-[400px] border-r border-gray-200 bg-white h-full relative z-10 flex flex-col overflow-y-auto">
        {/* Inner container for scrollable content */}
        {/* Made this flex-col and ensured ConversationHistory is flex-1 */} 
        <div className="flex flex-col flex-1">
           {/* Conversation History - this should be the primary scrollable area within the sidebar */}
           <div className="flex-1 overflow-y-auto">
             <ConversationHistory />
           </div>
        
           {/* Add Knowledge section placeholder back - this section remains at the bottom */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
               <h3 className="text-lg font-semibold text-gray-700 mb-2">Knowledge</h3>
               {/* Add Knowledge settings components here */}
               <p className="text-sm text-gray-500">Knowledge section coming soon...</p>
           </div>
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Chat</h2>
        </div>
        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#f4f6fa] custom-scrollbar">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`max-w-xl px-5 py-3 rounded-2xl shadow-sm break-words relative
                ${message.role === 'user'
                  ? 'bg-gradient-to-b from-[#5E53DC] to-[#5083E2] self-end text-white'
                  : 'bg-white self-start text-gray-800 border border-gray-100'}
              `}
              style={{ wordBreak: 'break-word' }}
            >
              {message.role === 'assistant' ? (
                <ReactMarkdown className="prose prose-sm max-w-none text-inherit">
                  {message.content || '...'}
                </ReactMarkdown>
              ) : (
                <span className="whitespace-pre-wrap text-[16px]">{message.content}</span>
              )}
            </div>
          ))}
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 self-center mt-2">
              {error}
            </div>
          )}
        </div>
        {/* Message Input */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#f8f9fb] text-gray-800 placeholder:text-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
            className={`px-5 py-3 rounded-lg bg-gradient-to-b from-[#5E53DC] to-[#5083E2] text-white font-semibold shadow-md transition-all duration-150
              ${isLoading || !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 