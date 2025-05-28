// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react"; // Import Chevron icons
import {
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from "react";

import { cn } from "~/lib/utils";

import { Welcome } from "./welcome";
import ConversationHistory from "@/app/component/askpolly/components/ConversationHistory";

const questions = [
  "How many times taller is the Eiffel Tower than the tallest building in the world?",
  "How many years does an average Tesla battery last compared to a gasoline engine?",
  "How many liters of water are required to produce 1 kg of beef?",
  "How many times faster is the speed of light compared to the speed of sound?",
];

// Renaming ConversationStarter to Deer to match the file name and intended component usage.
export function Deer({
  className,
}: {
  className?: string;
}) {
  const [messages, setMessages] = useState<{
    text: string;
    sender: 'user' | 'bot'
  }[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar collapse

  const handleSendMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);
    // Here you would typically send the message to your backend/API
    console.log("Sending message:", message);
    // For now, let's simulate a bot response
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { text: `Echo: ${message}`, sender: 'bot' }]);
    }, 1000);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={cn("flex min-h-screen relative", className)}> {/* Added relative positioning here */}
      {/* Sidebar */}
      <div className={cn(
        "absolute top-0 left-0 border-r bg-gray-100 h-full overflow-y-auto custom-scrollbar transition-all duration-300", // Added transition
        isSidebarCollapsed ? "w-0" : "w-80" // Conditional width
      )}>
        {/* Conditionally render ConversationHistory or hide its content */}
        {!isSidebarCollapsed && <ConversationHistory />}
      </div>

      {/* Sidebar toggle button */}
      <button
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-md z-10 transition-all duration-300 hover:bg-gray-100", // Improved styling
          isSidebarCollapsed ? "left-0" : "left-80 -translate-x-1/2" // Position based on sidebar state
        )}
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Main content area */}
      <div className={cn(
        "flex-1 flex flex-col items-center p-6 transition-all duration-300",
        isSidebarCollapsed ? "ml-0" : "ml-80" // Conditional margin-left
      )}>
        {/* Added a container box around the content */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <div className="pointer-events-none flex items-center justify-center">
            <Welcome className="pointer-events-auto mb-8 w-[75%]" />
          </div>
          <ul className="flex flex-wrap justify-center mb-6">
            {questions.map((question, index) => (
              <motion.li
                key={question}
                className="flex w-full sm:w-1/2 shrink-0 p-2 active:scale-105"
                style={{ transition: "all 0.2s ease-out" }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.1 + 0.5,
                  ease: "easeOut",
                }}
              >
                <div
                  className="bg-card text-muted-foreground cursor-pointer rounded-2xl border px-4 py-4 opacity-75 transition-all duration-300 hover:opacity-100 hover:shadow-md text-center w-full"
                  onClick={() => {
                    handleSendMessage(question); // Use internal handler
                  }}
                >
                  {question}
                </div>
              </motion.li>
            ))}
          </ul>

          {/* Display messages */}
          <div className="flex flex-col gap-2 mb-6">
            {messages.map((message, index) => (
              <div key={index} className={cn(
                "p-3 rounded-lg",
                message.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'
              )}>
                {message.text}
              </div>
            ))}
          </div>

          {/* Added the chat input box component */}
          <InputBox onSend={handleSendMessage} />{/* Pass internal handler */}
        </div>
      </div>
    </div>
  );
}

// Provided code for the InputBox component (cleaned up and simplified)
export function InputBox({
  className,
  onSend,
}: {
  className?: string;
  onSend?: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [imeStatus, setImeStatus] = useState<"active" | "inactive">("inactive");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = useCallback(() => {
    if (message.trim() === "") {
      return;
    }
    if (onSend) {
      onSend(message);
      setMessage("");
    }
  }, [message, onSend]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        imeStatus === "inactive"
      ) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [imeStatus, handleSendMessage],
  );

  return (
    <div className={cn("bg-card relative rounded-[24px] border", className)}>
      <div className="w-full">
        {/* AnimatePresence and motion might be used for textbox animation, keep if needed */}
        <textarea
          ref={textareaRef}
          className={cn(
            "m-0 w-full resize-none border-none px-4 py-3 text-lg",
            "min-h-4",
            "focus:outline-none"
          )}
          placeholder="What can I do for you?"
          value={message}
          onCompositionStart={() => setImeStatus("active")}
          onCompositionEnd={() => setImeStatus("inactive")}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
      </div>
      <div className="flex items-center px-4 py-2">
        <div className="flex grow">{/* Placeholder for left-side content */ }</div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Simplified send button using a basic button and imported ArrowUp icon */}
          <button
            className={cn("h-10 w-10 rounded-full", "flex items-center justify-center bg-blue-500 text-white", "disabled:opacity-50 disabled:cursor-not-allowed")}
            onClick={handleSendMessage}
            disabled={message.trim() === ""}
          >
            <ArrowUp size={24} />
          </button>
        </div>
      </div>
    </div>
  );
} 