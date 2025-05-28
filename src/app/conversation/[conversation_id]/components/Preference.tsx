import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";

import Button from "@/components/ui/buttons/Button";
import { toogleConversationType } from "@/lib/features/conversation/conversationSlice";

export default function Preference() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-50" onClose={setOpen}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>  

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gradient-to-b from-Purple-Grad-Dark-900 to-Purple-Grad-Dark-500  px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-start sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-white">
                      Would you prefer to?
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-white">You can switch anytime between the conversation and speaking.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-5 sm:mt-6 ">
                  <Button
                    type="outline"
                    label="Chat"
                    onClick={() => {
                      setOpen(false);
                      dispatch(toogleConversationType({ userPreference: "text" }));
                    }}
                  />
                  <Button
                    type="primaryBlack"
                    label="Talk"
                    onClick={() => {
                      setOpen(false);
                      dispatch(toogleConversationType({ userPreference: "voice" }));
                    }}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
