import { QuestionTypes } from "@/constants/enums/QuestionTypes/QuestionTypes";
import { handleQuestionChange, handleQuestionOptions } from "@/lib/features/workspace/workspaceSlice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { useState, useCallback } from "react";

interface QuestionItemProps {
  item: any;
  setQuestion: React.Dispatch<React.SetStateAction<{
    question_id: string;
    question_type: string;
    show: boolean;
  }>>;
  question: {
    question_id: string;
    question_type: string;
    show: boolean;
  };
  dragStart: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ item, setQuestion, question, dragStart }) => {
  const dispatch = useDispatch();
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: String(item.question_number) });

  const parseOptions = useCallback((optionsString: string): string[] => {
    try {
      if (!optionsString) return [];
      const parsed = JSON.parse(optionsString);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return typeof optionsString === "string"
      ? optionsString.split("\n")
          .map(opt => opt.replace(/^[a-z]\.\s/, '')) // Remove prefix but preserve whitespace
          .filter(opt => opt.trim() !== "") // ✅ Ensure empty values are removed
      : []; 
    }
  }, []);

  const currentOptions = parseOptions(item.formatted_options || item.options);

  const handleOptionEdit = useCallback((index: number, newValue: string) => {
    let updatedOptions = [...currentOptions];
    updatedOptions[index] = newValue; // Store value as-is, including empty strings

    setQuestion({
      question_id: item.question_number,
      question_type: item.type,
      show: true, // ✅ Force the sidebar to open
    });

    dispatch(handleQuestionOptions({
      questions: [{
        question_id: item.question_number,
        options: JSON.stringify(updatedOptions),
        question_number: item.question_number
      }]
    }));
  }, [currentOptions, dispatch, item.question_number, setQuestion]);

  const handleAddOption = useCallback(() => {
    if (newOptionText === undefined) return;
    
    const updatedOptions = [...currentOptions, newOptionText];
    dispatch(handleQuestionOptions({
      questions: [{
        question_id: item.question_number,
        options: JSON.stringify(updatedOptions),
        question_number: item.question_number
      }]
    }));
    
    setNewOptionText("");
    setIsAddingOption(false);
  }, [currentOptions, dispatch, item.question_number, newOptionText]);

  const handleDeleteOption = useCallback((indexToDelete: number) => {
    const updatedOptions = currentOptions.filter((_, index) => index !== indexToDelete);
    dispatch(handleQuestionOptions({
      questions: [{
        question_id: item.question_number,
        options: JSON.stringify(updatedOptions),
        question_number: item.question_number
      }]
    }));
  }, [currentOptions, dispatch, item.question_number]);

  const handleQuestionClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
  
    // ✅ Ignore clicks inside input fields or options
    if (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.closest(".option-container")) {
      return;
    }
  
    // ✅ Toggle selection if clicking outside inputs
    setQuestion((prev) => ({
      question_id: prev.question_id === item.question_number ? "" : item.question_number,
      question_type: item.type,
      show: prev.question_id !== item.question_number,
    }));
  }, [item.question_number, item.type, setQuestion]);
  
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="w-full"
      onClick={handleQuestionClick}
    >
      <div className="h-full">
        <div className="box">
          <div
            className={`${
              item.question_number === question.question_id && question.show === true
                ? "shadow-xl border border-Purple-Border rounded-lg"
                : ""
            } bg-white shadow-sm rounded-xl flex flex-row p-6 items-start`}
          >
            <div 
              className="flex items-center p-2 cursor-move" 
              {...attributes} 
              {...listeners}
            >
              <img
                src="/images/workspace/dots.svg"
                alt=""
                className="w-4 h-4"
              />
            </div>
            <div className=" px-2 flex flex-row justify-between items-start rounded-md">
              <div
                className={`${
                  item.type === QuestionTypes.MCQ ? "bg-Lt-Aqua" : "bg-Yellow-Tag"
                } px-2 py-1 rounded-xl flex flex-row gap-2 justify-between items-center`}
              >
                <img
                  src={`/images/workspace/${
                    item.type === QuestionTypes.MCQ ? "multiple_choice" : "single_choice"
                  }.svg`}
                  alt=""
                />
                <div className="font-xl text-end">
                  {item.question_number}
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col text-Pri-Dark">
              <textarea
                className={`${
                  item.question_number === question.question_id
                    ? "font-medium"
                    : ""
                } w-full outline-none text-gray-900 `}
                value={item.question}
                rows={2}
                onFocus={() => {
                  setQuestion({
                    question_id: item.question_number,
                    question_type: item.type,
                    show: true,
                  });
                }}
                onChange={(e) => {
                  dispatch(
                    handleQuestionChange({
                      question_id: item.question_number,
                      question: e.target.value,
                    })
                  );
                }}
              />
              
              {item.type === QuestionTypes.MCQ && !dragStart && (
                <div className="flex grow flex-col mt-1">
                  {currentOptions.map((option, index) => (
                    <div key={index} className="relative flex items-center mb-2 group">
                      {editingOptionIndex === index ? (
                        <div className="flex-1 flex items-center">
                          <span className="mr-2">{String.fromCharCode(97 + index)}.</span>
                          <input
                            className="flex-1 outline-none bg-transparent"
                            value={option}
                            onChange={(e) => handleOptionEdit(index, e.target.value)}
                            onBlur={() => setEditingOptionIndex(null)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                setEditingOptionIndex(null);
                              }
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ) : (
                        <>
                        <div className="w-[72px] -left-[72px] h-full absolute  group flex items-center justify-center">
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOption(index);
                            }}
                            className="hidden group-hover:block text-red-500 hover:text-red-700 px-2"
                            aria-label="Delete option"
                          >
                            <img src="/images/workspace/delete.svg" alt="img" />
                          </button>
                        </div>

                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingOptionIndex(index);
                              setQuestion({
                                question_id: item.question_number,
                                question_type: item.type,
                                show: true, 
                              });
                            }}
                            className="flex-1 cursor-text"
                          >
                            {String.fromCharCode(97 + index)}. {option}
                          </span>
                          
                        </>
                      )}
                    </div>
                  ))}
                  
                  {isAddingOption ? (
                    <div className="flex items-center mb-2">
                      <span className="mr-2">{String.fromCharCode(97 + currentOptions.length)}.</span>
                      <input
                        className="flex-1 outline-none bg-transparent"
                        value={newOptionText}
                        onChange={(e) => setNewOptionText(e.target.value)}
                        placeholder="Add option"
                        onBlur={() => {
                          if (newOptionText !== undefined) {
                            handleAddOption();
                          }
                          setIsAddingOption(false);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newOptionText !== undefined) {
                            handleAddOption();
                          }
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAddingOption(true);
                      }}
                      className="text-left text-blue-600 hover:text-blue-800 mt-2"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;