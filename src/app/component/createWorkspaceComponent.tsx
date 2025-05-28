/* eslint-disable @next/next/no-img-element */
"use client";
import Button from "@/components/ui/buttons/Button";
import Text from "@/components/ui/Texts/Text";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

export const CreateWorkspaceComponent: React.FC<any> = ({ isOpen, setOpen, workspaceName, setworkspaceName, createWorkspace, createWorspaceBtnLoading }) => {

  return (
    <>
         <div className="fixed bottom-0 z-40">
        <Transition.Root show={isOpen} as={Fragment}>
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
                        disabled={!workspaceName.trim()}
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
      </div>
    </>
  );
};
