import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import WordCloud from "react-wordcloud";

type QuestionData = {
  question: string;
  options?: string[]; // Optional, only for MCQ questions
  answers: { answer: string; count: number; percentage: number }[];
  total_count?: number; // Optional, only for Free Text questions
};

type FreeTextQuestionProps = {
  questionId: string;
  questionData: QuestionData;
};

const FreeTextQuestion: React.FC<FreeTextQuestionProps> = ({
  questionId,
  questionData,
}) => {
  const { question, answers, total_count } = questionData;

  // Toggle state
  const [isWordCloud, setIsWordCloud] = useState(false);

  // Prepare word cloud data
  const wordCloudData = answers.map((answer) => ({
    text: answer.answer,
    value: answer.count,
  }));

  // Check if there are no answers
  const noAnswers = answers.length === 0;

  return (
    <div className="bg-white p-6 rounded-lg flex flex-col gap-4" key={questionId}>
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-purple-200 px-4 py-1.5 rounded-lg flex items-center gap-2">
            <img src="/images/workspace/single_choice.svg" alt="icon" />
            <div className="font-xl w-4rem text-end">{questionId}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className={`text-sm font-medium ${noAnswers ? "text-gray-400" : "text-gray-600"}`}>
            Word cloud
          </label>
          <Switch
            checked={isWordCloud}
            onChange={setIsWordCloud}
            disabled={noAnswers}
            className={`${noAnswers ? "bg-gray-200" : isWordCloud ? "bg-indigo-600" : "bg-gray-300"}
              relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                isWordCloud ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <button className="ml-auto">
            <img src="/images/workspace/menu.svg" alt="menu" />
          </button>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex flex-col gap-3">
        <div className="text-gray-800 text-lg font-medium">{question}</div>
        {isWordCloud ? (
          <div className="mt-4 max-h-[350px] ">
            <WordCloud
              words={wordCloudData}
              options={{
                rotations: 2,
                rotationAngles: [-90, 0],
                fontSizes: [20, 60],
                colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto custom-scrollbar">
            {answers.map(
              (answer, index) =>
                answer.answer && (
                  <div className="flex items-center gap-2" key={index}>
                    <div>{index + 1}.</div>
                    <div className="text-medium">{answer.answer}</div>
                  </div>
                )
            )}
          </div>
        )}
        <div className="text-gray-500 text-sm">{total_count} people responded</div>
      </div>
    </div>
  );
};

export default FreeTextQuestion;
