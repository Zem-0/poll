"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";
import {
  addMessage,
  addReportItem,
  editConversation,
  selectConversation,
  updateConversationPollId,
} from "@/lib/features/askPolly/askPollySlice";
import {
  Message,
  createBookmark,
  generateResponse,
  regenerateResponse,
  storeConversation,
  StoreConversationRequest,
  generateTitle,
} from "@/app/api/ask polly/polly";
import { AskPollyChatService } from "../services/chatService";
import ChatLoader from "@/components/ChatLoader";

interface ConversationProps {
  toggleReport: () => void;
  isReportVisible: boolean;
}

const Conversation: React.FC<ConversationProps> = ({
  toggleReport,
  isReportVisible,
}) => {
  const dispatch = useAppDispatch();
  const { pollid } = useParams();
  const pollId = Array.isArray(pollid) ? pollid[0] : pollid;
  const {
    conversations,
    selectedConversation: selectedConversationId,
    isLoading,
    currentPollId,
  } = useAppSelector((state) => state.askPolly);
  const [wsConnected, setWsConnected] = useState(false);
  const chatService = AskPollyChatService.getInstance();
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [messageSendingLoading, setMessageSendingLoading] = useState(false);
  const isStoring = useRef(false);

  const selectedConversation = conversations.find(
    (convo: any) => convo.conversation_id === selectedConversationId
  );

  const handleWebSocketMessage = useCallback(
    async (data: any) => {
      try {
        if (data.type === "response") {
          const activeConversationId = selectedConversationId;
          if (!activeConversationId) {
            console.warn("No active conversation available");
            return;
          }

          const currentConversation = conversations.find(
            (convo) => convo.conversation_id === activeConversationId
          );

          if (!currentConversation) {
            console.error(
              "Active conversation not found:",
              activeConversationId
            );
            return;
          }

          // Format the assistant message
          const assistantMessage: Message = {
            role: "assistant",
            content: data.content,
            timestamp: data.timestamp || new Date().toISOString(),
            insights: data.insights,
            metadata: data.metadata,
          };

          // Generate title if it doesn't exist
          if (!currentConversation.conversation_title) {
            try {
              const lastUserMessage = currentConversation.messages
                .slice()
                .reverse()
                .find((msg) => msg.role === "user");

              if (lastUserMessage) {
                const title = await generateTitle(lastUserMessage.content);

                dispatch(
                  editConversation({
                    id: activeConversationId,
                    conversation_title: title,
                  })
                );

                currentConversation.conversation_title = title;
              }
            } catch (error) {
              console.error("Error generating title:", error);
            }
          }

          dispatch(
            addMessage({
              conversationId: activeConversationId,
              message: assistantMessage,
              shouldStore: true,
            })
          );

          const storeRequest: StoreConversationRequest = {
            conversation_id: activeConversationId,
            conversation_title: currentConversation.conversation_title,
            messages: [...currentConversation.messages, assistantMessage],
            poll_id: pollId || currentPollId || "",
          };

          setMessageSendingLoading(false);
          await storeConversation(storeRequest);

          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight;
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        setMessageSendingLoading(false);
      }
    },
    [selectedConversationId, conversations, dispatch, pollId, currentPollId]
  );

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const initializeWebSocket = useCallback(async () => {
    const apiSecret = process.env.NEXT_PUBLIC_APISECRET;
    const userEmail = localStorage.getItem("email");

    if (!apiSecret || !userEmail || !selectedConversationId) {
      return;
    }

    if (wsConnected) {
      return;
    }

    try {
      const currentConversation = conversations.find(
        (convo) => convo.conversation_id === selectedConversationId
      );

      if (!currentConversation) {
        throw new Error("Conversation not found");
      }

      let initialTitle = currentConversation.conversation_title;

      const defaultTitleRegex = /^(new conversation|new chat(?: \d+)?)$/i;
      if (
        defaultTitleRegex.test(initialTitle) ||
        !initialTitle ||
        initialTitle === "New Chat"
      ) {
        const lastUserMessage = currentConversation.messages
          .filter((msg) => msg.role === "user")
          .pop();

        if (lastUserMessage) {
          try {
            initialTitle = await generateTitle(lastUserMessage.content);
            dispatch(
              editConversation({
                id: selectedConversationId,
                conversation_title: initialTitle,
              })
            );
          } catch (error) {
            console.error("Error generating title:", error);
          }
        } else {
          initialTitle = "New Conversation";
        }
      }

      chatService.initializeWebSocket(
        userEmail as string,
        apiSecret as string,
        handleWebSocketMessage,
        initialTitle
      );
      setWsConnected(true);
    } catch (error) {
      console.error("WebSocket initialization failed:", error);
      setWsConnected(false);
    }
  }, [
    selectedConversationId,
    wsConnected,
    handleWebSocketMessage,
    conversations,
    dispatch,
  ]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      dispatch(selectConversation(conversations[0].conversation_id));
    }
  }, [conversations, selectedConversationId, dispatch]);

  useEffect(() => {
    initializeWebSocket();
    return () => {
      chatService.disconnect();
    };
  }, [initializeWebSocket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || messageSendingLoading) return;

    if (!selectedConversationId) return;
    try {
      setMessageSendingLoading(true);
      const userMessage: Message = {
        role: "user",
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      dispatch(
        addMessage({
          conversationId: selectedConversationId!,
          message: userMessage,
          shouldStore: true,
        })
      );

      setNewMessage("");

      // Initialize assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      dispatch(
        addMessage({
          conversationId: selectedConversationId!,
          message: assistantMessage,
          shouldStore: false,
        })
      );

      // Use the streaming chat service
      await chatService.streamChat(
        newMessage,
        selectedConversationId!,
        (chunk) => {
          dispatch(
            addMessage({
              conversationId: selectedConversationId!,
              message: {
                ...assistantMessage,
                content: chunk,
              },
              shouldStore: false,
            })
          );
        },
        (error) => {
          console.error("Error in chat stream:", error);
          setMessageSendingLoading(false);
        }
      );

      setMessageSendingLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessageSendingLoading(false);
    }
  };

  const handleRegenerateResponse = async () => {
    if (!selectedConversation || !selectedConversationId || isStoring.current)
      return;

    // Ensure we have a poll ID
    const activePollId = pollId || currentPollId;
    if (!activePollId) {
      console.error("No poll ID available");
      alert("Unable to regenerate response: No poll ID available");
      return;
    }

    const lastUserMessage = selectedConversation.messages
      .slice()
      .reverse()
      .find((msg) => msg.role === "user");

    if (!lastUserMessage) return;

    try {
      isStoring.current = true;
      const response = await regenerateResponse(
        lastUserMessage.content,
        selectedConversation.messages
      );

      const newMessage: Message = {
        role: "assistant",
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      dispatch(
        addMessage({
          conversationId: selectedConversationId,
          message: newMessage,
          shouldStore: true, // Optional, but explicitly set when needed
        })
      );

      // Store the updated conversation
      const updatedConversation = conversations.find(
        (convo) => convo.conversation_id === selectedConversationId
      );

      if (updatedConversation) {
        // Get the existing conversation title or generate a new one
        let conversationTitle = updatedConversation.conversation_title;
        if (!conversationTitle) {
          conversationTitle = await generateTitle(lastUserMessage.content);
          dispatch(
            editConversation({
              id: selectedConversationId,
              conversation_title: conversationTitle,
            })
          );
        }

        const storeRequest: StoreConversationRequest = {
          conversation_id: selectedConversationId,
          conversation_title: conversationTitle,
          messages: [...updatedConversation.messages, newMessage],
          poll_id: activePollId, // Always use the active poll ID
        };

        await storeConversation(storeRequest);
      }
    } catch (error) {
      console.error("Error regenerating response:", error);
    } finally {
      isStoring.current = false;
    }
  };

  const handleCopyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddToReport = async (e: React.MouseEvent, text: string) => {
    // Stop event propagation
    e.preventDefault();
    e.stopPropagation();

    const activePollId = pollId || currentPollId;
    if (!activePollId) {
      console.error("No poll ID available");
      alert("Unable to bookmark: No poll ID available");
      return;
    }

    try {
      // Get the most recent user query
      const userQuery =
        selectedConversation?.messages
          .filter((msg) => msg.role === "user")
          .slice(-1)[0]?.content || "";

      // Create bookmark
      await createBookmark({
        title: userQuery.slice(0, 100), // Limit title length
        user_query: userQuery,
        base_response: text,
        poll_id: activePollId,
      });

      // Add to report store
      dispatch(
        addReportItem({
          text,
          user_query: userQuery,
        })
      );
    } catch (error: any) {
      console.error("Error creating bookmark:", error);

      // More specific error messaging
      if (error.response?.status === 500) {
        console.error("Server error creating bookmark:", error.response);
        alert("Server error creating bookmark. Please try again.");
      } else if (error.message === "Missing required fields for bookmark") {
        alert("Please ensure all required fields are provided.");
      } else {
        alert(error.response?.data?.detail || "Failed to create bookmark");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <img src="/loaders/loader-blue.gif" alt="Send" className="w-16 h-16" />
      </div>
    );
  }

  const parseTitle = (title: any) => {
    try {
      // If title is undefined or null, return default
      if (!title) return "New Conversation";

      // First try to parse as JSON if it looks like JSON
      let processedTitle = title;
      if (
        typeof title === "string" &&
        (title.startsWith('"') || title.startsWith("{"))
      ) {
        try {
          processedTitle = JSON.parse(title);
        } catch {
          processedTitle = title;
        }
      }

      // Remove any markdown formatting (**, __, etc)
      return processedTitle
        .replace(/\*\*/g, "") // Remove bold markers
        .replace(/__/g, "") // Remove underscore emphasis
        .replace(/\\/g, "") // Remove escape characters
        .trim(); // Remove extra whitespace
    } catch (e) {
      // Fallback for any errors
      return title?.toString() || "New Conversation";
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-white p-4 shadow rounded-md">
      {/* Conversation Header */}
      <div className="items-center pb-2 mb-2">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-gray-400 truncate w-[50%]">
              {parseTitle(selectedConversation?.conversation_title)}
            </h2>
            <button
              onClick={toggleReport}
              className="ml-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <img
                src="/images/askPolly/slideBtn.svg"
                alt="Toggle"
                className="w-6 h-6"
              />
            </button>
          </div>
          <p className="text-xs text-center text-gray-400">
            {selectedConversation?.messages.length
              ? new Date(
                  selectedConversation.messages[
                    selectedConversation.messages.length - 1
                  ].timestamp
                ).toLocaleString()
              : "Start a new conversation"}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={chatContainerRef}
          className="absolute inset-0 flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar"
        >
          {selectedConversation ? (
            selectedConversation.messages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${message.timestamp}`}
                className={`${
                  message.role === "user"
                    ? "bg-gradient-to-b from-[#5E53DC] to-[#5083E2] self-end text-primaryWhite"
                    : "bg-gray-100"
                } px-6 py-3 rounded-2xl max-w-lg break-words shadow-sm relative ${
                  index === selectedConversation.messages.length - 1 &&
                  message.role === "assistant"
                    ? "mb-7"
                    : "mb-0"
                }`}
              >
                {message.role === "assistant" ? (
                  <div>
                    <ReactMarkdown className="text-[16px] text-inherit">
                      {message.content}
                    </ReactMarkdown>
                    {message.insights && (
                      <div className="text-[16px] text-inherit">
                        <ReactMarkdown>
                          {message.insights.insights}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[16px] text-inherit whitespace-pre-wrap">
                    {message.content}
                  </div>
                )}

                {/* Actions buttons for assistant messages */}
                {index === selectedConversation.messages.length - 1 &&
                  message.role === "assistant" && (
                    <div className="absolute top-full left-4 flex gap-2 items-center mt-3 text-xs">
                      <button
                        className="cursor-pointer active:scale-90 rounded-full py-1 px-2 bg-[#DBEAFF] flex items-center justify-center gap-2 hover:bg-[#C5DDFF] transition-colors"
                        onClick={handleRegenerateResponse}
                        disabled={isStoring.current}
                      >
                        <img
                          src="/images/askPolly/refreshBtn.svg"
                          alt="Refresh"
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Redo</span>
                      </button>
                      <button
                        className="cursor-pointer active:scale-90 rounded-full py-1 px-2 bg-[#DBEAFF] flex items-center justify-center gap-2 hover:bg-[#C5DDFF] transition-colors"
                        onClick={() => handleCopyMessage(message.content)}
                      >
                        <img
                          src="/images/askPolly/copy.svg"
                          alt="Copy"
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Copy</span>
                      </button>
                      <button
                        className="cursor-pointer active:scale-90 rounded-full py-1 px-2 bg-[#DBEAFF] flex items-center justify-center gap-2 hover:bg-[#C5DDFF] transition-colors"
                        onClick={(e) => handleAddToReport(e, message.content)}
                      >
                        <img
                          src="/images/askPolly/bookmark.svg"
                          alt="Bookmark"
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Bookmark</span>
                      </button>
                    </div>
                  )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 self-center">
              Select a conversation or start a new one.
            </p>
          )}
          {messageSendingLoading && <ChatLoader />}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex items-center border-t pt-4 mt-4">
        <div
          className={`w-full border border-gray-300 rounded-md flex ${
            isFocused ? "ring-1 ring-blue-600" : ""
          } hover:border-gray-400 transition-colors`}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask me something..."
            className="flex-1 p-2 bg-transparent border-none outline-none placeholder:text-gray-400"
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading || isStoring.current || messageSendingLoading}
          />
          {messageSendingLoading ? (
            <div className="ml-2 p-2">
              <img
                src="/loaders/loader-blue.gif"
                alt="Send"
                className="w-6 h-6"
              />
            </div>
          ) : (
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !newMessage.trim() || isStoring.current}
              className={`ml-2 p-2 text-white hover:bg-gray-100 rounded-full focus:outline-none transition-colors
                ${!newMessage.trim() || isLoading || isStoring.current ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <img
                src="/images/askPolly/sendBtn.svg"
                alt="Send"
                className="w-6 h-6"
              />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-400 text-xs text-center mt-2">
        Polly is in beta. Please review and verify answers before using it
        professionally.
      </p>
    </div>
  );
};

export default Conversation;