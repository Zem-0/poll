"use client";

import React, { useState } from "react";
import Button from "@/components/ui/buttons/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { handleBasicData } from "@/lib/features/workspace/workspaceSlice";
import axios from "axios";
import { addQuestionToPoll } from "@/app/api/ask polly/polly";
import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Text from "@/components/ui/Texts/Text";
import { useToast } from "@/app/component/ToasterProvider";

interface QuestionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  pollId: string;
}

const QuestionPopup: React.FC<QuestionPopupProps> = ({
  isOpen,
  onClose,
  pollId,
}) => {
  const [questionType, setQuestionType] = useState("MCQ");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();
  
   // Rating default values
   const [ratingType, setRatingType] = useState("numeric");
   const [ratingScale, setRatingScale] = useState({
     min: 1,
     max: 5,
     step: 1,
     default: 3,
   });
   const [ratingLabels, setRatingLabels] = useState({
     "1": "Poor",
     "2": "Fair",
     "3": "Good",
     "4": "Very Good",
     "5": "Excellent",
   });

  const dispatch = useDispatch();
  const workspace = useSelector((state: any) => state.workspace.formData);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleDeleteOption = (index: number) => {
    if (options.length > 2) {
      const updatedOptions = options.filter((_, i) => i !== index);
      setOptions(updatedOptions);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
  
      // Validation
      if (!questionText.trim()) {
        setErrorMessage("Question text is required");
        return;
      }
  
      if (questionType === "MCQ" && !options.some((opt) => opt.trim())) {
        setErrorMessage("At least one option is required");
        return;
      }
  
      const result = await addQuestionToPoll(
        pollId,
        questionText,
        questionType,
        options,
        ratingType,
        ratingScale,
        ratingLabels
      );
  
      if (result.success) {
        dispatch(handleBasicData({ outline: result.outline }));
        onClose();
        resetForm();
        showToast({ type: "success", message: "Question added successfully!" });
      } else {
        setErrorMessage(result.error);
        showToast({ type: "error", message: result.error });
      }
    } catch (error: any) {
      showToast({ type: "error", message: "Failed to add question. Please try again."})
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const resetForm = () => {
    setQuestionText("");
    setOptions(["", ""]);
    setQuestionType("MCQ");
    setErrorMessage("");
    setIsSubmitting(false);
    setRatingType("numeric");
    setRatingScale({ min: 1, max: 5, step: 1, default: 3 });
    setRatingLabels({
      "1": "Poor",
      "2": "Fair",
      "3": "Good",
      "4": "Very Good",
      "5": "Excellent",
    });
  };


  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="relative max-w-[90%] bg-white p-6 rounded-lg shadow-lg">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-4 right-3 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900">Add Question</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {/* Question Type Selection */}
        <div className="mt-4">
          <Text variant="body15SB">
            Question Type
          </Text>

          <ToggleButtonGroup
          value={questionType}
          exclusive
          onChange={(_, newType) => newType && setQuestionType(newType)}
          color="primary"
          sx={{ mt: 2 }}
        >
          <ToggleButton value="MCQ" sx={{fontSize: "14px"}}>Multiple Choice</ToggleButton>
          <ToggleButton value="Free Text" sx={{fontSize: "14px"}}>Free Text</ToggleButton>
          <ToggleButton value="RATING" sx={{fontSize: "14px"}}>Rating</ToggleButton>
        </ToggleButtonGroup>
        </div>

        {/* Question Text */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Question</label>
          <input
            type="text"
            placeholder="Enter your question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="mt-2 w-full p-2 border rounded-md"
            disabled={isSubmitting}
          />
        </div>

        {/* MCQ Options */}
        {questionType === "MCQ" && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Options</label>
            {options.map((option, index) => (
              <div key={index} className="relative mt-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full p-2 border rounded-md pr-10"
                  disabled={isSubmitting}
                />
                {index > 1 && (
                  <button
                    onClick={() => handleDeleteOption(index)}
                    className="absolute inset-y-0 right-3 flex items-center text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <img
                      src="/images/workspace/delete.svg"
                      alt="Delete option"
                      className="w-5 h-5"
                    />
                  </button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <button
                onClick={handleAddOption}
                className="text-left text-blue-600 hover:text-blue-800 mt-2"
                disabled={isSubmitting}
              >
                + Add Option
              </button>
            )}
          </div>
        )}

        {/* Rating Scale Info */}
        {questionType === "RATING" && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Rating Scale
            </label>
            <div className="mt-2 text-sm text-gray-500">
              1-5 rating scale will be used
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="outline"
            label="Cancel"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            type="primaryBlack"
            label="Add"
            onClick={handleSubmit}
            disabled={
              !questionText.trim() ||
              (questionType === "MCQ" && !options.some((opt) => opt.trim())) // Ensure at least one MCQ option
            }
            loading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionPopup;
