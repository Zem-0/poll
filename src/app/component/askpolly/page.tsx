"use client";

import { useState } from 'react';
import ConversationHistory from './components/ConversationHistory';
import Conversation from './components/Conversation';
import ReportSection from './components/ReportSection';

const AskPolly = () => {

  const [isReportVisible, setIsReportVisible] = useState(false);

  const toggleReportVisibility = () => {
    setIsReportVisible(prev => !prev);
  };

  return (
    <div className="flex flex-col md:flex-row h-full flex-1">
      {/* Sidebar with conversation history */}
      <div className="md:w-1/4 w-full relative overflow-hidden">
        <ConversationHistory />
      </div>

      {/* Main conversation area */}
      <div 
        className={`md:w-${isReportVisible ? '2/4' : '3/4'} w-full p-4 transition-all duration-200 ease-out bg-gray-100 custom-scrollbar`}
      >
        <Conversation
          toggleReport={toggleReportVisibility}
          isReportVisible={isReportVisible}
        />
      </div>

      {/* Report section */}
      <div 
        className={`${
          isReportVisible ? 'w-0 opacity-0' : 'md:w-1/4 w-full opacity-100'
        } overflow-hidden bg-gray-50 p-4 transition-all duration-200 ease-out`}
      >
        <ReportSection 
          isReportVisible={isReportVisible}
          onClose={toggleReportVisibility}
        />
      </div>
    </div>
  );
};

export default AskPolly;