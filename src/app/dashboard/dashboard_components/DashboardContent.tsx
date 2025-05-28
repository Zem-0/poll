"use client";

import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { CreateWorkspace } from "@/app/api/workspace/workSpaces";
import { classNames } from "@/static/static_data";
import { GetAllWorkspaces } from "../../api/workspace/workSpaces";
import ImportedSurvey from "./ImportedSurvey";
import Integrations from "./Integrations";
import Polls from "./polls";
import Promote from "./Promote";
import Wallet from "./Wallet";
import Navbar from "../../component/Navbar";
import Button from "@/components/ui/buttons/Button";
import Text from "@/components/ui/Texts/Text";
import WorkspacesLoading from "../../component/loading/WorkspacesLoading";
import dynamic from "next/dynamic";
import { RootState } from "@/lib/store";
import { setCurrentWorkspace } from "@/lib/features/dashboard/workspaceCurrentNameSlice";
import Link from "next/link";
import { CreateWorkspaceComponent } from "@/app/component/createWorkspaceComponent";
import { useToast } from "@/app/component/ToasterProvider";

// Helper function to map URL parameter values to display values
function mapSectionNameToDisplay(sectionParam: string): string {
  const mapping: Record<string, string> = {
    "surveys": "Surveys",
    "interview": "Interviews",
    "analysis": "Analysis",
    "deliverables": "Deliverables"
  };
  
  return mapping[sectionParam.toLowerCase()] || "Surveys";
}

// Helper function to map display values to URL parameter values
function mapDisplayToSectionName(displayName: string): string {
  const mapping: Record<string, string> = {
    "Surveys": "surveys",
    "Interviews": "interview",
    "Analysis": "analysis",
    "Deliverables": "deliverables"
  };
  
  return mapping[displayName] || "surveys";
}

// Lazy loaded components
const CreatePoll = dynamic(() => import("./create-poll/page"));
const ZapPoll = dynamic(() => import("./zap-poll/zapopoll"));
const AnalyzePoll = dynamic(() => import("./analyze-poll/page"));

interface Workspace {
  workspace: string;
  polls_count: number;
  imported_survey_poll_count: number;
}

interface DashboardContentProps {
  initialSection?: string;
}

export default function DashboardContent({ initialSection = "surveys" }: DashboardContentProps) {
  const [open, setOpen] = useState(false);
  const [workspaceName, setworkspaceName] = useState("");
  const [section, setSection] = useState(mapSectionNameToDisplay(initialSection));
  const [workspacesLoading, setWorkspacesLoading] = useState(true);
  const [createWorspaceBtnLoading, setCreateWorspaceBtnLoading] =
    useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [pollCount, setPollCount] = useState<number>(1);
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
   const { showToast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();

  const handlePollDeletion = () => {
    setPollCount((prevCount) => Math.max(prevCount, 0));
    // Update the poll count in the workspace array
    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.map((workspace) =>
        workspace.workspace === currentWorkspace
          ? {
              ...workspace,
              polls_count: Math.max(workspace.polls_count - 1, 0),
            }
          : workspace
      )
    );
  };

  const handleAnalysisPollDeletion = () => {
    // Update the poll count in the workspace array
    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.map((workspace) =>
        workspace.workspace === currentWorkspace
          ? {
              ...workspace,
              imported_survey_poll_count: Math.max(
                workspace.imported_survey_poll_count - 1,
                0
              ),
            }
          : workspace
      )
    );
  };

  const incrementPollCount = async () => {
    setPollCount((prevCount) => prevCount + 1);

    // Update the poll count in the workspace array locally
    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.map((workspace) =>
        workspace.workspace === currentWorkspace
          ? { ...workspace, polls_count: workspace.polls_count + 1 }
          : workspace
      )
    );
  };

  const renderSection = () => {
    switch (section) {
      case "Surveys":
        return (
          <Polls
            currentWorkspace={currentWorkspace}
            onWorkspaceDeleted={handleWorkspaceDeleted}
            pollCount={pollCount}
            onPollDeleted={handlePollDeletion}
          />
        );
      case "Interviews":
      // return <InterviewsComponent />;
      case "Analysis":
        return (
          <ImportedSurvey
            currentWorkspace={currentWorkspace}
            onWorkspaceDeleted={handleWorkspaceDeleted}
            analysisPollCount={3}
            onAnalysisPollDeleted={handleAnalysisPollDeletion}
          />
        );
      case "Deliverables":
      // return <DeliverablesComponent />;
      case "wallet":
        return <Wallet />;
      case "integrations":
        return <Integrations />;
      case "promote":
        return <Promote />;
      default:
        return (
          <Polls
            currentWorkspace={currentWorkspace}
            onWorkspaceDeleted={handleWorkspaceDeleted}
            pollCount={pollCount}
            onPollDeleted={handlePollDeletion}
          />
        );
    }
  };

  const handleWorkspaceDeleted = (deletedWorkspaceId: string) => {
    // Update the workspaces state by filtering out the deleted workspace
    const updatedWorkspaces = workspaces.filter(
      (workspace) => workspace.workspace !== deletedWorkspaceId
    );

    setWorkspaces(updatedWorkspaces);

    // If the deleted workspace was the current workspace, switch to another workspace
    if (currentWorkspace === deletedWorkspaceId) {
      if (updatedWorkspaces.length > 0) {
        // Switch to the first available workspace
        setPollCount(updatedWorkspaces[0].polls_count);
        handlePollChange(updatedWorkspaces[0].workspace);
      } else {
        // If no workspaces left, set to default state
        handlePollChange("My workspace");
        setPollCount(1);
      }
    }
  };

  // This effect syncs the active section with the URL when the component mounts
  // or when the initialSection prop changes
  useEffect(() => {
    if (initialSection) {
      const displaySection = mapSectionNameToDisplay(initialSection);
      setSection(displaySection);
    }
  }, [initialSection]);

  useEffect(() => {
    const getAllWorkspaces = async () => {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) return;

      try {
        setWorkspacesLoading(true);
        const response = await GetAllWorkspaces(access_token);

        if (response?.status === 200) {
          const workspacesData = (response?.data?.workspaces).reverse();
          setWorkspaces(workspacesData);

          // If there's no current workspace selected, select the first one
          if (!currentWorkspace && workspacesData.length > 0) {
            dispatch(setCurrentWorkspace(workspacesData[0].workspace));
            
            // Update URL to include workspace and section
            const sectionParam = mapDisplayToSectionName(section);
            router.push(`/dashboard/${encodeURIComponent(workspacesData[0].workspace)}?section=${sectionParam}`);
          }

          const currentWorkspaceData = workspacesData.find(
            (workspace: Workspace) => workspace.workspace === currentWorkspace
          );
          setPollCount(
            currentWorkspaceData ? currentWorkspaceData.polls_count : 0
          );
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setWorkspacesLoading(false);
      }
    };

    getAllWorkspaces();
  }, [currentWorkspace, dispatch, router, section]);

  async function createWorkspace() {
    setCreateWorspaceBtnLoading(true);
    try {
      const access_token = localStorage.getItem("access_token") || null;

      // Check if the workspace name already exists
      const isDuplicate = workspaces.some(
        (workspace) =>
          workspace.workspace.toLowerCase() === workspaceName.toLowerCase()
      );

      if (isDuplicate) {
        alert(
          "A workspace with the same name already exists. Please choose a different name."
        );
        return; // Exit early if a duplicate is found
      }

      if (access_token !== null) {
        const response = await CreateWorkspace(access_token, workspaceName);

        if (
          response?.status === 200 ||
          response?.status === 201 ||
          response?.data.status == "success"
        ) {
          // Create the new workspace object directly on the frontend
          const newWorkspace: Workspace = {
            workspace: workspaceName,
            polls_count: 0,
            imported_survey_poll_count: 0, // Initialize poll count to 0
          };

          // Update the state immediately without waiting for backend response
          const updatedWorkspaces = [newWorkspace, ...workspaces];

          // Update localStorage with the new workspaces array
          setWorkspaces(updatedWorkspaces);

          // Close the modal after workspace creation
          setOpen(false);

          // Automatically open the newly created workspace
          handlePollChange(workspaceName); // Open the newly created workspace
          setPollCount(0);
          showToast({ type: "success", message: "Workspace created successfully!" });
        }else{
          showToast({ type: "error", message: "Failed to create workspace!" });
        }
      }
    } catch (error) {
      showToast({ type: "error", message: "Failed to create workspace!" });
      console.log(error);
    } finally {
      setCreateWorspaceBtnLoading(false);
      setOpen(false);
    }
  }

  function handlePollChange(workspace: string, sectionName: string = "Surveys") {
    setSection(sectionName);
    dispatch(setCurrentWorkspace(workspace));
    
    // Convert section name to URL parameter format
    const sectionParam = mapDisplayToSectionName(sectionName);
    
    // Navigate to the workspace route with section parameter
    // encodeURIComponent ensures spaces are properly encoded
    router.push(`/dashboard/${encodeURIComponent(workspace)}?section=${sectionParam}`);
  }
  
  function handleSectionChange(sectionName: string) {
    setSection(sectionName);
    
    // Convert section name to URL parameter format
    const sectionParam = mapDisplayToSectionName(sectionName);
    
    // Navigate to the current workspace with new section parameter
    router.push(`/dashboard/${encodeURIComponent(currentWorkspace)}?section=${sectionParam}`);
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* this is the navbar */}
        <Navbar />
        <div className="flex flex-row w-full grow h-screen overflow-y-hidden">
          <div className="max-w-[275px] p-8 border-r-2 border-gray-100">
            <nav className="flex flex-1 flex-col h-full">
              <ul role="list" className="flex  flex-col h-full ">
                <li className="workspacesList overflow-y-auto overflow-x-hidden">
                  <ul role="list" className="-mx-2 space-y-1 ">
                    <div className="flex flex-row w-full h-full items-center justify-between gap-2 p-2">
                      <Text variant="h3" extraCSS="font-normal">
                        Workspaces
                      </Text>

                      <button
                        className="border h-6 w-6 rounded-xl flex items-center justify-center "
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        <img src="/images/workspace/add.svg" alt="" />
                      </button>
                    </div>

                    {workspacesLoading ? (
                      <WorkspacesLoading /> // Render skeleton if data is loading
                    ) : workspaces.length == 0 ? (
                      <div className="p-2">
                        <Text variant="body15R">Create a Workspace</Text>
                      </div>
                    ) : (
                      workspaces?.map((item: any, index) => (
                        <Disclosure
                          as="div"
                          key={index}
                          className="mb-4"
                          defaultOpen={item.workspace === currentWorkspace}
                        >
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                className={classNames(
                                  item?.current
                                    ? "bg-gray-50"
                                    : "hover:bg-gray-50",
                                  "w-full flex items-center text-left rounded-md p-2 gap-x-3"
                                )}
                              >
                                <img
                                  src="/images/notes.svg"
                                  className="h-6 w-6 shrink-0"
                                  alt="Workspace Icon"
                                />
                                <Text variant="body15M" extraCSS="flex-1">
                                  {item?.workspace}
                                </Text>
                                <ChevronRightIcon
                                  className={classNames(
                                    open ? "rotate-90" : "",
                                    "ml-2 h-5 w-5 text-primaryBlack transition-transform duration-200"
                                  )}
                                />
                              </Disclosure.Button>

                              {/* Panel for Polls and Completed */}
                              <Disclosure.Panel as="ul" className="mt-1 pl-6">
                                <li className="pl-4 pr-2 relative">
                                  {/* effect */}
                                  <span className="w-4 h-full absolute border-l-2 border-[#EDEDED] -left-[4px] top-0"></span>
                                  <span className="w-4 h-1/2 absolute -left-[4px]  top-[2px] bg-[url('/images/workspace/curve.svg')] bg-no-repeat bg-center bg-contain"></span>
                                  {/* Polls Section */}
                                  <button
                                  name="Surveys"
                                    onClick={() => {
                                      // If this is not the current workspace, change workspace and section
                                      if (currentWorkspace !== item?.workspace) {
                                        handlePollChange(
                                          item?.workspace,
                                          "Surveys"
                                        );
                                        setPollCount(item?.polls_count);
                                      } else {
                                        // Otherwise just change the section
                                        handleSectionChange("Surveys");
                                      }
                                    }}
                                    className={`w-full flex justify-between items-center text-sm leading-6 py-2 pr-4 pl-4 rounded-md text-Pri-Dark ${section == "Surveys" && currentWorkspace == item?.workspace ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"}`}
                                  >
                                    <span>Surveys</span>
                                    {item?.polls_count > 0 && (
                                      <span className="w-6 h-6 flex items-center justify-center bg-[#EFB023] text-primaryBlack text-sm font-bold rounded-md">
                                        {item?.polls_count || 0}
                                      </span>
                                    )}
                                  </button>
                                </li>

                                <li className="pl-4 pr-2 relative opacity-85">
                                  {/* effect */}
                                  <span className="w-4 h-full absolute border-l-2 border-[#EDEDED] -left-[4px] top-0"></span>
                                  <span className="w-4 h-1/2 absolute -left-[4px]  top-[6px] bg-[url('/images/workspace/curve.svg')] bg-no-repeat bg-center bg-contain"></span>

                                  {/* Completed Section */}
                                  <button
                                  disabled
                                    name={"Interviews"}
                                    onClick={() => {
                                      // If this is not the current workspace, change workspace and section
                                      if (currentWorkspace !== item?.workspace) {
                                        handlePollChange(
                                          item?.workspace,
                                          "Interviews"
                                        );
                                      } else {
                                        // Otherwise just change the section
                                        handleSectionChange("Interviews");
                                      }
                                    }}
                                    // className={`w-full flex justify-between items-center text-sm leading-6 py-2 pr-4 pl-4 rounded-md text-Pri-Dark ${section == "Interviews" && currentWorkspace == item?.workspace ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"}`}
                                    className={`w-full cursor-not-allowed  flex justify-between items-center text-sm leading-6 py-2 pr-4 pl-4 rounded-md text-Pri-Dark `}
                                  >
                                    <span>Interviews</span>
                                    {/* {item?.imported_survey_poll_count > 0 && (
                                      <span className="w-6 h-6 flex items-center justify-center bg-[#EFB023] text-primaryBlack text-sm font-bold rounded-md">
                                        {item?.imported_survey_poll_count || 0}
                                      </span>
                                    )} */}
                                  </button>
                                </li>

                                <li className="pl-4 pr-2 relative">
                                  {/* effect */}
                                  <span className="w-4 h-full absolute border-l-2 border-[#EDEDED] -left-[4px] top-0"></span>
                                  <span className="w-4 h-1/2 absolute -left-[4px]  top-[6px] bg-[url('/images/workspace/curve.svg')] bg-no-repeat bg-center bg-contain"></span>

                                  {/* Completed Section */}
                                  <button
                                    name={"Analysis"}
                                    onClick={() => {
                                      // If this is not the current workspace, change workspace and section
                                      if (currentWorkspace !== item?.workspace) {
                                        handlePollChange(
                                          item?.workspace,
                                          "Analysis"
                                        );
                                      } else {
                                        // Otherwise just change the section
                                        handleSectionChange("Analysis");
                                      }
                                    }}
                                    className={`w-full flex justify-between items-center text-sm leading-6 py-2 pr-4 pl-4 rounded-md text-Pri-Dark ${section == "Analysis" && currentWorkspace == item?.workspace ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"}`}
                                  >
                                    <span>Analysis</span>
                                    {item?.imported_survey_poll_count > 0 && (
                                      <span className="w-6 h-6 flex items-center justify-center bg-[#EFB023] text-primaryBlack text-sm font-bold rounded-md">
                                        {item?.imported_survey_poll_count || 0}
                                      </span>
                                    )}
                                  </button>
                                </li>

                                <li className="pl-4 pr-2 relative opacity-85">
                                  {/* effect */}
                                  <span className="w-4 h-[35%] absolute border-l-2 border-[#EDEDED] -left-[4px]  top-0"></span>
                                  <span className="w-4 h-1/2 absolute -left-[4px]  top-[6px] bg-[url('/images/workspace/curve.svg')] bg-no-repeat bg-center bg-contain"></span>

                                  {/* Completed Section */}
                                  <button
                                  disabled
                                    name={"Deliverables"}
                                    onClick={() => {
                                      // If this is not the current workspace, change workspace and section
                                      if (currentWorkspace !== item?.workspace) {
                                        handlePollChange(
                                          item?.workspace,
                                          "Deliverables"
                                        );
                                      } else {
                                        // Otherwise just change the section
                                        handleSectionChange("Deliverables");
                                      }
                                    }}
                                    // className={`w-full flex justify-between items-center text-sm leading-6 py-2 pr-4 pl-4 rounded-md text-Pri-Dark ${section == "Deliverables" && currentWorkspace == item?.workspace ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"}`}
                                    className={`w-full cursor-not-allowed  flex justify-between items-center text-sm leading-6 py-2 pr-4 pl-4 rounded-md text-Pri-Dark `}
                                  >
                                    <span>Deliverables</span>
                                    {/* {item?.imported_survey_poll_count > 0 && (
                                      <span className="w-6 h-6 flex items-center justify-center bg-[#EFB023] text-primaryBlack text-sm font-bold rounded-md">
                                        {item?.imported_survey_poll_count || 0}
                                      </span>
                                    )} */}
                                  </button>
                                </li>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))
                    )}
                  </ul>
                </li>

                <hr className="border border-gray-100 w-full my-2" />
                <li className=" mt-auto h-1/12 flex justify-start ">
                  <a
                    href="#"
                    className="flex items-center gap-2 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="/images/question.svg"
                      alt=""
                    />
                    <span className="sr-only">Your profile</span>
                    <Text variant="body15M">Help & getting started</Text>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="relative grow  bg-gray-100 ">{renderSection()}</div>
        </div>
      </div>

      <CreateWorkspaceComponent isOpen={open} setOpen={setOpen} workspaceName={workspaceName} setworkspaceName={setworkspaceName} createWorkspace={createWorkspace} createWorspaceBtnLoading={createWorspaceBtnLoading}/>

      {/* <div className="fixed bottom-0 z-40">
        <Transition.Root show={open} as={Fragment}>
          <Dialog className="fixed bottom-0 z-40 " onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0  bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-end p-4 text-center sm:items-end sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg mr-12 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12v w-full  flex-shrink-0 items-center justify-center rounded-full bg-red-00 sm:mx-0 sm:h-10 sm:w-10">
                        <img
                          src="/images/workspace/create_workspace.svg"
                          alt=""
                        />
                      </div>
                      <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col gap-4">
                        <Dialog.Title
                          as="h3"
                          className="text-[18px] font-semibold leading-6 text-Pri-Dark"
                        >
                          Create workspace
                        </Dialog.Title>
                        <div>
                          <Text variant="body15R">
                            {" "}
                            What would you like to name your workspace?
                          </Text>
                        </div>
                        <div className="w-full">
                          <input
                            type="text"
                            placeholder="Workspace name"
                            className="outline-none rounded-lg border border-gray-100 p-3 w-full"
                            onChange={(e) => {
                              setworkspaceName(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 items-center sm:flex sm:flex-row-reverse gap-2">
                      <Button
                        label="Create"
                        type="primaryBlack"
                        onClick={() => {
                          createWorkspace();
                        }}
                        loading={createWorspaceBtnLoading}
                      />
                      <Button
                        label="Cancel"
                        type="primaryWhite"
                        onClick={() => setOpen(false)}
                      />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div> */}

      <CreatePoll incrementPollCount={incrementPollCount} workspaces={workspaces}/>
      <ZapPoll incrementPollCount={incrementPollCount} workspaces={workspaces}/>
      <AnalyzePoll workspaces={workspaces}/>
    </>
  );
}
