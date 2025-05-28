import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";

import { setWorkspaceOutline } from "@/lib/features/workspaceOutlines/workspaceOutlineSlice";

import { getAllOutLine } from "../api/dashboard/polls";
import { DeletePoll } from "../api/workspace/pollSettings";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";
import { deleteAnalysisPollApi } from "../api/dashboard/analysis";
import { AnalysisPoll } from "../api/api_types/analysisPoll_types";
import { useToast } from "./ToasterProvider";

interface PageProps {
  outlineId: string;
  workspaceId: string;
  clearOutlineSelection: () => void;
  onPollDeleted: () => void;
  deleteAnalysis?: boolean;
  setGetAllAnalysisPolls?: any;
}

export const Deletecomponent: React.FC<PageProps> = ({
  outlineId,
  workspaceId,
  clearOutlineSelection,
  onPollDeleted,
  deleteAnalysis = false,
  setGetAllAnalysisPolls,
}) => {
  const [open, setOpen] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  async function deleteOutline() {
    setIsDeleting(true);
    try {
      const access_token = localStorage.getItem("access_token") || null;
      if (access_token !== null) {
        const responses = await DeletePoll(access_token, outlineId);
        if (responses?.status === 200) {
          // Re-fetch updated outline data
          const outlineResponse = await getAllOutLine(
            access_token,
            workspaceId
          );
          if (outlineResponse?.status === 200) {
            dispatch(
              setWorkspaceOutline({
                outlines: outlineResponse.data.user_outlines,
              })
            );
            clearOutlineSelection();
            onPollDeleted();
          }
          showToast({ type: "info", message: "Poll deleted successfully!" });
        }else{
          showToast({ type: "error", message: "Failed to delete poll!" });
        }
      }
    } catch (err) {
      console.log(err);
      showToast({ type: "error", message: "Failed to delete poll!" });
    } finally {
      setIsDeleting(false); // End loading state after completion
      setOpen(false); // Close the dialog
    }
  }
  async function deleteAnalysisPoll() {
    setIsDeleting(true);
    try {
      const access_token = localStorage.getItem("access_token") || null;
      if (access_token !== null) {
        const responses = await deleteAnalysisPollApi(outlineId, access_token);
        if (responses?.status == "success" || responses?.status === 200) {          
          // Filter out the deleted poll
          setGetAllAnalysisPolls((prevPolls: AnalysisPoll[]) =>
            prevPolls.filter((poll) => poll.poll_id !== outlineId)
          );
          // Trigger the onPollDeleted callback to update the count
          onPollDeleted();
          showToast({ type: "info", message: "Poll deleted successfully!" });
        }else{
          showToast({ type: "error", message: "Failed to delete poll!" });
        }
      }
    } catch (err) {
      console.log(err);
      showToast({ type: "error", message: "Failed to delete poll!" });
    } finally {
      clearOutlineSelection();
      setIsDeleting(false); // End loading state after completion
      setOpen(false); // Close the dialog
    }
  }

  return (
    <>
      <div className="fixed bottom-0 z-40">
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 mr-12">
                    <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-[18px] font-semibold leading-6 text-Pri-Dark"
                        >
                          Confirm delete
                        </Dialog.Title>
                        <div className="mt-2">
                          <Text variant="body15R" extraCSS="text-textGray">
                            Are you sure you want to delete the selected
                            poll(s)? This action cannot be undone and you will
                            lose any content created.
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-end gap-4">
                      <Button
                        type="primaryWhite"
                        label="Cancel"
                        onClick={() => setOpen(false)}
                        disabled={isDeleting}
                      />
                      <Button
                        type="delete"
                        label="Yes, delete"
                        onClick={
                          deleteAnalysis ? deleteAnalysisPoll : deleteOutline
                        }
                        loading={isDeleting} // Show loading spinner if true
                      />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
};
