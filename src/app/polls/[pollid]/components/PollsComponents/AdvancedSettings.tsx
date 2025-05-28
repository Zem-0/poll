"use client";

import { classNames } from "@/static/static_data";
import { Switch } from "@headlessui/react";
import React, { useState } from "react";

const AdvancedSettings = () => {
  const [pollDefaultSetting, setPollDefaultSetting] = useState(true);

  return (
    <div className="w-full absolute top-0 left-0 flex flex-col h-screen gap-6 px-12 text-Pri-Dark">
      <div className="text-[18px] text-Pri-Dark font-medium mt-4">
        Advanced options
      </div>

      <div className="flex flex-row justify-between">
        <p className="text-medium font-normal">
          Keep question structure unchanged
        </p>
        <div className="flex justify-end">
          <Switch
            checked={pollDefaultSetting}
            onChange={() => setPollDefaultSetting((pre: any) => !pre)}
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

      <div className="flex flex-row justify-between">
        <p className=" text-medium font-normal">
          Enable fun facts & audience engagement
        </p>
        <div className=" flex justify-end">
          <Switch
            checked={pollDefaultSetting}
            onChange={() => setPollDefaultSetting((pre: any) => !pre)}
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

      {/* disabled one */}
      <div className="flex flex-row justify-between pointer-events-none">
        <p className="text-medium text-[#C0C0C0] font-normal flex items-center gap-2">
          Allow users to end early
          <img src="/images/lock.svg" alt="lockIcon" />
        </p>
        <div className="flex justify-end">
          <Switch
            checked={false}
            onChange={() => setPollDefaultSetting((pre: any) => !pre)}
            className={classNames(
              false ? "bg-Save-Blue" : "bg-gray-200",
              "relative inline-flex h-6 items-center w-11 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none   "
            )}
          >
            <span className="sr-only">Use Default Setting</span>
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
      {/* disabled one */}
      <div className="flex flex-row justify-between pointer-events-none">
        <p className="text-[#C0C0C0] text-medium font-normal flex items-center gap-2">
          Drop-off reduction AI
          <img src="/images/lock.svg" alt="lockIcon" />
        </p>
        <div className="flex justify-end">
          <Switch
            checked={false}
            onChange={() => setPollDefaultSetting((pre: any) => !pre)}
            className={classNames(
              false ? "bg-Save-Blue" : "bg-gray-200",
              "relative inline-flex h-6 items-center w-11 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none   "
            )}
          >
            <span className="sr-only">Use Default Setting</span>
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

export default AdvancedSettings;
