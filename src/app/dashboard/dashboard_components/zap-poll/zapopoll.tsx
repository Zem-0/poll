"use client";
import React, { Fragment, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllOutLine, ZapPollApi } from "@/app/api/dashboard/polls";
import { createZapPolls } from "@/lib/features/dashboard/pollsSlice";
import { RootState } from "@/lib/store";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";
import { setWorkspaceOutline } from "@/lib/features/workspaceOutlines/workspaceOutlineSlice";
import ConversationToggles from "../ConversationToggles";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  Listbox,
  Transition,
} from "@headlessui/react";
import { setCurrentWorkspace } from "@/lib/features/dashboard/workspaceCurrentNameSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/component/ToasterProvider";

interface ZapPollProps {
  incrementPollCount?: () => void;
  workspaces: any[];
}

const ZapPoll: React.FC<ZapPollProps> = ({ incrementPollCount, workspaces }) => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [selectedWorkspace, setSelectedWorkspace] = useState(currentWorkspace);
  const [isCreating, setIsCreating] = useState(false);
  const pollsSlice = useSelector((state: RootState) => state.polls);
  const [contentOption, setContentOption] = useState("simple");
  const { showToast } = useToast(); 
  const dispatch = useDispatch();
  const router = useRouter();
  const [zapPollData, setZapPollData] = useState({
    title: "",
    iwantto: "",
    tellusmore: "",
  });

  function handleChange(event: any) {
    const { name, value } = event.target;
    setZapPollData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleCreateClick = useCallback(() => {
    setIsCreating(true);
    CallZapPoll();
  }, [CallZapPoll]);

  async function CallZapPoll() {
    try {
      setIsCreating(true);
      const access_token = localStorage.getItem("access_token") || null;
      if (access_token !== null) {
        const response = await ZapPollApi(
          access_token,
          zapPollData,
          selectedWorkspace
        );
        
        if (response?.status === 200) {
          // Close the modal first
          dispatch(createZapPolls());
          dispatch(setCurrentWorkspace(selectedWorkspace));

          // Refresh the page data
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
            incrementPollCount && incrementPollCount();
          }
          showToast({ type: "success", message: "Poll added successfully!" });

          // Refresh the entire page if needed
          router.push(`/dashboard/${encodeURIComponent(selectedWorkspace)}?section=surveys`);
        }else{
          showToast({ type: "error", message: "Failed to create poll. Please try later." });
        }
      }
    } catch (err) {
      console.error("Error in CallZapPoll:", err);
      showToast({ type: "error", message: "Failed to create poll. Please try later." });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      {pollsSlice.showZapPoll ? (
        <>
          <div className="backdrop-blur-sm w-screen bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full my-6 mx-auto max-w-4xl ">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-xl relative flex flex-col w-full bg-Almost-White outline-none focus:outline-none  p-6">
                <div className="flex flex-row justify-between">
                  <Text variant="h3" extraCSS="pl-4">
                    New Zap! Poll
                  </Text>
                  <button
                    className="bg-Cross rounded-3xl h-6 w-6 hover:rotate-90 transition-transform"
                    onClick={() => {
                      dispatch(createZapPolls());
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-col lg:flex-row p-4">
                  <div className="w-full xl:w-6/12 h-3/5 bg-Neutral rounded-xl p-4">
                    {/* conversation toggles */}
                    <ConversationToggles
                      contentOption={contentOption}
                      setContentOption={setContentOption}
                    />
                    <Text variant="body15SB" extraCSS="text-[16px] my-4 ">
                      Tips
                    </Text>
                    <div>
                      <ul className="list-disc pl-4 mb-4 flex flex-col gap-2 text-sm">
                        <li>
                          <Text variant="body15R" extraCSS="text-[#33383F]">
                            Be concise in “I want to...”! This allows the AI to
                            create a survey optimized in length for your
                            audience.🎯
                          </Text>
                        </li>
                        <li>
                          <Text variant="body15R" extraCSS="text-[#33383F]">
                            And if you want to add additional details, tell us
                            everything that is on your mind... what’s your
                            product? how many users you want to poll? where? 🤔
                          </Text>
                        </li>
                        <li>
                          <Text variant="body15R" extraCSS="text-[#33383F]">
                            Include things you absolutely want to know from your
                            users!
                          </Text>
                        </li>
                        <li>
                          <Text variant="body15R" extraCSS="text-[#33383F]">
                            You can even ask the Pollster to assume a unique
                            tone or persona... Alright, alright, alright! 🤠
                          </Text>
                        </li>
                        <li>
                          <Text variant="body15R" extraCSS="text-[#33383F]">
                            And if you are wondering... yes, you can always edit
                            these settings (and more) even after creating your
                            poll!
                          </Text>
                        </li>
                      </ul>
                    </div>
                    <div className="mb-4 flex justify-center w-full ">
                      <Text variant="body15R" extraCSS="text-[#33383F]">
                        Go ahead, get creative!! 🚀
                      </Text>
                    </div>
                  </div>
                  <div className="lg:w-1/2 h-full px-4 bg-Almost-white flex flex-col gap-8 max-h-[550px] overflow-y-auto custom-scrollbar">
                    <div>
                      <label htmlFor="email" className="block">
                        <Text variant="body15R">Title</Text>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="block w-full rounded-md border border-gray-200 py-3 text-gray-900  outline-none ring-gray-300 placeholder:text-Lt-Gray focus:ring-2 focus:border-transparent focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6 p-4"
                          placeholder="healthcare assessment"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block">
                        <Text variant="body15R">I want to...</Text>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="iwantto"
                          id="iwantto"
                          className="block w-full rounded-md border border-gray-200 py-3 text-gray-900  outline-none ring-gray-300 placeholder:text-Lt-Gray focus:ring-2 focus:border-transparent focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6 p-4"
                          placeholder="E.g., get feedback from my users "
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Listbox
                        value={selectedWorkspace}
                        onChange={(selectedOption) => {
                          setSelectedWorkspace(selectedOption);
                        }}
                      >
                        {({ open }) => (
                          <>
                            <Text variant="body15R">Select workspace</Text>
                            <div className="relative mt-2">
                              <Listbox.Button className="relative w-full cursor-default rounded-md border border-Gray-Background bg-white py-3 pl-3 pr-10 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                                <span className="block truncate font-normal">
                                  {selectedWorkspace}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {workspaces.map((data, idx) => (
                                    <Listbox.Option
                                      key={idx}
                                      className={({ active }) =>
                                        `${active ? "bg-yellow-500 text-white" : "text-gray-900"}
                     relative cursor-default select-none py-2 pl-3 pr-9`
                                      }
                                      value={data.workspace}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`${selected ? "font-semibold" : "font-normal"} block truncate`}
                                          >
                                            {data.workspace}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={`${active ? "text-white" : "text-yellow-500"} absolute inset-y-0 right-0 flex items-center pr-4`}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>

                    <div>
                      <label htmlFor="email" className="block">
                        <Text variant="body15R">Tell us more...</Text>
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={10}
                          name="tellusmore"
                          id="tellusmore"
                          className="block w-full rounded-md border border-gray-200 py-3 text-gray-900  outline-none ring-gray-300 placeholder:text-Lt-Gray focus:ring-2 focus:border-transparent focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6 p-4"
                          placeholder="(Optional) My AI SaaS product helps small businesses improve their social media marketing, while reducing their costs. Looking for insights from 100 customers in Texas about what they like the most about the product and what I can change. Especially curious about how they feel about my new AI agent."
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-end gap-2">
                  <Button
                    label="Cancel"
                    type="primaryWhite"
                    onClick={() => {
                      dispatch(createZapPolls());
                    }}
                  />
                  <Button
                    label="Create"
                    type="primaryBlack"
                    onClick={handleCreateClick}
                    loading={isCreating}
                    disabled={
                      zapPollData.title === "" ||
                      zapPollData.iwantto === "" ||
                      isCreating
                    }
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

export default ZapPoll;
