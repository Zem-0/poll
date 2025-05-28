import React from "react";

type QuestionData = {
    question: string;
    options: string[]; // Optional, only for MCQ questions
    answers: { answer: string; count: number; percentage: number }[];
    total_count?: number; // Optional, only for Free Text questions
  };

  type MCQQuestionProps = {
    questionId: string;
    questionData: QuestionData;
  };
  

const MCQQuestion: React.FC<MCQQuestionProps> = ({ questionId, questionData }) => {
    const { question, options, answers } = questionData;
  
    return (
      <div className="bg-white p-6 rounded-lg flex flex-col gap-4" key={questionId}>
        <div className="flex flex-row justify-between">
          <div>
            <div className="bg-Paused-button px-4 py-1.5 rounded-lg flex flex-row items-center gap-2">
              <img src="/images/workspace/single_choice.svg" alt="" />
              <div className="font-xl w-4rem text-end">{questionId}</div>
            </div>
          </div>
          <button className="ml-auto">
            <img src="/images/workspace/menu.svg" alt="" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-Pri-Dark text-[17px] font-normal mb-2">{question}</div>
          {options.map((option, optionIndex) => {
            const matchedAnswer = answers.find(
              (answer) => answer.answer === option
            );
            const count = matchedAnswer ? matchedAnswer.count : 0;
            const percentage = matchedAnswer ? matchedAnswer.percentage : 0;
  
            return (
              <div
                className="flex flex-row items-center justify-between gap-2 relative"
                key={optionIndex}
              >
                <div className="relative bg-Lt-gray w-[80%] h-10 rounded-lg overflow-hidden px-2 flex items-center">
                  <div
                    className="absolute h-full top-0 left-0 bg-Golden-yellow"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <p className="font-normal text-medium z-10 relative">
                    {option}
                  </p>
                </div>
                <div>
                  {percentage.toFixed(1)} % ({count})
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default MCQQuestion;
  