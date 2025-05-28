"use client";

import React from "react";
import { Question } from "@/app/types/Conversation/Conversation_Types";
import { QuestionTypes } from "@/constants/enums/QuestionTypes/QuestionTypes";
import RenderRating from "@/app/polls/[pollid]/components/RatingComponent/RenderRating";
import AttachmentComponent from "./AttachmentComponent";
import Text from "@/components/ui/Texts/Text";

interface ConversationQuestionProps {
  question: Question;
  selectedOptions: string[];
  handleOptionClick: (option: string) => void;
  ratingValue: number;
  setRatingValue: (value: number) => void;
}

const ConversationQuestionComponent: React.FC<ConversationQuestionProps> = ({
  question,
  selectedOptions,
  handleOptionClick,
  ratingValue,
  setRatingValue,
}) => {
    
  if (!question.type) return null;

  return (
    <div>
      {/* Question Text */}
      <div className="flex flex-col gap-2 h-full">
        <div className="w-[44px] flex justify-start items-end">
          <img src="/images/conversation/Squircle.png" alt="icon" />
        </div>
        <div className="w-full text-[16px] font-normal leading-[22px] text-[#183D81]">
          {question.question}
        </div>
      </div>

      {/* Attachment (If Any) */}
      <AttachmentComponent attachment={question.attachment} />

      {/* Free Text Answer Display */}
      {question.type === QuestionTypes.FREE_TEXT && question.answer && (
        <div className="mt-3 mb-3">
          <div className="flex flex-row h-full justify-end">
            <div className="w-max py-2 text-[#183D81] text-end bg-[#FFEFCB] rounded-xl px-4 rounded-br-none">
              {question.answer}
            </div>
          </div>
        </div>
      )}

      {/* Multiple Choice (MCQ) Options */}
      {question.type === QuestionTypes.MCQ && (
        <>
          <div className="text-end mt-4 text-[#183D81] text-sm font-medium">
            Select up to {question.max_no_of_choices || 1} options
          </div>

          {Array.isArray(question.options) &&
            question.options.map((option, index) => (
              <div key={index} className="my-2">
                <div className="flex flex-row h-full justify-end">
                  <button
                    className={`${
                      selectedOptions.includes(option)
                        ? "bg-[#FFEFCB] border-blue-800 text-[#183D81]"
                        : "hover:bg-[#FFEFCB] hover:bg-opacity-40 bg-transparent border-gray-300 text-textGray"
                    } text-medium font-normal p-2 rounded-xl border px-4 py-2 active:scale-95`}
                    name={option}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </button>
                </div>
              </div>
            ))}
        </>
      )}

      {/* Rating Question Display */}
      {question.type === QuestionTypes.RATING && (
        <div className="w-[280px] my-4">
          <RenderRating
            selectedFormat={question.rating_type}
            ratingValue={ratingValue}
            setRatingValue={setRatingValue}
            itemCount={question.rating_scale?.max}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationQuestionComponent;
