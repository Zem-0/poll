"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DeleteWorkspaceData } from "@/app/component/DeleteWorkspace";
import { DuplicateComponent } from "@/app/component/DuplicateComponent";
import { PublishComponent } from "@/app/component/PublishComponents";
import { setWorkspaceOutline } from "@/lib/features/workspaceOutlines/workspaceOutlineSlice";
import { RootState } from "@/lib/store";

import { getAllOutLine } from "../../api/dashboard/polls";
import { Deletecomponent } from "../../component/Deletecomponent";
import ShowPollsOptions from "@/components/ShowPollsOptions";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";
import PollsLoading from "@/app/component/loading/PollsLoading";
import { useRouter } from "next/navigation";
import PublishedPopup from "@/app/polls/[pollid]/components/PublishedPopup";
import { publishOutline } from "@/app/api/Outline/Outline";
import { publishChanges } from "@/lib/features/workspace/outlineSlice";
import { handleBasicData } from "@/lib/features/workspace/workspaceSlice";
import axios from "axios";
import { getPollSettings } from "@/app/api/workspace/pollSettings";
import { setBasicData } from "@/lib/features/workspace/pollSettingsSlice";

interface PageProps {
  currentWorkspace: string;
  onWorkspaceDeleted: (workspaceId: string) => void;
  pollCount: number;
  onPollDeleted: () => void;
}

const Polls: React.FC<PageProps> = ({
  currentWorkspace,
  onWorkspaceDeleted,
  pollCount,
  onPollDeleted,
}) => {
  const dispatch = useDispatch();
  const workspaceOutline = useSelector(
    (state: RootState) => state.worksapceOutline
  );
  const options = [
    "Date created",
    "Status",
    "Completed",
    "Published",
    "Drafts only",
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPollsOpen, setIsPollsOpen] = useState(false);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [isEditButtonLoading, setIsEditButtonLoading] = useState(false);
  const [outlineSelected, setOutlineSelected] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [publishLoading, setPublishLoading] = useState(false);
  const router = useRouter();
  const outlineSlice = useSelector((state: RootState) => state.outline);
  const workspace = useSelector((state: RootState) => state.workspace.formData);
  const workspaceOutlineSlice = useSelector(
    (state: RootState) => state.pollSettings.pollData
  );

  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearOutlineSelection();
    setSearchTerm(e.target.value);
  };

  // const filteredPolls = workspaceOutline?.outlines?.filter(
  //   (poll) =>
  //     poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     poll.goal.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredPolls = workspaceOutline?.outlines?.filter((poll) => {
    const matchesSearchTerm =
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.goal.toLowerCase().includes(searchTerm.toLowerCase());
  
    if (selectedOption === "Published") {
      return matchesSearchTerm && poll?.status === "Published";
    } else if (selectedOption === "Drafts only") {
      return matchesSearchTerm && poll?.status === "Draft Ready";
    } else if (selectedOption === "Completed") {
      return matchesSearchTerm && poll?.status === "Completed"; // Optional case for completion if needed
    } else {
      return matchesSearchTerm; // Default behavior for "Date created"
    }
  });

  const [operation, setOperation] = useState("");
  const [key, setKey] = useState(0);

  const toggleClose = () => {
    setIsPollsOpen((pre) => !pre);
  };

  // Reset outlineSelected after deletion
  const clearOutlineSelection = () => {
    setOutlineSelected("");
  };

  const fetchOutlines = async () => {
    setLoadingPolls(true);
    try {
      //runs only if poll count is greater than zero
      if (pollCount > 0) {
        const access_token = localStorage.getItem("access_token") || null;
        if (access_token !== null) {
          const response = await getAllOutLine(access_token, currentWorkspace);
          if (response?.status === 200) {
            dispatch(
              setWorkspaceOutline({ outlines: response.data.user_outlines })
            );
          } else {
            dispatch(setWorkspaceOutline({ outlines: [] }));
          }
        }
      } else {
        dispatch(setWorkspaceOutline({ outlines: [] }));
      }
    } catch (e) {
      console.error("Error fetching outlines:", e);
      dispatch(setWorkspaceOutline({ outlines: [] }));
    } finally {
      setLoadingPolls(false);
    }
  };

  async function getDetails() {
    const access_token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getoutline`,
        {
          idoutline: outlineSelected,
        },
        {
          headers: {
            APISECRET: process.env.NEXT_PUBLIC_APISECRET,
            JWTToken: access_token,
          },
        }
      );
      dispatch(
        handleBasicData({
          outline: response.data.outline,
        })
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function getAllPollsSettings() {
    try {
      const access_token = localStorage.getItem("access_token") || null;
      if (access_token !== null) {
        const response = await getPollSettings(access_token, outlineSelected);

        dispatch(
          setBasicData({
            survey: response?.data.survey,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function Publish() {
    try {
      const response = await publishOutline(workspace, workspaceOutlineSlice);

      if (response?.status === 200) {
        dispatch(
          publishChanges({
            survey_link: response.data.survey_code,
            unique_link: `${process.env.NEXT_PUBLIC_FRONTEND_PORT}/conversation/${response.data.survey_code}`,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handlePublishSequence = async () => {
    try {
      setPublishLoading(true); // Start loading indicator

      await getDetails(); // Step 1: Get poll details

      await getAllPollsSettings(); // Step 2: Fetch poll settings

      await Publish(); // Step 3: Publish the poll
    } catch (error) {
      console.error("Error during publish sequence:", error);
    } finally {
      setPublishLoading(false); // End loading indicator
    }
  };

  useEffect(() => {
    clearOutlineSelection();
    fetchOutlines();
  }, [currentWorkspace]);

  return (
    <>
      <main className="overflow-y-scroll no-scrollbar h-full py-10 pb-20 bg-Neutral flex flex-col w-full  ">
        <div className="w-full mx-auto max-w-[1624px] pt-0 p-4 sm:px-6 lg:px-16">
          <div className="flex flex-row items-center gap-6">
            <Text variant="h2" extraCSS="font-normal truncate">
              {currentWorkspace}
            </Text>
            {currentWorkspace !== "My workspace" && (
              <button
                onClick={() => {
                  setOperation("delete_workspace");
                  setKey((prevKey) => prevKey + 1);
                }}
                className="hover:scale-110"
              >
                <img src="/images/workspace/delete.svg" alt="" />
              </button>
            )}
          </div>
          <div className="flex justify-between items-center sm:items-center my-6">
            <div className=" flex flex-row lg:w-4/12 w-full bg-white rounded-xl overflow-hidden">
              <img src="/images/search.svg" alt="" className=" px-3 py-3" />
              <input
                type="search"
                placeholder="Search by poll title or goal "
                className="outline-none border-none w-full min-w-24 "
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className=" sm:flex-none flex flex-row">
              <div className="rounded-lg relative text-center text-sm  leading-6  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  mr-3">
                <div
                  className="flex items-center justify-center gap-3 shadow-sm bg-white border rounded-lg py-3 px-5  cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Text variant="body15M">{selectedOption}</Text>
                  <img
                    src="/images/dropDownIcon.svg"
                    alt="icon"
                    className={`${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </div>
                {isDropdownOpen && (
                  <ul className="absolute shadow-md w-full mt-2 py-2 px-0 bg-white border rounded-lg border-gray-200 p-2">
                  {options.map((option, index) => (
                    <li
                      key={index}
                      className={`text-left py-1 px-3 cursor-pointer hover:bg-yellow-300 ${
                        option === "Status" ? "font-semibold text-primaryBlue text-center" : ""
                      }`}
                      onClick={() => option !== "Status" && handleOptionClick(option)} 
                    >
                      {option}
                    </li>
                  ))}
                </ul>
                )}
              </div>

              <div>
                <Button
                  label="New Poll"
                  type="primaryBlack"
                  iconSrc="/images/plus.svg"
                  iconHoverSrc="/images/plusBlack.svg"
                  iconPosition="left"
                  onClick={() => setIsPollsOpen(!isPollsOpen)}
                />
                {isPollsOpen && <ShowPollsOptions toggleClose={toggleClose} />}
              </div>
            </div>
          </div>
          <div className="bg-white  p-4 rounded-xl mt-4 shadow-md overflow-x-hidden">
            <div className="flex items-center justify-center">
              <div className="w-[320px] inline-block align-middle overflow-x-auto basis-full">
                {loadingPolls ? (
                  <PollsLoading /> // Render skeleton while loading
                ) : workspaceOutline?.outlines.length > 0 ? (
                  filteredPolls.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th scope="col" className="w-1/2 text-left p-3">
                            <Text
                              variant="body13M"
                              extraCSS="pl-14 font-semibold text-textGray"
                            >
                              Polls
                            </Text>
                          </th>
                          <th scope="col" className="text-center p-3">
                            <Text
                              variant="body13M"
                              extraCSS="font-semibold text-textGray"
                            >
                              Visibility
                            </Text>
                          </th>
                          <th scope="col" className="text-center p-3">
                            <Text
                              variant="body13M"
                              extraCSS="font-semibold text-textGray"
                            >
                              Target response
                            </Text>
                          </th>
                          <th scope="col" className="text-center p-3">
                            <Text
                              variant="body13M"
                              extraCSS="font-semibold text-textGray"
                            >
                              Length
                            </Text>
                          </th>
                          <th scope="col" className="text-center p-3">
                            <Text
                              variant="body13M"
                              extraCSS="font-semibold text-textGray"
                            >
                              Completion
                            </Text>
                          </th>
                          <th scope="col" className="text-center p-3">
                            <Text
                              variant="body13M"
                              extraCSS="font-semibold text-textGray"
                            >
                              Status
                            </Text>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredPolls.map((poll, index) => (
                          <tr
                            onClick={() =>
                              router.push(`/polls/${poll.outline_id}`)
                            }
                            key={index}
                            className={`cursor-pointer ${poll.status === "Processing" ? "hover:bg-gray-100 hover:rounded-4xl" : ""} ${outlineSelected === poll.outline_id ? "bg-gray-100" : ""}`}
                          >
                            <td className="whitespace-nowrap p-3">
                              <div className="flex items-center flex-row">
                                <div className="h-11 w-11 flex-shrink-0">
                                  {poll.status !== "Processing" && (
                                    <>
                                      <div
                                        className="w-full flex justify-center z-50"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {outlineSelected === poll.outline_id ? (
                                          <button
                                            onClick={() =>
                                              setOutlineSelected("")
                                            }
                                          >
                                            <img
                                              src="/images/dashboard/dashboard_checked.svg"
                                              alt=""
                                            />
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() =>
                                              setOutlineSelected(
                                                poll.outline_id
                                              )
                                            }
                                          >
                                            <img
                                              src="/images/dashboard/dashboard_unchecked.svg"
                                              alt=""
                                            />
                                          </button>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="ml-4 flex flex-1 items-start flex-col truncate">
                                  <Text
                                    variant="body15M"
                                    extraCSS="truncate w-3/4 max-w-[400px]"
                                  >
                                    {poll?.title}
                                  </Text>
                                  <Text
                                    variant="body13R"
                                    extraCSS="mt-1 text-textGray truncate w-3/4 max-w-[400px]"
                                  >
                                    {poll?.goal}
                                  </Text>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-center">
                              <Text variant="body15R" extraCSS="capitalize">{poll?.visibility}</Text>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-Pri-Dark text-center">
                              <Text variant="body15R">
                                {poll?.endafterresponses}
                              </Text>
                              <Text variant="body13R">
                                {poll?.endafterdate}
                              </Text>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-Pri-Dark text-center">
                              <Text variant="body15R">{poll?.lengthtime}</Text>
                              <Text variant="body13R">
                                {poll?.lengthquestions}
                              </Text>
                            </td>
                            {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-Pri-Dark text-center">{poll.completion || "10%"}</td> */}
                            <td className="whitespace-nowrap px-3 py-5 text-center">
                              <Text variant="body15R">
                                {poll.completion || ""}
                              </Text>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-Pri-Dark text-center">
                              {poll.status === "Processing" ? (
                                <div>
                                  <button
                                    className={
                                      poll.status === "Processing"
                                        ? "bg-Building-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                        : poll.status === "Draft Ready"
                                          ? "bg-Ready-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                          : poll.status === "Published"
                                            ? "bg-Collecting-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                            : poll.status === "Completed"
                                              ? "bg-Collecting-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                              : poll.status === "Paused"
                                                ? "bg-Paused-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                                : "bg-Paused-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                    }
                                  >
                                    <Text variant="body13M">{poll.status}</Text>
                                  </button>
                                </div>
                              ) : (
                                <Link href={`/polls/${poll.outline_id}`}>
                                  <button
                                    className={
                                      poll.status === "Processing"
                                        ? "bg-Building-button pt-2 pb-2 w-24 rounded-2xl"
                                        : poll.status === "Draft Ready"
                                          ? "bg-Ready-button pt-2 pb-2 w-24 rounded-2xl"
                                          : poll.status === "Published"
                                            ? "bg-Collecting-button pt-2 pb-2 w-24 rounded-2xl"
                                            : poll.status === "Completed"
                                              ? "bg-Collecting-button pt-2 pb-2 w-24 rounded-2xl"
                                              : poll.status === "Paused"
                                                ? "bg-Paused-button pt-2 pb-2 w-24 rounded-2xl"
                                                : "bg-Paused-button pt-2 pb-2 w-24 rounded-2xl"
                                    }
                                  >
                                    <Text variant="body13M">{poll.status}</Text>
                                  </button>
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="w-full p-3">
                      <Text
                        variant="body15R"
                        extraCSS="text-textGray text-center"
                      >
                        No results found.
                      </Text>
                    </div>
                  )
                ) : (
                  <div className="w-full p-3">
                    <Text
                      variant="body15R"
                      extraCSS="text-textGray text-center"
                    >
                      No polls created yet. Start your first poll to engage your
                      audience!
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {outlineSelected != "" && (
        <div className="absolute bottom-0 z-40 w-full p-8 bg-white h-20">
          <div className="flex  w-full items-center h-full">
            <div>
              <img src="/images/workspace/tick.svg" alt="" />
            </div>
            <div className="pl-5">1 item selected</div>
            <div className="ml-auto flex gap-2">
              <Button
                label="Duplicate"
                type="primaryWhite"
                onClick={() => {
                  setOperation("duplicate");
                  setKey((prevKey) => prevKey + 1);
                }}
              />

              <Button
                type="primaryWhite"
                label="Edit"
                onClick={() => {
                  setIsEditButtonLoading(true); // Set loading state to true
                  router.push(`/polls/${outlineSelected}`);
                  setIsEditButtonLoading(false); // Set loading state to false
                }}
                loading={isEditButtonLoading}
              />

              <Button
                label="Delete"
                type="delete"
                onClick={() => {
                  setOperation("delete");
                  setKey((prevKey) => prevKey + 1);
                }}
              />
              {/* <Button
                type="primaryBlack"
                label="Publish"
                clickAnimation={true}
                onClick={async () => {
                  setOperation("published");
                  await handlePublishSequence(); // Run the sequence
                }}
                loading={publishLoading}
              /> */}
            </div>
          </div>
        </div>
      )}

      {operation === "duplicate" && (
        <DuplicateComponent
          key={key}
          outlineId={outlineSelected}
          workspaceId={currentWorkspace}
        />
      )}
      {operation === "delete" && (
        <Deletecomponent
          key={key}
          outlineId={outlineSelected}
          workspaceId={currentWorkspace}
          clearOutlineSelection={clearOutlineSelection}
          onPollDeleted={onPollDeleted}
        />
      )}
      {operation === "publish" && (
        <PublishComponent
          key={key}
          outlineId={outlineSelected}
          workspaceId={currentWorkspace}
        />
      )}
      {operation === "delete_workspace" && (
        <DeleteWorkspaceData
          key={key}
          workspaceId={currentWorkspace}
          onDeleteSuccess={onWorkspaceDeleted}
        />
      )}
      {/* to show the publishes popup */}
      {outlineSlice.survey_published && <PublishedPopup />}
    </>
  );
};

export default Polls;
