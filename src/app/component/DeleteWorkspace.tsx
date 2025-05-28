import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { DeleteWorkspace } from "@/app/api/workspace/workSpaces";
import Button from "@/components/ui/buttons/Button";
import Text from "@/components/ui/Texts/Text";
import { useToast } from "./ToasterProvider";

interface PageProps {
  workspaceId: string;
  onDeleteSuccess: (workspaceId: string) => void;
}

export const DeleteWorkspaceData: React.FC<PageProps> = ({ workspaceId,  onDeleteSuccess}) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  async function deleteWorkspace() {
    setLoading(true);
    setError(null);
  
    try {
      const access_token = localStorage.getItem("access_token") || null;
      if (access_token !== null) {
        const response = await DeleteWorkspace(access_token, workspaceId);
        if (response?.status === 200) {
          // Call the onDeleteSuccess function to update workspaces in Dashboard
          onDeleteSuccess(workspaceId);
          showToast({ type: "success", message: "Workspace deleted successfully!" });
        }else{
          showToast({ type: "error", message: "Failed to delete workspace!" });
        }
      } else {
        showToast({ type: "error", message: "Failed to delete workspace!" });
        setError("Access token not found. Please log in again.");
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError("Unable to delete workspace. Please check the workspace ID and try again.");
      } else {
        setError("An error occurred while deleting the workspace. Please try again.");
      }
    } finally {
      setOpen(false); 
      setLoading(false);
    }
  }
  

  return (
    <>
      <div className="fixed bottom-0 z-40">
        <Transition.Root show={open} as={Fragment}>
          <Dialog className="fixed bottom-0 z-40 " onClose={setOpen}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-[18px] font-semibold leading-6 text-Pri-Dark">
                          Yes, delete
                        </Dialog.Title>
                        <div className="mt-2">
                        <Text variant="body15R" extraCSS="text-textGray">
                        Are you sure you want to delete the entire workplace? This action cannot be undone and you will lose all active and inactive polls.
                            </Text>
                            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                          </div>
                      </div>
                    </div>
                    <div className="mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <Button 
                      type="delete"
                      label="Yes, delete"
                      onClick={() => {
                        setOpen(false);
                        deleteWorkspace();
                      }}
                      loading={loading}
                        disabled={loading}
                      />

                    <Button 
                      type="primaryWhite"
                      label="Cancel"
                      onClick={() => setOpen(false)}
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
