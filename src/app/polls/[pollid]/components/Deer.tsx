// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ChevronLeft, ChevronRight, X } from "lucide-react"; // Added X icon
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
  pollId
}: {
  className?: string;
  pollId: string;
}) {
  const [messages, setMessages] = useState<{
    text: string;
    sender: 'user' | 'bot'
  }[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showResearchPanel, setShowResearchPanel] = useState(false);
  const [researchPlan, setResearchPlan] = useState<string | null>(null);
  const [researchResults, setResearchResults] = useState<string | null>(null);

  const handleSendMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);
    
    // Simulate research plan response for the first message
    if (messages.length === 0) {
      const plan = `# Research Plan for: ${message}

## 1. Data Collection
- Gather information about the subject
- Find reliable sources and statistics
- Compare different measurements and units

## 2. Analysis
- Process the collected data
- Calculate ratios and comparisons
- Verify accuracy of information

## 3. Presentation
- Format findings clearly
- Include relevant context
- Present final comparison

Would you like me to proceed with this research plan?`;
      
      setResearchPlan(plan);
      setShowResearchPanel(true);
    } else if (researchPlan && !researchResults) {
      // Simulate research results after plan approval
      const results = `# Research Results

## Findings
Based on comprehensive research:

- The Eiffel Tower stands at 324 meters tall
- The Burj Khalifa (tallest building) is 828 meters tall
- This means the Burj Khalifa is approximately 2.56 times taller than the Eiffel Tower

## Sources
- Official Eiffel Tower website
- Burj Khalifa official specifications
- World Building Database

## Additional Context
The Eiffel Tower was the tallest man-made structure in the world from 1889 to 1930, when it was surpassed by the Chrysler Building in New York City.`;
      
      setResearchResults(results);
    }
  }, [messages, researchPlan, researchResults]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeResearchPanel = () => {
    setShowResearchPanel(false);
    setResearchPlan(null);
    setResearchResults(null);
  };

  return (
    <div className={cn("flex min-h-screen", className)}>
      {/* Sidebar */}
      <div className={cn(
        "flex-shrink-0 border-r bg-gray-100 overflow-y-auto custom-scrollbar transition-all duration-300 relative",
        isSidebarCollapsed ? "w-0" : "w-80",
        !isSidebarCollapsed && "min-w-[320px]"
      )}>
        {!isSidebarCollapsed && <ConversationHistory />}
      </div>

      {/* Main content area and Research Panel Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <div className={cn(
          "flex-1 flex flex-col items-center p-6 overflow-y-auto transition-all duration-300 mt-24 custom-blue-scrollbar", // Added mt-24 to create space for the fixed header
          showResearchPanel ? "w-2/3" : "w-full" // Take up remaining space or full width
        )}>
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
                      handleSendMessage(question);
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
            <InputBox onSend={handleSendMessage} />
          </div>
        </div>

        {/* Research Panel */}
        <div className={cn(
          "w-0 transition-all duration-300 ease-in-out overflow-hidden bg-white border-l shadow-lg flex-shrink-0",
          showResearchPanel && "w-1/3"
        )}>
          {showResearchPanel && (
            <div className="flex flex-col h-full">
              {/* Panel Header */}
              <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                <h2 className="text-xl font-semibold"></h2>
                {/* Tabs (simplified) */}
                <div className="flex-grow mx-4">
                  <button className="px-4 py-2 text-sm font-medium border-b-2 border-blue-500">Report</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Activities</button>
                </div>
                <button
                  onClick={closeResearchPanel}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              {/* Panel Content - made scrollable */}
              <div className="p-6 flex-1 overflow-y-auto prose max-w-none custom-blue-scrollbar"> {/* Added custom-blue-scrollbar */}
                {researchPlan && !researchResults && (
                  <div className="mb-4">
                    {/* Use prose for basic markdown styling */}
                    <div className="whitespace-pre-wrap">{researchPlan}</div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleSendMessage("Yes, please proceed with the research plan.")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Proceed
                      </button>
                      <button
                        onClick={closeResearchPanel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {researchResults && (
                   // Use prose for basic markdown styling
                  <div className="whitespace-pre-wrap">{researchResults}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar toggle button - Positioned absolutely relative to the main container */}
      <button
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-md z-10 transition-all duration-300 hover:bg-gray-100",
          isSidebarCollapsed ? "left-0" : "left-80 -translate-x-1/2" // Position based on sidebar state
        )}
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-blue-scrollbar::-webkit-scrollbar {
          width: 8px; /* Width of the scrollbar */
        }

        .custom-blue-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; /* Track color */
          border-radius: 10px;
        }

        .custom-blue-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6; /* Blue color for the thumb */
          border-radius: 10px;
        }

        .custom-blue-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb; /* Darker blue on hover */
        }

        /* For Firefox */
        .custom-blue-scrollbar {
          scrollbar-width: thin; /* "auto" or "thin" */
          scrollbar-color: #3b82f6 #f1f1f1; /* thumb color track color */
        }
      `}</style>
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
        <div className="flex grow" />
        <div className="flex shrink-0 items-center gap-2">
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