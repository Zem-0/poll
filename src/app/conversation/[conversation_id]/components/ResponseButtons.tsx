"use client";

import React from 'react';
import { FaTextHeight, FaBackward, FaPause, FaRedoAlt, FaStop } from 'react-icons/fa'; // Using Font Awesome icons as an example

interface ResponseButtonsProps {
  // Add props for handling button clicks here
  onTextInputClick: () => void;
  onSkipClick: () => void;
  onPauseClick: () => void;
  onRedoClick: () => void;
  onStopClick: () => void;
}

const ResponseButtons: React.FC<ResponseButtonsProps> = ({
  onTextInputClick,
  onSkipClick,
  onPauseClick,
  onRedoClick,
  onStopClick,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 p-4 bg-slate-900 rounded-xl">
      {/* Text size button */}
      <button
        onClick={onTextInputClick}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white text-lg"
        aria-label="Text Input"
      >
        Aa
      </button>

      {/* Rewind button */}
      <button
        onClick={onSkipClick} // Assuming Skip corresponds to Rewind based on context
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white text-lg"
        aria-label="Rewind"
      >
        <FaBackward />
      </button>

      {/* Pause button */}
      <button
        onClick={onPauseClick}
        className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-300 text-purple-800 text-2xl"
        aria-label="Pause"
      >
        <FaPause />
      </button>

      {/* Redo/Restart button */}
      <button
        onClick={onRedoClick}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white text-lg"
        aria-label="Redo"
      >
        <FaRedoAlt />
      </button>

      {/* Stop/Record button */}
      <button
        onClick={onStopClick}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white text-lg"
        aria-label="Stop Recording"
      >
        <FaStop />
      </button>
    </div>
  );
};

export default ResponseButtons; 