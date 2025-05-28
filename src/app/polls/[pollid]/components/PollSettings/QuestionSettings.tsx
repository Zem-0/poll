/* eslint-disable @next/next/no-img-element */
"use client";

import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchPollDetails } from "@/app/api/forms/updatePoll";
import { setInitialForm } from "@/lib/features/dashboard/updatePoll";
import {
  handleChangeSettings,
  handleDynamicToggle,
  handleOthersResponseToggle,
  handleRatingSettingsChange,
  handleToggle,
} from "@/lib/features/workspace/workspaceSlice";
import { RootState } from "@/lib/store";
import { classNames } from "@/static/static_data";
import { question_importance } from "@/static/workspace";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import FileUploadComponent from "./FileUpload";

interface PageProps {
  question_id: string;
  question_type: string;
  pollId: string;
  show: boolean;
}

const QuestionSettings: React.FC<PageProps> = ({
  question_id,
  question_type,
  pollId,
}) => {
  const [selectedImportance, setSelectedImportance] = useState(
    question_importance?.[0]
  );

  // State for the uploaded file
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);

  const dispatch = useDispatch();
  const workspace = useSelector((state: RootState) => state.workspace.formData);

  const currentQuestion = workspace?.outline.questions.find(
    (q: any) => q.question_number === question_id
  );

  // Extract rating-related values
  const ratingType = currentQuestion?.rating_type || "numeric"; // Default to "Number"
  const ratingScale = currentQuestion?.rating_scale || 5; // Default scale of 5

  useEffect(() => {
    async function handleFetchPollDetails() {
      try {
        const access_token = localStorage.getItem("access_token") || null;
        if (access_token !== null) {
          const response = await fetchPollDetails(access_token, pollId);
          if (response?.status === 200) {
            dispatch(setInitialForm({ updateValues: response?.data?.survey }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    handleFetchPollDetails();
  }, [dispatch, pollId]);

  const question = workspace.outline.questions.find(
    (q) => q.question_number === question_id
  );
  // Get current question from workspace state
  useEffect(() => {
    async function fetchFileUrl() {
      const question = workspace.outline.questions.find(
        (q) => q.question_number === question_id
      );
      if (question?.file_id) {
        const token = localStorage.getItem("access_token") || "";
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_PORT}/outline/getfiles/${question.file_id}?poll_id=${pollId}`,
          {
            method: "GET",
            headers: {
              JWTToken: token,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch file URL");
        const data = await res.json();
        // data => { file_id, poll_id, file_url }
        setUploadedFileUrl(data.file_url);
      }
    }
    fetchFileUrl();
  }, [question?.file_id, pollId]);

  // -------------- Misc. Handlers -------------
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    dispatch(handleChangeSettings({ name, value, question_id }));
  };

  const handleRatingTypeChange = (newType: string) => {
    dispatch(
      handleChangeSettings({
        name: "rating_type",
        value: newType,
        question_id,
      })
    );
  
    if (newType === "numeric") {
      dispatch(
        handleRatingSettingsChange({
          question_id,
          value: { max: 5 }, // Reset to default max scale when switching to numeric
        })
      );
    }
  };

  const handleImportanceChange = (selectedOption: any) => {
    setSelectedImportance(selectedOption);
    if (selectedOption && selectedOption.val) {
      dispatch(
        handleChangeSettings({
          name: "importance",
          value: selectedOption.val,
          question_id,
        })
      );
    }
  };

  useEffect(() => {
    const question = workspace.outline.questions.find(
      (q) => q.question_number === question_id
    );
    if (question?.importance) {
      const matchingImportance = question_importance.find(
        (imp) => imp.val === question.importance
      );
      if (matchingImportance) {
        setSelectedImportance(matchingImportance);
      }
    }
  }, [question_id, workspace.outline.questions]);

  useEffect(() => {
    // fetch poll details
    async function handleFetchPollDetails() {
      try {
        const access_token = localStorage.getItem("access_token") || null;
        if (access_token !== null) {
          const response = await fetchPollDetails(access_token, pollId);
          if (response?.status === 200) {
            dispatch(setInitialForm({ updateValues: response?.data?.survey }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    handleFetchPollDetails();
  }, [dispatch, pollId]);

  // Rating type options
  const ratingOptions = ["numeric", "hearts", "emoji", "stars"];
  

  return (
    <>
      <div className="p-2  text-Pri-Dark font-medium flex flex-col text-base gap-4">
        <div className="flex flex-row items-center justify-between">
          <div className="w-full text-medium font-normal">Importance</div>
          {/* <div className="flex justify-end">
            {" "}
            <div className="w-full">
              <select
                id="importance"
                name="importance"
                className="mt-2 block w-full rounded-md py-1.5 text-Normal-Blue pr-4 border-none bg-white border-2 outline-none focus:ring-yellow-600 sm:text-base sm:leading-6"
                value={
                  workspace.outline.questions.find(
                    (question) => question.question_number === question_id
                  )?.importance || "normal"
                }
                onChange={handleImportanceChange}
              >
                {question_importance.map((item, index) => (
                  <option
                    value={item.val}
                    key={index}
                    className="text-Pri-Dark"
                  >
                    {item.text}
                  </option>
                ))}
              </select>
            </div>
          </div> */}
          <div className="flex justify-end relative">
            <Listbox
              value={selectedImportance}
              onChange={handleImportanceChange}
            >
              {({ open }) => (
                <>
                  <ListboxButton className="relative w-full cursor-default rounded-md bg-white border border-Gray-Background py-2 pl-3 pr-10 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                    <span className="block truncate">
                      {selectedImportance.text}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>
                  <Transition
                    show={open}
                    as={React.Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions className="absolute top-full left-0 z-10 mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {question_importance?.map((item, index) => (
                        <ListboxOption
                          key={index}
                          value={item}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-yellow-500 text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {item.text}
                              </span>
                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-yellow-500",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </>
              )}
            </Listbox>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-1/2 text-medium font-normal">Required</div>
          <div className=" w-1/2 flex justify-end">
            <Switch
              checked={Boolean(
                workspace.outline.questions.find(
                  (question) => question.question_number === question_id
                )?.required
              )}
              onChange={() => {
                dispatch(handleToggle({ question_id }));
              }}
              className={classNames(
                Boolean(
                  workspace.outline.questions.find(
                    (question) => question.question_number === question_id
                  )?.required
                ) == true
                  ? "bg-Save-Blue"
                  : "bg-gray-200",
                "relative inline-flex h-6 items-center w-11 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none   "
              )}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={classNames(
                  Boolean(
                    workspace.outline.questions.find(
                      (question) => question.question_number === question_id
                    )?.required
                  )
                    ? "translate-x-5"
                    : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
        </div>

        {/* Show Rating Type Dropdown only for rating questions */}
        {question_type === "RATING" && (
          <div className="flex flex-row items-center justify-between mt-4">
            <div className="w-full text-medium font-normal">Rating Type</div>
            <div className="flex justify-end relative">
              <Listbox
                value={currentQuestion?.rating_type || "numeric"}
                onChange={handleRatingTypeChange}
              >
                {({ open }) => (
                  <>
                    <ListboxButton className="relative w-full cursor-default rounded-md bg-white border border-gray-300 py-2 pl-3 pr-10 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm">
                      <span className="block truncate capitalize">
                        {currentQuestion?.rating_type || "numeric"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>
                    <Transition
                      show={open}
                      as={React.Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <ListboxOptions className="absolute top-full left-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {ratingOptions.map((option, index) => (
                          <ListboxOption
                            key={index}
                            value={option}
                            className={({ active }) =>
                              `relative cursor-default select-none p-2 ${active ? "bg-yellow-500 text-white" : "text-gray-900"}`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate capitalize ${selected ? "font-semibold" : "font-normal"}`}
                                >
                                  {option}
                                </span>
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </>
                )}
              </Listbox>
            </div>
          </div>
        )}

        {/* Show Slider only if Rating Type is 'Number' */}
        {question_type === "RATING" &&
          currentQuestion?.rating_type === "numeric" && (
            <div className="flex flex-row items-center justify-between mt-4">
              <div className="w-full text-medium font-normal">Rating Scale</div>
              <div className="flex items-center gap-2">
                {/* Slider to adjust item count */}
                <input
                  type="range"
                  min="5"
                  max="10"
                  value={currentQuestion?.rating_scale?.max || 5} 
                  className="outline-slider w-full"
                  onChange={(e) => {
                    const inputValue = parseInt(e.target.value);
                    const validValues = [5, 7, 10]; // Allowed values
                    const closestValue = validValues.reduce((prev, curr) =>
                      Math.abs(curr - inputValue) < Math.abs(prev - inputValue) ? curr : prev
                    );
          
                    dispatch(
                      handleRatingSettingsChange({
                        question_id,
                        value: { max: closestValue }, 
                      })
                    );
                  }}
                />
                <span className="font-medium w-4">{currentQuestion?.rating_scale?.max || 5}</span>
              </div>
            </div>
          )}

        {question_type === "MCQ" && (
          <>
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="w-2/3 block leading-6 text-medium font-normal  text-Pri-Dark">
                Max. # of choices
              </div>
              <div className="w-16 h-8 flex flex-row justify-end ">
                <input
                  type="text"
                  className="w-full border outline-none focus:border-yellow-600 rounded-lg text-right px-2"
                  name="max_no_of_choices"
                  id="max_no_of_choices"
                  value={
                    workspace.outline.questions.find(
                      (question) => question.question_number === question_id
                    )?.max_no_of_choices || ""
                  }
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row mb-4">
              <div className="w-full text-medium font-normal">
                Allow custom response
              </div>

              <div className=" w-1/2 flex justify-end">
                <Switch
                  checked={Boolean(
                    workspace.outline.questions.find(
                      (question) => question.question_number === question_id
                    )?.allow_others
                  )}
                  onChange={() => {
                    dispatch(handleOthersResponseToggle({ question_id }));
                  }}
                  className={classNames(
                    Boolean(
                      workspace.outline.questions.find(
                        (question) => question.question_number === question_id
                      )?.allow_others
                    ) == true
                      ? "bg-Save-Blue"
                      : "bg-gray-200",
                    "relative inline-flex  items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none "
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      Boolean(
                        workspace.outline.questions.find(
                          (question) => question.question_number === question_id
                        )?.allow_others
                      )
                        ? "translate-x-5"
                        : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
              </div>
            </div>
          </>
        )}
        <hr />
        <div>
          <FileUploadComponent question_id={question_id} pollId={pollId} />
        </div>
        <div className="mt-4">
          <div className="flex flex-row">
            <label
              htmlFor="instruction-for-user"
              className="block leading-6 text-medium font-normal text-Pri-Dark "
            >
              Instructions for users
            </label>
            <div className=" pl-2 flex items-center">
              <img src="/images/workspace/info.svg" alt="" />
            </div>
          </div>

          <div className="mt-2">
            <textarea
              rows={3}
              name="instruction"
              id="instruction"
              className="block w-full rounded-md border-s py-1.5 text-gray-900  p-2 border border-Gray-Background outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-base sm:leading-6"
              value={
                workspace.outline.questions.find(
                  (question) => question.question_number === question_id
                )?.instruction || ""
              }
              onChange={(e) => {
                handleInputChange(e);
              }}
            />

            <div className="w-full flex flex-row justify-end p-2">
              <button className="text-Golden font-semibold">Add</button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-row">
            <label
              htmlFor="instruction-for-user"
              className="block leading-6 text-medium font-normal text-Pri-Dark "
            >
              Skip logic
            </label>
            <div className=" pl-2 flex items-center">
              <img src="/images/workspace/info.svg" alt="" />
            </div>
          </div>

          <div className="mt-2">
            <textarea
              rows={3}
              name="skipper_logic"
              id="skipper_logic"
              className="block w-full rounded-md border-s py-1.5 text-gray-900 p-2 border border-Gray-Background outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-base sm:leading-6"
              value={
                workspace.outline.questions.find(
                  (question) => question.question_number === question_id
                )?.skipper_logic || ""
              }
              onChange={(e) => {
                handleInputChange(e);
              }}
            />

            <div className="w-full flex flex-row justify-end p-2">
              <button className="text-Golden font-semibold">Add</button>
            </div>
          </div>
        </div>

        <div className="">
          <hr className="max-w-" />
          <div className="flex flex-row mt-12">
            <div className="w-1/2 text-medium font-normal">
              Dynamic follow-up
            </div>
            <div className=" w-1/2 flex justify-end">
              <Switch
                checked={Boolean(
                  workspace.outline.questions.find(
                    (question) => question.question_number === question_id
                  )?.dynamic_followup === "TRUE"
                )}
                onChange={() => {
                  dispatch(
                    handleDynamicToggle({
                      question_id,
                    })
                  );
                }}
                className={classNames(
                  workspace.outline.questions.find(
                    (question) => question.question_number === question_id
                  )?.dynamic_followup === "TRUE"
                    ? "bg-Save-Blue"
                    : "bg-gray-200",
                  "relative inline-flex h-6  items-center w-11 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none "
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    workspace.outline.questions.find(
                      (question) => question.question_number === question_id
                    )?.dynamic_followup === "TRUE"
                      ? "translate-x-5"
                      : "translate-x-0",
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>

        <div
          className={
            workspace.outline.questions.find(
              (question) => question.question_number === question_id
            )?.dynamic_followup === "TRUE"
              ? "visible"
              : "hidden"
          }
        >
          <div className="mt-4">
            <div className="flex flex-row">
              <label
                htmlFor="instruction-for-user"
                className="block leading-6 text-medium font-normal text-Pri-Dark"
              >
                Objective
              </label>
              <div className=" pl-2 flex items-center">
                <img src="/images/workspace/info.svg" alt="" />
              </div>
            </div>
            <div className="mt-2">
              <textarea
                rows={1}
                name="objective"
                id="objective"
                className="block w-full rounded-md border-s py-1.5 text-gray-900  p-2 border border-Gray-Background outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-base sm:leading-6"
                value={
                  workspace.outline.questions.find(
                    (question) => question.question_number === question_id
                  )?.objective || ""
                }
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
            </div>
          </div>

          <div className="flex flex-row items-center mt-4 justify-between">
            <div className="w-2/3 block leading-6 text-medium font-normal text-Pri-Dark ">
              Max. # of follow-up questions{" "}
            </div>
            <div className="w-16 h-8 flex flex-row justify-end ">
              <input
                type="number"
                className="w-full border outline-none rounded-lg focus:border-yellow-600 text-right px-4"
                name="max_no_of_questions"
                id="max_no_of_questions"
                value={
                  workspace.outline.questions.find(
                    (question) => question.question_number === question_id
                  )?.max_no_of_questions || ""
                }
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
            </div>
          </div>
          <div className="mt-4 mb-4">
            <div className="flex flex-row">
              <label
                htmlFor="instruction-for-user"
                className="block leading-6 text-medium font-normal text-Pri-Dark "
              >
                Keywords or probe
              </label>
              <div className=" pl-2 flex items-center">
                <img src="/images/workspace/info.svg" alt="" />
              </div>
            </div>
            <div className="mt-2">
              <textarea
                rows={4}
                name="keywords_to_probe"
                id="keywords_to_probe"
                className="block w-full rounded-md border-s py-1.5 text-gray-900  p-2 border border-Gray-Background outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-base sm:leading-6"
                value={
                  workspace.outline.questions.find(
                    (question) => question.question_number === question_id
                  )?.keywords_to_probe || ""
                }
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
              <div className="text-end italic text-Dark-gray text-medium font-normal  mt-2">
                Separate each by a comma
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-row">
              <label
                htmlFor="instruction-for-user"
                className="block leading-6 text-medium font-normal text-Pri-Dark"
              >
                Things to avoid
              </label>
              <div className=" pl-2 flex items-center">
                <img src="/images/workspace/info.svg" alt="" />
              </div>
            </div>
            <div className="mt-2">
              <textarea
                rows={4}
                name="things_to_avoid"
                id="things_to_avoid"
                className="block w-full rounded-md border-s py-1.5 text-gray-900  p-2 border border-Gray-Background outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-base sm:leading-6"
                value={
                  workspace.outline.questions.find(
                    (question) => question.question_number === question_id
                  )?.things_to_avoid || ""
                }
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
              <div className="text-end italic text-Dark-gray text-base  mt-2 ">
                Separate each by a comma
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-row">
              <label
                htmlFor="instruction-for-user"
                className="block leading-6 text-medium font-normal text-Pri-Dark"
              >
                Examples questions
              </label>
              <div className=" pl-2 flex items-center">
                <img src="/images/workspace/info.svg" alt="" />
              </div>
            </div>
            <div className="mt-2">
              <textarea
                rows={4}
                name="example_questions"
                id="example_questions"
                className="block w-full rounded-md border-s py-1.5 text-gray-900 p-2 border border-Gray-Background outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-base sm:leading-6"
                value={
                  workspace.outline.questions.find(
                    (question) => question.question_number === question_id
                  )?.example_questions || ""
                }
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />
              <div className="text-end italic text-Dark-gray text-base mt-2">
                Separate each by a comma
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionSettings;
