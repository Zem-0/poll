"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { DeleteWorkspaceData } from "@/app/component/DeleteWorkspace";
import { Deletecomponent } from "../../component/Deletecomponent";
import ShowPollsOptions from "@/components/ShowPollsOptions";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";
import { getAllAnalysisPollsApi } from "@/app/api/dashboard/analysis";
import { AnalysisPoll } from "@/app/api/api_types/analysisPoll_types";
import AnalysisPollLoading from "@/app/component/loading/analysisPollsLoading";
import { getFiles } from "@/app/api/ask polly/polly";
import ShowAnalysisOptions from "@/components/ShowAnalysisOptions";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createAnalyze } from "@/lib/features/dashboard/pollsSlice";

interface PageProps {
  currentWorkspace: string;
  onWorkspaceDeleted: (workspaceId: string) => void;
  analysisPollCount: number;
  onAnalysisPollDeleted: () => void;
}

const ImportedSurvey: React.FC<PageProps> = ({
  currentWorkspace,
  onWorkspaceDeleted,
  analysisPollCount,
  onAnalysisPollDeleted,
}) => {
  const options = [
    "Date created",
    "Status",
    "Completion",
    "Published",
    "Drafts only",
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPollsOpen, setIsPollsOpen] = useState(false);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [outlineSelected, setOutlineSelected] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [getAllAnalysisPolls, setGetAllAnalysisPolls] = useState<
    AnalysisPoll[]
  >([]);
  const [pollFilesCounts, setPollFilesCounts] = useState<{
    [key: string]: number;
  }>({});
  const dispatch = useDispatch();
  const router = useRouter();

  //for date and all filterations
  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearOutlineSelection();
    setSearchTerm(e.target.value);
  };

  const filteredPolls = getAllAnalysisPolls?.filter(
    (poll) =>
      poll?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll?.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [operation, setOperation] = useState("");
  const [key, setKey] = useState(0);

  const toggleClose = () => {
    setIsPollsOpen((pre) => !pre);
  };

  // Reset outlineSelected after deletion
  const clearOutlineSelection = () => {
    setOutlineSelected("");
  };

  const fetchAnalysisPolls = async () => {
    setLoadingPolls(true);
    try {
      const access_token = localStorage.getItem("access_token") || null;
      if (access_token !== null) {
        const response = await getAllAnalysisPollsApi(
          access_token,
          currentWorkspace
        );
        if (response?.status === 200) {
          setGetAllAnalysisPolls(response.data.polls);

          // Fetch file counts for each poll
          const fileCounts: { [key: string]: number } = {};
          await Promise.all(
            response.data.polls.map(async (poll: AnalysisPoll) => {
              const files = await getFiles(undefined, poll.poll_id);
              fileCounts[poll.poll_id] = files.length;
            })
          );
          setPollFilesCounts(fileCounts);
        }
      }
    } catch (e) {
      console.error("Error fetching analysis polls:", e);
    } finally {
      setLoadingPolls(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
    const month = date.toLocaleString("en-US", { month: "short" }); // Get short month name
    const year = date.getFullYear(); // Get full year
    return `${day} ${month} ${year}`; // Combine them into the desired format
  };

  useEffect(() => {
    clearOutlineSelection();
    fetchAnalysisPolls();
  }, [currentWorkspace]);

  return (
    <>
      <main className="overflow-y-scroll no-scrollbar h-full py-10 pb-20 bg-Neutral flex flex-col w-full  ">
        <div className="w-full mx-auto max-w-8xl px-4 sm:px-6 lg:px-16  p-6">
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

          <div className="sm:flex flex justify-between items-center sm:items-center my-6">
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
                        className="text-left py-1 px-3 cursor-pointer hover:bg-yellow-300"
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <Button
                  label="New Analysis"
                  type="primaryBlack"
                  iconSrc="/images/plus.svg"
                  iconHoverSrc="/images/plusBlack.svg"
                  iconPosition="left"
                  onClick={() => dispatch(createAnalyze())}
                />
                {/* {isPollsOpen && <ShowAnalysisOptions toggleClose={toggleClose} />} */}
              </div>
            </div>
          </div>
          <div className="bg-white  p-4 rounded-xl mt-4 shadow-md overflow-x-hidden">
            <div className="mt-2 flow-root">
              <div className="flex items-center justify-center">
                <div className="w-[320px] inline-block align-middle overflow-x-auto basis-full">
                  {loadingPolls ? (
                    <AnalysisPollLoading /> // Render skeleton while loading
                  ) : analysisPollCount > 0 ? (
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
                                Created Date
                              </Text>
                            </th>
                            <th scope="col" className="text-center p-3">
                              <Text
                                variant="body13M"
                                extraCSS="font-semibold text-textGray"
                              >
                                Add-on Docs
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
                                router.push(`/analyze/${outlineSelected}`)
                              }
                              key={index}
                              className={`cursor-pointer ${poll?.status === "Processing" ? "hover:bg-gray-100 hover:rounded-4xl" : ""} ${outlineSelected === poll.poll_id ? "bg-gray-100" : ""}`}
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
                                          {outlineSelected === poll.poll_id ? (
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
                                                setOutlineSelected(poll.poll_id)
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
                                      {poll?.purpose}
                                    </Text>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-5 text-sm text-Pri-Dark text-center">
                                <Text variant="body15R">
                                  {formatDate(poll?.created_at)}
                                </Text>
                              </td>
                              <td className="whitespace-nowrap px-3 py-5 text-center">
                                <Text variant="body15R">
                                  {pollFilesCounts[poll.poll_id] || 0} documents
                                </Text>
                              </td>
                              <td className="whitespace-nowrap px-3 py-5 text-sm text-Pri-Dark text-center">
                                {poll.status === "Processing" ? (
                                  <div>
                                    <button
                                      className={
                                        poll.status === "Processing"
                                          ? "bg-Building-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                          : poll.status === "Ready"
                                            ? "bg-Collecting-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                            : poll.status === "Published"
                                              ? "bg-Collecting-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                              : poll.status === "Completed"
                                                ? "bg-Collecting-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                                : poll.status === "Paused"
                                                  ? "bg-Paused-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                                  : "bg-Paused-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                      }
                                    >
                                      <Text variant="body13M">
                                        {poll.status}
                                      </Text>
                                    </button>
                                  </div>
                                ) : (
                                  <Link href={`/analyze/${poll.poll_id}`}>
                                    <button
                                      className={
                                        poll.status === "Processing"
                                          ? "bg-Building-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                          : poll.status === "Ready"
                                            ? "bg-Collecting-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                            : poll.status === "Published" ||
                                                poll.status === "active"
                                              ? "bg-Collecting-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                              : poll.status === "Completed"
                                                ? "bg-Collecting-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                                : poll.status === "Paused"
                                                  ? "bg-Paused-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                                  : "bg-Paused-button pt-2.5 pb-2.5 w-24 rounded-2xl"
                                      }
                                    >
                                      <Text variant="body13M">
                                        {poll.status}
                                      </Text>
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
                        No analysis polls created yet. Start your first analysis
                        poll to gain valuable insights!
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {outlineSelected != "" && (
        <div className="absolute bottom-0 z-40 w-full p-8 bg-white h-20">
          <div className="flex w-full items-center h-full">
            <div>
              <img src="/images/workspace/tick.svg" alt="" />
            </div>
            <div className="pl-5">1 item selected</div>
            <div className="ml-auto flex gap-2">
              <Button
                type="primaryWhite"
                label="Edit"
                onClick={() => {
                  router.push(`/analyze/${outlineSelected}`);
                }}
              />

              <Button
                label="Delete"
                type="delete"
                onClick={() => {
                  setOperation("delete");
                  setKey((prevKey) => prevKey + 1);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {operation === "delete" && (
        <Deletecomponent
          key={key}
          outlineId={outlineSelected}
          workspaceId={currentWorkspace}
          clearOutlineSelection={clearOutlineSelection}
          onPollDeleted={onAnalysisPollDeleted}
          deleteAnalysis={true}
          setGetAllAnalysisPolls={setGetAllAnalysisPolls}
        />
      )}

      {operation === "delete_workspace" && (
        <DeleteWorkspaceData
          key={key}
          workspaceId={currentWorkspace}
          onDeleteSuccess={onWorkspaceDeleted}
        />
      )}
    </>
  );
};

export default ImportedSurvey;
