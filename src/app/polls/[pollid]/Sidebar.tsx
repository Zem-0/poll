import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInitialForm } from "@/lib/features/dashboard/updatePoll";
import { backgroundBlur } from "@/lib/features/workspace/outlineSlice";
import { fetchPollDetails } from "@/app/api/forms/updatePoll";
import { deleteQuestion, duplicateQuestion } from "@/app/api/forms/poll";
import QuestionSettings from "./components/PollSettings/QuestionSettings";
import PollSettingsSection from "./components/PollSettings/PollSettingsSection";
import PollSettingsPoll from "./components/PollSettings/pollSettingsPoll";
import { handleBasicData } from "@/lib/features/workspace/workspaceSlice";
import { useToast } from "@/app/component/ToasterProvider";

interface SidebarProps {
  question_id: string;
  question_type: string;
  pollId: string;
  show: boolean;
  setQuestion: (params: { question_id: string; question_type: string; show: boolean }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  question_id,
  question_type,
  pollId,
  show,
  setQuestion,
}) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state: any) => state.workspace.formData);
  const outlineSlice = useSelector((state: any) => state.outline);

  const [sidebarSettings, setSidebarSettings] = useState("section");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [duplicateSuccess, setDuplicateSuccess] = useState(false);
  const { showToast } = useToast();

  // Update questions in store after duplication
  const updateQuestionsWithDuplicate = (newQuestionData: any) => {
    const currentQuestions = [...workspace.outline.questions];
    const insertIndex = parseInt(newQuestionData.new_question_number) - 1;
    
    // Find the question to duplicate
    const questionToDuplicate = currentQuestions.find(
      (q: any) => q.question_number === question_id
    );

    if (!questionToDuplicate) return;

    // Create new questions array with updated numbering
    const updatedQuestions = [...currentQuestions];

    // Shift question numbers for all questions after the insertion point
    for (let i = 0; i < updatedQuestions.length; i++) {
      const qNum = parseInt(updatedQuestions[i].question_number);
      if (qNum >= parseInt(newQuestionData.new_question_number)) {
        updatedQuestions[i] = {
          ...updatedQuestions[i],
          question_number: (qNum + 1).toString()
        };
      }
    }

    // Create the duplicated question
    const duplicatedQuestion = {
      ...questionToDuplicate,
      question_number: newQuestionData.new_question_number
    };

    // Insert the duplicated question at the correct position
    updatedQuestions.splice(insertIndex, 0, duplicatedQuestion);

    // Update the Redux store
    dispatch(
      handleBasicData({
        outline: {
          ...workspace.outline,
          questions: updatedQuestions,
          numberofquestions: updatedQuestions.length,
        },
      })
    );
  };

  // Update Redux store after question deletion
  const updateQuestionsInStore = (questionIdToRemove: string) => {
    const updatedQuestions = workspace.outline.questions
      .filter((q: any) => q.question_number !== questionIdToRemove)
      .map((q: any, index: number) => ({
        ...q,
        question_number: (index + 1).toString(),
      }));

    dispatch(
      handleBasicData({
        outline: {
          ...workspace.outline,
          questions: updatedQuestions,
          numberofquestions: updatedQuestions.length,
        },
      })
    );
  };

  const handleDuplicateQuestion = async () => {
    if (!question_id || isDuplicating) return;
  
    try {
      setIsDuplicating(true);
      const access_token = localStorage.getItem("access_token");
  
      if (!access_token) {
        throw new Error("Authentication required");
      }
  
      // Convert question_id to integer before sending
      const response = await duplicateQuestion(access_token, {
        outline_id: pollId,
        question_number: parseInt(question_id).toString()
      });
  
      if (response?.status === 200) {
        updateQuestionsWithDuplicate(response.data);
        setDuplicateSuccess(true);
        showToast({ type: "info", message: "Question duplicated successfully!" });
  
        setTimeout(() => {
          setDuplicateSuccess(false);
        }, 2000);
      } else {
        showToast({ type: "error", message: "Failed to duplicate question!" });
        throw new Error("Failed to duplicate question");
      }
    } catch (error) {
      console.error("Error duplicating question:", error);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!question_id || isDeleting) return;

    try {
      setIsDeleting(true);
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        throw new Error("Authentication required");
      }

      const response = await deleteQuestion(access_token, {
        outline_id: pollId,
        question_number: question_id,
      });

      if (response?.status === 200) {
        updateQuestionsInStore(question_id);
        setSidebarSettings("section");
        setQuestion({
          question_id: "",
          question_type: "",
          show: false,
        });
        showToast({ type: "info", message: "Question deleted successfully!" });
      } else {
        showToast({ type: "error", message: "Failed to delete question!" });
        throw new Error("Failed to delete question");
      }
    } catch (error) {
      showToast({ type: "error", message: "Failed to delete question!" });
      console.error("Error deleting question:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (question_id !== "") {
      setSidebarSettings("question");
    }
    if (question_id === "" || show === false) {
      setSidebarSettings("section");
    }
  }, [question_id, show]);

  return (
    <div
      className={`${
        outlineSlice.workspackeBlur === true && sidebarSettings === "poll"
          ? "w-full max-w-[840px]"
          : "w-[400px]"
      } z-30 transition-all duration-300 bg-Almost-white overflow-auto no-scrollbar h-screen p-4 sticky top-0 left-0 border-l border-yellow-500`}
    >
      <div className="text-Dark-gray font-sans text-[22px]">Settings</div>

      <div className="flex text-medium font-medium flex-row mb-4 mt-2 gap-8 p-2">
        {question_id !== "" && show === true && (
          <button
            className={`${
              sidebarSettings === "question"
                ? "border-b-2 font-semibold border-Purple-Border text-Normal-Blue"
                : "font-normal"
            } text-base pr-2 transition-all duration-200`}
            onClick={() => {
              dispatch(backgroundBlur({ open: false }));
              setSidebarSettings("question");
            }}
          >
            Question
          </button>
        )}

        <button
          className={`${
            sidebarSettings === "section"
              ? "border-b-2 border-Purple-Border text-base font-semibold text-Normal-Blue"
              : "font-normal"
          } pr-2 transition-all duration-200`}
          onClick={() => {
            dispatch(backgroundBlur({ open: false }));
            setSidebarSettings("section");
          }}
        >
          Section
        </button>

        <button
          className={`${
            sidebarSettings === "poll"
              ? "border-b-2 border-Purple-Border text-base font-semibold text-Normal-Blue"
              : "font-normal text-normal"
          } transition-all duration-200`}
          onClick={() => {
            dispatch(backgroundBlur({ open: false }));
            setSidebarSettings("poll");
          }}
        >
          Poll
        </button>
      </div>

      <hr className="max-w-72" />

      {question_id !== "" && sidebarSettings !== "poll" && show === true && (
        <div className="w-full flex items-center p-2">
          <div className="flex items-center gap-2">
            <img
              className=""
              src="/images/workspace/single_choice.svg"
              alt=""
            />
            <div>{question_id}</div>
          </div>

          <div className="ml-auto flex items-center">
            <button
              className={`p-2 relative transition-all duration-200 ${
                isDuplicating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 rounded-md"
              }`}
              onClick={handleDuplicateQuestion}
              disabled={isDuplicating}
              title="Duplicate question"
            >
              <img
                src="/images/workspace/copy.svg"
                alt="Copy"
                className={`transition-opacity duration-50 ${
                  isDuplicating ? "opacity-50" : ""
                }`}
              />
              {duplicateSuccess && (
                <div className="absolute -top-8 left-1/2 duration-50 transform -translate-x-1/2 bg-gray-500 text-white text-xs py-1 px-2 rounded animate-fade-out">
                  Duplicated!
                </div>
              )}
            </button>
            <button
              className={`p-2 transition-all duration-200 ${
                isDeleting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 rounded-md"
              }`}
              onClick={handleDeleteQuestion}
              disabled={isDeleting}
              title="Delete question"
            >
              <img
                src="/images/workspace/delete.svg"
                alt="Delete"
                className={`transition-opacity duration-200 ${
                  isDeleting ? "opacity-50" : ""
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Content sections */}
      {sidebarSettings === "question" && (
        <QuestionSettings
          question_id={question_id}
          question_type={question_type}
          pollId={pollId}
          show={show}
        />
      )}
      {sidebarSettings === "section" && (
        <PollSettingsSection
          question_id={question_id}
          question_type={question_type}
          pollId={pollId}
          show={show}
        />
      )}
      {sidebarSettings === "poll" && (
        <PollSettingsPoll
          question_id={question_id}
          question_type={question_type}
          pollId={pollId}
          show={show}
        />
      )}
    </div>
  );
};

export default Sidebar;