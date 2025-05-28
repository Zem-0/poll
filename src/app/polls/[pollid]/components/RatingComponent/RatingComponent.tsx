import React, { useState, useCallback } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch, useSelector } from "react-redux";
import { handleQuestionChange } from "@/lib/features/workspace/workspaceSlice";
import { useSortable } from "@dnd-kit/sortable";
import { RootState } from "@/lib/store";
import RenderRating from "./RenderRating";

// Rating options
const ratingOptions = ["numeric", "hearts", "⁠⁠⁠⁠⁠⁠⁠⁠⁠⁠emoji", "stars"];

const RatingComponent = ({ item, setQuestion, question, dragStart }: any) => {
  const dispatch = useDispatch();
  const [ratingValue, setRatingValue] = useState(0);

  // Get the current question's rating type and scale from Redux
  const currentQuestion = useSelector((state: RootState) =>
    state.workspace.formData.outline.questions.find(
      (q) => q.question_number === item.question_number
    )
  );

  // Ensure correct rating type and scale
  const selectedFormat = (
    currentQuestion?.rating_type?.trim() || "numeric"
  ).toLowerCase();

  const maxScale = currentQuestion?.rating_scale?.max || 5;
  const itemCount = [5, 7, 10].includes(maxScale) ? maxScale : 5;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: String(item.question_number) });



  const handleQuestionClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") return;

      setQuestion((prev: any) => ({
        question_id:
          prev.question_id === item.question_number ? "" : item.question_number,
        question_type: item.type,
        show: prev.question_id !== item.question_number,
      }));
    },
    [item.question_number, item.type, setQuestion]
  );

  return (
    <div
      className="flex flex-col gap-8"
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={handleQuestionClick}
    >
      <div
        className={`bg-white shadow-sm rounded-xl p-6 ${item.question_number === question.question_id ? "shadow-xl border border-Purple-Border" : ""}`}
      >
        <div className="flex items-center">
          <div
            className="flex items-center justify-center p-2 cursor-move self-start shrink-0"
            {...attributes}
            {...listeners}
          >
            <img src="/images/workspace/dots.svg" alt="" className="w-4 h-4" />
          </div>
          <div className="px-2 flex flex-row justify-between items-start self-start rounded-md shrink-0">
            <div className="bg-Lt-Purple px-2 py-1 rounded-xl flex flex-row gap-2 justify-between items-center">
              <img src="/images/workspace/rating.svg" alt="icon" />
              <div className="font-xl text-end">{item.question_number}</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col text-Pri-Dark overflow-x-auto no-scrollbar">
            <textarea
              className={`w-full outline-none text-gray-900 whitespace-pre-line ${item.question_number === question.question_id ? "font-medium" : ""}`}
              value={item.question}
              rows={2}
              onFocus={() =>
                setQuestion({
                  question_id: item.question_number,
                  question_type: item.type,
                  show: true,
                })
              }
              onChange={(e) =>
                dispatch(
                  handleQuestionChange({
                    question_id: item.question_number,
                    question: e.target.value,
                  })
                )
              }
            />
            {!dragStart && (
              <div className="w-max mt-4">
                <RenderRating
                  selectedFormat={selectedFormat}
                  ratingValue={ratingValue}
                  setRatingValue={setRatingValue}
                  itemCount={itemCount}
                />
                {/* below is the rating label */}
                {/* <div className="flex m-2 items-center justify-between mt-3 text-sm text-gray-400">
                  <span>{item?.rating_labels?.[1] || "Very dissatisfied"}</span>
                  <span>
                    {item?.rating_labels?.[Math.ceil(itemCount / 2)] ||
                      "Neutral"}
                  </span>
                  <span>
                    {item?.rating_labels?.[itemCount] || "Very satisfied"}
                  </span>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingComponent;
