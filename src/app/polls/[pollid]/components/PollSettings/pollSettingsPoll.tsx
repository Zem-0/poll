/* eslint-disable @next/next/no-img-element */
"use client";

import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Fragment } from "react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ExportPoll } from "@/app/api/dashboard/polls";
import { fetchPollDetails } from "@/app/api/forms/updatePoll";
import {
  changeFormData,
  setInitialForm,
} from "@/lib/features/dashboard/updatePoll";
import { backgroundBlur } from "@/lib/features/workspace/outlineSlice";
import { RootState } from "@/lib/store";
import { peopleA } from "@/static/static_data";
import { classNames } from "@/static/static_data";

import Audience from "../PollsComponents/Audience";
import Pollster from "../PollsComponents/Pollster";
import BasicPollDetails from "../PollsComponents/Basic";
import AdvancedSettings from "../PollsComponents/AdvancedSettings";

interface PageProps {
  question_id: string;
  question_type: string;
  pollId: string;
  show: boolean;
}

const PollSettingsPoll: React.FC<PageProps> = ({ question_id, pollId }) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state: RootState) => state.workspace.formData);
  // console.log(workspace.outline.questions.find((question) => question.question_number === question_id)?.instruction);
  const outlineSlice = useSelector((state: RootState) => state.outline);
  const updatePollSlice = useSelector(
    (state: RootState) => state.updatePoll.outline
  );

  const [formPart, setFormPart] = useState("basic");
  const [selected, setSelected] = useState(peopleA[3]);
  const [deployments, setDeployments] = useState([
    {
      id: 1,
      teamName: "Basic",
      status: "selected",
      available: true,
    },
    {
      id: 2,
      teamName: "Audience",
      status: "not_selected",
      available: true,
    },
    {
      id: 3,
      teamName: "Pollster",
      status: "not_selected",
      available: true,
    },
    {
      id: 4,
      teamName: "Advanced settings",
      status: "not_selected",
      available: true,
    },
    {
      id: 5,
      teamName: "Collaborators",
      status: "not_available",
      available: false,
    },
    {
      id: 6,
      teamName: "incentives",
      status: "not_available",
      available: false,
    },
  ]);

  const handleDateChange = (date: any) => {
    dispatch(
      changeFormData({
        name: "endafterdate",
        value: `${date?.$y}-${date?.$M + 1}-${date?.$D}`,
      })
    );
  };

  const handleButtonClick = () => {
    // Update the status of the first item to 'completed'
    const updatedDeployments = [...deployments];
    updatedDeployments[0] = {
      ...updatedDeployments[0],
      status: "completed",
    };
    updatedDeployments[1] = {
      ...updatedDeployments[1],
      status: "selected",
    };

    // Update the state with the modified array
    setDeployments(updatedDeployments);
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

  async function handleExport() {
    try {
      await ExportPoll(updatePollSlice.title, updatePollSlice.version, pollId);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="border-0 rounded-lg flex flex-col w-full outline-none focus:outline-none">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex flex-col lg:flex-row justify-center">
            <div
              className={`${outlineSlice.workspackeBlur == true ? "lg:w-1/2" : "lg:w-full"}  `}
            >
              <div>
                <fieldset className="mt-4">
                  <ul role="list" className="divide-y-4 divide-white/5">
                    {deployments.map((deployment) => (
                      <li
                        key={deployment.id}
                        className={`relative my-2 px-2 flex items-center space-x-4 py-3 rounded-md
                        ${deployment.available ? "cursor-pointer hover:bg-blue-100" : "cursor-not-allowed opacity-50"}`}
                        onClick={() => {
                          if (!deployment.available) return;

                          dispatch(backgroundBlur({ open: true }));
                          setFormPart(deployment.teamName.toLocaleLowerCase());

                          setDeployments((prevDeployments) =>
                            prevDeployments.map((ele) =>
                              ele.id === deployment.id
                                ? { ...ele, status: "selected" } // Mark clicked item as selected
                                : ele.status !== "completed"
                                  ? { ...ele, status: "not_selected" } // Reset others to not_selected (unless completed)
                                  : ele
                            )
                          );
                        }}
                      >
                        <div className="min-w-0 flex-auto">
                          <div className="flex items-center gap-x-3">
                            {deployment.status == "completed" && (
                              <img
                                src="/images/poll_type/completed.svg"
                                alt=""
                              />
                            )}
                            {deployment.status == "selected" && (
                              <img
                                src="/images/poll_type/selected.svg"
                                alt=""
                              />
                            )}
                            {deployment.status == "not_selected" && (
                              <img
                                src="/images/poll_type/not_selected.svg"
                                alt=""
                              />
                            )}
                            {deployment.status == "not_available" && (
                              <img
                                src="/images/poll_type/not_available.svg"
                                alt=""
                              />
                            )}
                            <h2 className="min-w-0 text-base font-semibold leading-6 text-white">
                              {deployment.available === true && (
                                <span
                                  className={`${deployment.status == "selected" ? "text-Normal-Blue" : "text-Pri-Dark text-medium font-medium"} truncate`}
                                >
                                  {deployment.teamName}
                                </span>
                              )}
                              {deployment.available === false && (
                                <span
                                  className={`${deployment.status === "not_available" ? "text-Lt-Gray" : "text-Dark-gray text-medium font-medium"} truncate`}
                                >
                                  {deployment.teamName}
                                </span>
                              )}
                            </h2>
                            {deployment.status == "selected" && (
                              <ChevronRightIcon
                                className="h-5 w-5 flex-none text-gray-400 "
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>
            </div>

            {outlineSlice.workspackeBlur == true && (
              <div className="relative lg:w-5/6 h-full p-4">
                {formPart === "basic" && (
                  <BasicPollDetails
                    handleExport={handleExport}
                    handleButtonClick={handleButtonClick}
                    setFormPart={setFormPart}
                  />
                )}
                {formPart === "audience" && <Audience pollId={pollId} />}
                {formPart === "pollster" && <Pollster pollId={pollId} />}
                {formPart === "advanced settings" && <AdvancedSettings />}
              </div>
            )}
          </div>
        </LocalizationProvider>
      </div>
    </>
  );
};

export default PollSettingsPoll;
