"use client";
import Text from "@/components/ui/Texts/Text";
import { classNames, peopleB } from "@/static/static_data";
import { Listbox, Switch, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useState } from "react";

interface PollsterProps {
  pollId: string;
}

const Pollster: React.FC<PollsterProps> = ({ pollId }) => {
  const [pollsterName, setPollsterName] = useState("");
  const [pollDefaultSetting, setPollDefaultSetting] = useState(true);
  const [pollTone, setPollTone] = useState("");

  return (
    <div className="w-full absolute top-0 left-0 flex flex-col h-screen gap-6 px-12 text-Pri-Dark">
      <div className="text-[18px] text-Pri-Dark font-medium mt-4">Pollster</div>
      <div className="flex flex-row gap-4 justify-between">
        <div className=" text-medium font-normal">
          Use default settings
        </div>
        <div className="  flex justify-end">
          <Switch
            checked={pollDefaultSetting}
            onChange={() => setPollDefaultSetting((pre) => !pre)}
            className={classNames(
              pollDefaultSetting ? "bg-Save-Blue" : "bg-gray-200",
              "relative inline-flex h-6 items-center w-11 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none   "
            )}
          >
            <span className="sr-only">Use Default Setting</span>
            <span
              aria-hidden="true"
              className={classNames(
                pollDefaultSetting ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </div>
      </div>
      <hr />
      <div>
        <label htmlFor="email" className="block">
          <Text variant="body15R">Name (default is Po) </Text>
        </label>
        <div className="mt-2 w-full">
          <input
            type="text"
            name="pollsterName"
            value={pollsterName}
            className="block w-full rounded-md border border-gray-200 py-3 text-gray-900  outline-none ring-gray-300 placeholder:text-Lt-Gray focus:ring-2 focus:border-transparent focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6 p-4"
            placeholder="healthcare assessment"
            onChange={(e) => {
              setPollsterName(e.target.value);
            }}
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block">
          <Text variant="body15R">Pollster&apos;s tone and personality</Text>
        </label>
        <div className="mt-2">
          <textarea
            rows={4}
            name="polltone"
            id="poll_tone"
            value={pollTone}
            className="block w-full rounded-md border border-gray-200 py-3 text-gray-900  outline-none ring-gray-300 placeholder:text-Lt-Gray focus:ring-2 focus:border-transparent focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6 p-4"
            placeholder="Pollster's tone and personality"
            onChange={(e) => {
              setPollTone(e.target.value);
            }}
          />
        </div>
      </div>
      <hr />
      {/* disbaled one */}
      <div className="flex flex-row pointer-events-none gap-4 justify-between">
        <div className=" text-[#C0C0C0] text-medium font-normal flex items-center gap-2">
          Adapt language to respondent
          <img src="/images/lock.svg" alt="lockIcon" />
        </div>
        <div className="  flex justify-end">
          <Switch
            disabled
            checked={false}
            className={classNames(
              false ? "bg-Save-Blue" : "bg-gray-200",
              "relative inline-flex h-6 items-center w-11 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none   "
            )}
          >
            <span className="sr-only">Adapt language to respondent</span>
            <span
              aria-hidden="true"
              className={classNames(
                false ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </div>
      </div>
      {/* disbaled one */}
      <div className="pointer-events-none">
        <Listbox
          disabled
          // value={selectedEducation}
          // onChange={(selectedOption) => {
          //   setSelectedEducation(selectedOption);
          // }}
        >
          {({ open }) => (
            <>
              <Listbox.Label className="flex text-[#C0C0C0] items-center gap-2 text-base font-medium leading-6 ">
                Average education level
                <img src="/images/lock.svg" alt="lockIcon" />
              </Listbox.Label>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white border border-Gray-Background  py-3 pl-3 pr-10 text-left text-gray-900  outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                  <span className="block truncate text-[#C0C0C0]">
                    Try to give your Pollster a flair of stardom
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
                  {/* <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"></Listbox.Options> */}
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
      {/* update button */}
      <div className="flex justify-end items-start mt-12 mb-6  flex-grow ">
        <button
          className="bg-Pri-Dark font-medium px-5 py-2.5  text-white rounded-md flex  justify-center items-center"
          // onClick={() => {
          //   handeSubmit();
          // }}
        >
          Update
          <img src="/images/dashboard/tick.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default Pollster;
