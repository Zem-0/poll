/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchPollDetails } from "@/app/api/forms/updatePoll";
import { changeFormData } from "@/lib/features/dashboard/updatePoll";
import { setInitialForm } from "@/lib/features/dashboard/updatePoll";
import { handleChangeSettings } from "@/lib/features/workspace/workspaceSlice";
import { RootState } from "@/lib/store";

interface PageProps {
  question_id: string;
  question_type: string;
  pollId: string;
  show: boolean;
}

const PollSettingsSection: React.FC<PageProps> = ({
  question_id,
  pollId,
}) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state: RootState) => state.workspace.formData);
  const updatePollSlice = useSelector((state: RootState) => state.updatePoll.outline);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(handleChangeSettings({ name, value, question_id }));
  };

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
  return (
    <>
      <div className="p-2">
        <div className="mt-4 mb-4">
          <div className="flex flex-row">
            <label htmlFor="instruction-for-user" className="block leading-6 text-medium font-normal text-Pri-Dark ">
              Instructions for user
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
              value={updatePollSlice.instruction}
              className="block w-full rounded-md border-s py-1.5 text-gray-900 p-2 border border-Gray-Background outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-base sm:leading-6"
              onChange={(e) => {
                dispatch(changeFormData({ name: "instruction", value: e.target.value }));
              }}
            />
            <div className="w-full flex flex-row justify-end p-2">
              <button className="text-Golden font-semibold">Add</button>
            </div>
          </div>
        </div>

        <div className="mt-4 mb-4">
          <div className="flex flex-row">
            <label htmlFor="instruction-for-user" className="block leading-6 text-medium font-normal text-Pri-Dark ">
              Mechanics
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
              value={workspace.outline.questions.find((question) => question.question_number === question_id)?.mechanics}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PollSettingsSection;
