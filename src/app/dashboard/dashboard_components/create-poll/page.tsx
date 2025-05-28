/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { UploadPoll } from "@/app/api/forms/poll";
import Button from "@/components/ui/buttons/Button";
import { createPolls } from "@/lib/features/dashboard/pollsSlice";
import {
  resetFullFormData,
  updateWorkspace,
} from "@/lib/features/workspace/fullWorkspaceSliece";
import { RootState } from "@/lib/store";
import Audience from "./components/Audience";
import Text from "@/components/ui/Texts/Text";
import Basic from "./components/Basic";
import { useEffect, useState } from "react";
import { getAllOutLine } from "@/app/api/dashboard/polls";
import { setWorkspaceOutline } from "@/lib/features/workspaceOutlines/workspaceOutlineSlice";
import { setCurrentWorkspace } from "@/lib/features/dashboard/workspaceCurrentNameSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/component/ToasterProvider";

const deploymentsInitialState = [
  {
    id: 1,
    teamName: "Basic",
    status: "selected",
  },
  {
    id: 2,
    teamName: "Audience",
    status: "not_selected",
  },
];

const CreatePoll: React.FC<any> = ({ incrementPollCount, workspaces }) => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [selectedWorkspace, setSelectedWorkspace] = useState(currentWorkspace);
  const [deployments, setDeployments] = useState(deploymentsInitialState);
  const [formPart, setFormPart] = useState("basic");
  const [isBasicComplete, setIsBasicComplete] = useState(false);
  const [isAudienceComplete, setIsAudienceComplete] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const pollsSlice = useSelector((state: RootState) => state.polls);
  const fullWorkspace = useSelector((state: RootState) => state.fullWorkspace);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const router = useRouter();
  // const pdfExtract = new PDFExtract();

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

  async function handeSubmit() {
    setIsCreating(true);
    dispatch(setCurrentWorkspace(selectedWorkspace));
    try {
      const access_token = localStorage.getItem("access_token") || "";
      const response = await UploadPoll(fullWorkspace.fullForm);

      if (response?.status == 200) {
        const outlineResponse = await getAllOutLine(
          access_token,
          selectedWorkspace
        );
        if (outlineResponse?.status === 200) {
          dispatch(
            setWorkspaceOutline({
              outlines: outlineResponse.data.user_outlines,
            })
          );
          incrementPollCount();
          dispatch(resetFullFormData());
          dispatch(createPolls());
          setFormPart("basic");
        }
        showToast({ type: "success", message: "Poll added successfully!" });
        // Refresh the entire page if needed
        router.push(`/dashboard/${encodeURIComponent(selectedWorkspace)}?section=surveys`);
      } else{
        showToast({ type: "error", message: "Failed to create poll. Please try later." });
      }
    } catch (err) {
      console.error("Error in CallZapPoll:", err);
      showToast({ type: "error", message: "Failed to create poll. Please try later." });
    } finally {
      setIsCreating(false);
    }
  }

  const cancleFunction = () => {
    setDeployments(deploymentsInitialState);
    dispatch(resetFullFormData());
    setFormPart("basic");
    dispatch(createPolls());
  };

  useEffect(() => {
    if (fullWorkspace.fullForm.title && fullWorkspace.fullForm.goal) {
      setIsBasicComplete(true);
    } else {
      setIsBasicComplete(false);
    }
  }, [fullWorkspace.fullForm.title, fullWorkspace.fullForm.goal]);

  useEffect(() => {
    if (
      fullWorkspace.fullForm.geography &&
      fullWorkspace.fullForm.education &&
      fullWorkspace.fullForm.industry
    ) {
      setIsAudienceComplete(true);
    } else {
      setIsAudienceComplete(false);
    }
  }, [
    fullWorkspace.fullForm.geography,
    fullWorkspace.fullForm.education,
    fullWorkspace.fullForm.industry,
  ]);

  return (
    <>
      {pollsSlice.showModal ? (
        <>
          <div className="backdrop-blur-sm  w-screen bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative  w-full  my-6 mx-auto max-w-4xl ">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-xl relative flex flex-col w-full bg-Almost-White outline-none focus:outline-none  p-6">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="flex flex-row justify-between">
                    <Text variant="h3" extraCSS="pl-4">
                      New poll
                    </Text>
                    <button
                      className="bg-Cross rounded-3xl h-6 w-6 hover:rotate-90 transition-transform"
                      onClick={cancleFunction}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex flex-col lg:flex-row h-full w-full px-4">
                    <div className="lg:w-1/2 p-6">
                      <div>
                        <fieldset>
                          <ul role="list" className="divide-y divide-white/5">
                            {deployments.map((deployment) => (
                              <li
                                key={deployment.id}
                                onClick={() => {
                                  if (isBasicComplete) {
                                    setFormPart(
                                      `${deployment.teamName.toLocaleLowerCase()}`
                                    );
                                    setDeployments((prev) =>
                                      prev.map((dep) =>
                                        dep.id === deployment.id
                                          ? { ...dep, status: "selected" }
                                          : { ...dep, status: "not_selected" }
                                      )
                                    );
                                  }
                                }}
                                className="relative cursor-pointer flex items-center space-x-4 py-4 hover:bg-gray-50 rounded-md"
                              >
                                <div className="min-w-0 flex-auto">
                                  <div className="flex items-center gap-x-3">
                                    {deployment.status == "completed" && (
                                      <img
                                        src="/images/poll_type/completed.svg"
                                        alt="icons"
                                      />
                                    )}
                                    {deployment.status == "selected" && (
                                      <img
                                        src="/images/poll_type/selected.svg"
                                        alt="icons"
                                      />
                                    )}
                                    {deployment.status == "not_selected" && (
                                      <img
                                        src="/images/poll_type/not_selected.svg"
                                        alt="icons"
                                      />
                                    )}
                                    <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                                      <span className="truncate text-black">
                                        {deployment.teamName}
                                      </span>
                                    </h2>

                                    {deployment.status === "selected" && (
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
                      <div className="bg-Neutral mt-4 rounded-xl p-6">
                        <div className="text-sm font-semibold">Tips</div>
                        <div className="pt-4 font-normal text-Pri-Dark">
                          <ul className="list-disc pl-4 mb-4 flex flex-col gap-2 text-sm">
                            <li>
                              <Text variant="body15R" extraCSS="text-[#33383F]">
                                Want to tailor the poll to improve audience
                                engagement? Make sure you select a good goal,
                                education level, and industry.
                              </Text>
                            </li>
                            <li>
                              <Text variant="body15R" extraCSS="text-[#33383F]">
                                Using the template improves automated question
                                detection... and saves you time!! 🕰️
                              </Text>
                            </li>
                            <li>
                              <Text variant="body15R" extraCSS="text-[#33383F]">
                                Setting up relevant goal and audience details
                                allows the AI to suggest new questions that
                                could improve your poll
                              </Text>
                            </li>
                            <li>
                              <Text variant="body15R" extraCSS="text-[#33383F]">
                                And if you are wondering... yes, you can always
                                edit these settings (and more) even after
                                creating your poll! 🤩
                              </Text>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/2 h-full p-4 max-h-[550px] overflow-y-auto custom-scrollbar">
                      {formPart === "basic" ? <Basic workspaces={workspaces} selectedWorkspace={selectedWorkspace} setSelectedWorkspace={setSelectedWorkspace}/> : <Audience />}
                    </div>
                  </div>
                </LocalizationProvider>
                {/* <div className="flex justify-end pt-4 pb-8 gap-2 px-10">
                  <Button
                    label="Cancel"
                    type="primaryWhite"
                    onClick={cancleFunction}
                  />

                  {formPart == "basic" && (
                    <>
                      <Button
                        type="primaryBlack"
                        label="Next "
                        onClick={() => {
                          handleButtonClick();
                          setFormPart("audience");
                        }}
                        disabled={!isBasicComplete}
                      />
                    </>
                  )}

                  {formPart == "audience" && (
                    <>
                      <Button
                        type="primaryBlack"
                        label="Create"
                        onClick={() => {
                          handeSubmit();
                        }}
                        disabled={!isBasicComplete || !isAudienceComplete}
                        loading={isCreating}
                      />
                    </>
                  )}
                </div> */}
                <div className="flex justify-end pt-4 pb-8 gap-2 px-10">
                  <Button
                    label="Cancel"
                    type="primaryWhite"
                    onClick={cancleFunction}
                    disabled={isCreating}
                  />

                  {formPart == "basic" && (
                    <>
                      <Button
                        type="primaryBlack"
                        label="Next "
                        onClick={() => {
                          handleButtonClick();
                          setFormPart("audience");
                        }}
                        disabled={!isBasicComplete || isCreating}
                      />
                    </>
                  )}

                  {formPart == "audience" && (
                    <>
                      <Button
                        type="primaryBlack"
                        label="Create"
                        onClick={() => {
                          handeSubmit();
                        }}
                        loading={isCreating}
                        disabled={!isBasicComplete || !isAudienceComplete || isCreating}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default CreatePoll;
