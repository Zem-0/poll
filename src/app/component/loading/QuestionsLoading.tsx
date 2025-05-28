import React from "react";

const QuestionsLoading: React.FC = () => {
  return (
    <div className="w-full animate-pulse space-y-4">
      {/* MCQ Question Skeleton */}
      <div className="h-full flex flex-col gap-3">
        <div className="box">
          <div className="bg-white shadow-sm rounded-xl flex flex-row p-6 items-start">
            {/* Drag Icon Placeholder */}
            <div className="flex items-center">
              <div className="w-4 h-6 bg-gray-300 rounded"></div>
            </div>
            {/* Question Type Badge Placeholder */}
            <div className="w-1/12 px-2 flex flex-row justify-between items-start rounded-md">
              <div className="bg-gray-300 h-6 px-4 py-2 rounded-xl"></div>
            </div>
            {/* Question Text and Options Placeholder */}
            <div className="w-10/12 flex-1 flex flex-col text-Pri-Dark">
              <div className="bg-gray-300 h-6 rounded w-3/4 mb-2"></div>
              <div className="space-y-2 mt-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 h-4 rounded w-full"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="box">
          <div className="bg-white shadow-sm rounded-xl flex flex-row p-6 items-start">
            {/* Drag Icon Placeholder */}
            <div className="flex items-center">
              <div className="w-4 h-6 bg-gray-300 rounded"></div>
            </div>
            {/* Question Type Badge Placeholder */}
            <div className="w-1/12 px-2 flex flex-row justify-between items-start rounded-md">
              <div className="bg-gray-300 h-6 px-4 py-2 rounded-xl"></div>
            </div>
            {/* Question Text Placeholder */}
            <div className="w-10/12 flex-1 flex flex-col text-Pri-Dark">
              <div className="bg-gray-300 h-6 rounded w-3/4 mb-2"></div>
            </div>
          </div>
        </div>

        <div className="box">
          <div className="bg-white shadow-sm rounded-xl flex flex-row p-6 items-start">
            {/* Drag Icon Placeholder */}
            <div className="flex items-center">
              <div className="w-4 h-6 bg-gray-300 rounded"></div>
            </div>
            {/* Question Type Badge Placeholder */}
            <div className="w-1/12 px-2 flex flex-row justify-between items-start rounded-md">
              <div className="bg-gray-300 h-6 px-4 py-2 rounded-xl"></div>
            </div>
            {/* Question Text Placeholder */}
            <div className="w-10/12 flex-1 flex flex-col text-Pri-Dark">
              <div className="bg-gray-300 h-6 rounded w-3/4 mb-2"></div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
};

export default QuestionsLoading;
