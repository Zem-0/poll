"use client";
import React, { useState, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ConversationInput = ({
  isInputBtnLoading,
  freeTextAnswer,
  setFreeTextAnswer,
  NextQuestion,
}: any) => {
  const [browserSupport, setBrowserSupport] = useState(true);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const toggleRecording = () => {
    if (!listening) {
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  };

  useEffect(() => {
    if (transcript) {
      setFreeTextAnswer(transcript);
      adjustHeight();
    }
  }, [transcript, setFreeTextAnswer]);

  // Ensure browser supports speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setBrowserSupport(false);
      console.log("Speech recognition is not supported by this browser");
    }
  }, [browserSupportsSpeechRecognition]);

  const adjustHeight = () => {
    setTimeout(() => {
      const textarea = document.getElementById(
        "chatInput"
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`; // ✅ Auto-expanding height
      }
    }, 0);
  };

  return (
    // <div className="border bg-white border-gray-200 rounded-md w-full  flex flex-row">
    <div className={`relative border bg-white border-gray-200 rounded-md w-full flex flex-row overflow-hidden ${listening ? "animate-pulse" : ""}`}>
        {listening && (
  <div className="absolute pointer-events-none top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse"></div>
)}
      <button
        className="h-full p-2 flex justify-center items-center rounded-r-md cursor-pointer"
        disabled={isInputBtnLoading || !browserSupport}
        onClick={toggleRecording}
      >
        {listening ? (
          <div className="bg-red-100 h-6 w-6 flex items-center justify-center rounded-md">
            <span className="w-3 h-3 border-2 border-red-400 rounded-sm"></span>
          </div>
        ) : (
          <div className="w-6 h-6 flex justify-center items-center ">
            <img
              src="/images/conversation/recorder.svg"
              alt="Start Recording"
              className="w-4 rounded-r-md"
            />
          </div>
        )}
      </button>
      <textarea
        id="chatInput"
        className="w-11/12 custom-scrollbar p-2 h-full max-h-24 placeholder:text-gray-300 flex-grow resize-none rounded-l-md outline-none break-words  overflow-auto no-scroll disabled:bg-transparent"
        rows={1}
        value={freeTextAnswer}
        onChange={(e) => {
          setFreeTextAnswer(e.target.value);
          adjustHeight();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            NextQuestion(); // Trigger function
          }
        }}
        placeholder="Add a response harshal"
        disabled={isInputBtnLoading || listening}
      />
      {isInputBtnLoading ? (
        <div className="p-2 flex items-center justify-center">
          <img
            className="w-6 h-6"
            src="/loaders/loader-blue.gif"
            alt="loading"
          />
        </div>
      ) : (
        <button
          className="h-full p-2  flex justify-center items-center rounded-r-md"
          onClick={() => {
            NextQuestion();
          }}
        >
          <img
            src="/images/conversation/send_icon.svg"
            alt=""
            className="h-6 rounded-r-md"
          />
        </button>
      )}
    </div>
  );
};

export default ConversationInput;
