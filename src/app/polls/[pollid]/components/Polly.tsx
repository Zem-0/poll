"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Polly() {
  const [open, setOpen] = useState(true);
  const [fileDesc, setFileDesc] = useState("");

  const [isDocumentSectionOpen, setIsDocumentSectionOpen] = useState(false);
  const [filesData, setFilesData] = useState([
    { id: 1, fileName: "Org chart.docx", fileDesc: "" },
    { id: 2, fileName: "CEO Survey.docx", fileDesc: "" },
    {
      id: 3,
      fileName: "CEO Self Evaulation this is just for testing and all.pdf",
      fileDesc: "",
    },
    { id: 4, fileName: "My Take.pdf", fileDesc: "" },
  ]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute left-0 top-0 -ml-10 flex pr-2 pt-2 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-12 sm:pr-4 ">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    {/* <span className="sr-only">Close panel</span> */}
                    <XCircleIcon aria-hidden="true" className="h-10 w-10" />
                  </button>
                </div>
              </TransitionChild>

              <div className="flex h-full flex-col overflow-y-scroll bg-white ">
                <div className="px-4 sm:px-6">
                  {/* <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                    Panel title
                  </DialogTitle> */}
                </div>

                <div className="relative ">
                  <div className="max-w-2xl px-4 sm:px-6  mx-auto border-b border-gray-200">
                    <div className="py-4">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setIsDocumentSectionOpen((pre) => !pre)}
                      >
                        <h3 className="text-lg font-medium">
                          Add additional knowledge (optional)
                        </h3>
                        <div className="text-xl">
                          {isDocumentSectionOpen ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </div>
                      </div>
                      {isDocumentSectionOpen && (
                        // if the document section is open
                        <div className="flex flex-col gap-4 p-2">
                          <div className="my-2">
                            <h2 className="flex gap-2 items-center text-md ">
                              Upload documents
                              <img
                                src="/images/workspace/info.svg"
                                alt="info"
                              />
                            </h2>
                            <p className="mt-3 font-light text-sm">
                              <span className="font-bold">Note:</span>
                              Pollvault’s A.I. uses these documents to frame
                              insights to your specific needs. You can upload
                              PDFs, Word or Text files of relevant content, such
                              as org charts, meeting notes, your ideal
                              responses, etc.
                            </p>
                          </div>

                          <div className="relative flex justify-between  gap-4 items-center">
                            <div className="bg-white w-full ">
                              <input
                                className="block w-full p-2 rounded-md border border-gray-200"
                                type="text"
                                name="description"
                                id="file-description"
                                placeholder="Enter brief description and relevance of file"
                              />
                            </div>

                            <div className="relative flex justify-center shadow-lg p-2 rounded-xl">
                              <label
                                htmlFor="file-upload"
                                className="absolute w-[100%] h-[100%] top-0 left-0 cursor-pointer rounded-xl  font-semibold text-Normal-Blue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
                              >
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only opacity-0"
                                />
                              </label>
                              <img
                                src="/images/results/filled.svg"
                                alt=""
                                className="w-8 h-auto pointer-events-none"
                              />
                            </div>
                          </div>
                          {/* file visible section */}
                          {filesData.length == 0 ? (
                            <p>Select file to show data</p>
                          ) : (
                            <div className="grid grid-cols-2 gap-4 ">
                              {filesData?.map((file, index) => (
                                <div className="flex justify-between items-center gap-4 px-4 py-2 cursor-pointer rounded-lg hover:bg-yellow-100">
                                  <p className="w-[75%] text-sm truncate max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                    {file?.fileName}
                                  </p>
                                  <div>
                                    <img
                                      src="/images/workspace/delete.svg"
                                      alt="delete"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* file instruction section */}
                          <p className="flex gap-2 items-center text-md mt-2 ">
                            Set custom instructions
                            <img src="/images/workspace/info.svg" alt="info" />
                          </p>
                          <textarea
                            name="extraInformation"
                            id="extraInformation"
                            rows={5}
                            className="border border-gray-200 p-4 rounded-md"
                            placeholder="Instructions on how you want the AI to respond for this survey, what are you looking for, specific dos and don’ts, example responses, your step-by-step process (if needed), etc."
                          ></textarea>
                          <p className="text-sm font-light text-gray-700">
                            <span className="font-bold text-black">Note: </span>
                            Think about how you would analyze the results and
                            instruct the AI accordingly.
                          </p>
                          <div className="w-[100%] flex items-center justify-end mt-6">
                            <button className="py-3 px-6 rounded-md bg-black text-white cursor-pointer border-2 border-transparent hover:bg-white hover:text-black hover:border-black">
                              Save knowledge
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-4 sm:px-6 pb-4">
                  <div className="flex items-center relative">
                    <input
                      type="text"
                      placeholder="Ask me something"
                      className="w-full p-2 pr-10 border border-gray-300 rounded-xl outline-none"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 outline-none"
                    >
                      <span className="text-black">
                        <img src="/images/results/send.svg" alt="" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
