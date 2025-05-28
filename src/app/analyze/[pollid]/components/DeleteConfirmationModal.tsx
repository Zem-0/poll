import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";

const DeleteConfirmationModal = ({
  isOpen,
  setIsOpen,
  onDelete,
  isDeleting,
}: any) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => setIsOpen(false)}
      >
        <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0 backdrop-blur-md bg-black bg-opacity-25">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-6 py-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setIsOpen(false)}
                >
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
                      Are you sure you want to delete this file? This action
                      cannot be undone.
                    </Text>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-4">
                <Button
                  type="primaryWhite"
                  label="Cancel"
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                />
                <Button
                  type="delete"
                  label="Yes, Delete"
                  onClick={onDelete}
                  loading={isDeleting}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DeleteConfirmationModal;
