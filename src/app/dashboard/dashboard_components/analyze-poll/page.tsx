/* eslint-disable @next/next/no-img-element */
"use client";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAnalyze,
  createPolls,
} from "@/lib/features/dashboard/pollsSlice";
import { RootState } from "@/lib/store";
import Basic from "./components/Basic";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { AnalysisPollDataType } from "@/app/api/api_types/analysisPoll_types";
import { AnalysisPollApi } from "@/app/api/dashboard/analysis";
import { setCurrentWorkspace } from "@/lib/features/dashboard/workspaceCurrentNameSlice";
import { useToast } from "@/app/component/ToasterProvider";

const AnalyzePoll: React.FC<any> = ({workspaces}) => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [selectedWorkspace, setSelectedWorkspace] = useState(currentWorkspace);
  const initialFormData = {
    title: "",
    purpose: "",
    insights: "",
    industry: "Aerospace",
    platform: "Typeform",
    imported: false,
    customInstructions: "",
    workspace: selectedWorkspace,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AnalysisPollDataType>(initialFormData);

  const pollsSlice = useSelector((state: RootState) => state.polls);
  const dispatch = useDispatch();
  const router = useRouter();
  const { showToast } = useToast(); 

  // Call Analysis Poll API
  const CallAnalysisPoll = async () => {
    setIsLoading(true);
     dispatch(setCurrentWorkspace(selectedWorkspace));
    try {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        const response = await AnalysisPollApi(access_token, formData);
        //redirecting to the ask polly section
        const pollid = response.data.poll_id;
        showToast({ type: "success", message: "Poll created successfully!" });
        router.push(`/analyze/${pollid}`);
      }
    } catch (err) {
      console.error("Error in CallAnalysisPoll:", err);
      showToast({ type: "error", message: "Failed to create poll. Please try later." });
    } finally {
      setIsLoading(false);
    }
  };

  async function handeSubmit() {
    await CallAnalysisPoll();
    //reseting all the data
    setFormData(initialFormData);
    dispatch(createAnalyze());
  }

  const handleFormDataChange = (e: any) => {
    setFormData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    //for fasting refdirecting
    router.prefetch(`/analyze/loading`);
    setFormData((pre) => ({ ...pre, workspace: selectedWorkspace }));
  }, [currentWorkspace]);

  return (
    <>
      {pollsSlice.showAnalyze ? (
        <>
          <div className="backdrop-blur-sm w-screen bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative  w-full  my-6 mx-auto max-w-4xl ">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-xl relative flex flex-col w-full bg-Almost-White outline-none focus:outline-none  p-2 ">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="h-12 flex items-center p-4 justify-between">
                    <Text variant="h3" extraCSS="pl-4">
                      New Survey Insights: Existing survey or interviews
                    </Text>
                    <div className="flex justify-end ">
                      <button
                        className="bg-Cross rounded-3xl w-6"
                        onClick={() => {
                          dispatch(createAnalyze());
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row h-full w-full px-4">
                    <div className="lg:w-1/2 p-4 flex flex-col gap-6">
                      <div>
                        <label
                          htmlFor="title"
                          className="block  text-base font-medium leading-6 text-Pri-Dark"
                        >
                          Title
                        </label>
                        <div className="mt-2">
                          <input
                            id="title"
                            name="title"
                            type="text"
                            autoComplete="off"
                            required
                            value={formData.title}
                            className="block w-full rounded-md py-3 px-2.5  border-2 border-Gray-Background outline-none  placeholder:text-gray-400 focus:border-yellow-500 sm:text-sm sm:leading-6"
                            placeholder="Enter your poll title"
                            onChange={(e) => handleFormDataChange(e)}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="purpose"
                          className="block  text-base font-medium leading-6 text-Pri-Dark"
                        >
                          What is the survey or interview about?
                        </label>
                        <div className="mt-2">
                          <input
                            id="purpose"
                            name="purpose"
                            type="text"
                            autoComplete="off"
                            required
                            value={formData.purpose}
                            className="block w-full rounded-md py-3 px-2.5  border-2 border-Gray-Background outline-none  placeholder:text-gray-400 focus:border-yellow-500 sm:text-sm sm:leading-6"
                            placeholder="E.g., CEO 360, product feedback"
                            onChange={(e) => handleFormDataChange(e)}
                          />
                        </div>
                      </div>
                      <div className="bg-Neutral mt-4 rounded-xl p-6">
                        <div className="text-sm font-semibold">Tips</div>
                        <div className="pt-4 font-normal text-Pri-Dark">
                          <ul className="list-disc pl-4 mb-4 flex flex-col gap-2 text-sm">
                            <li>
                              <Text variant="body15R" extraCSS="text-[#33383F]">
                                Goal of the survey allows the AI to help you
                                refine answers and also suggest potential
                                questions you should be asking to meet your
                                objectives. 🎯
                              </Text>
                            </li>
                            <li>
                              <Text variant="body15R" extraCSS="text-[#33383F]">
                                Adding the use for insights allows the AI to
                                tailor tone, length, and framing of responses,
                                so you can save time!
                              </Text>
                            </li>
                            <li>
                              <Text variant="body15R" extraCSS="text-[#33383F]">
                                Pollvault’s AI performs best currently when
                                there are fewer than 1,000 responses.
                              </Text>
                            </li>
                            <li>
                              <Text variant="body15R" extraCSS="text-[#33383F]">
                                Be crisp, be specific in your questions and
                                requests, to help Pollvault help you better. 😊
                              </Text>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* <div className="lg:w-1/2 h-full p-4"> */}
                    <div className="lg:w-1/2 h-full p-4 max-h-[550px] overflow-y-auto custom-scrollbar">
                      <Basic
                        formData={formData}
                        handleFormDataChange={handleFormDataChange}
                        setFormData={setFormData}
                        workspaces={workspaces} 
                        selectedWorkspace={selectedWorkspace} 
                        setSelectedWorkspace={setSelectedWorkspace}
                      />
                    </div>
                  </div>
                </LocalizationProvider>
                <div className="flex justify-end p-4 gap-2">
                  <Button
                    label="Cancel"
                    type="primaryWhite"
                    onClick={() => {
                      dispatch(createAnalyze());
                    }}
                  />
                  <Button
                    type="primaryBlack"
                    label="Create Insights"
                    onClick={() => {
                      handeSubmit();
                    }}
                    loading={isLoading}
                    disabled={!formData.title.trim() || !formData.purpose.trim()}
                  />
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

export default AnalyzePoll;
