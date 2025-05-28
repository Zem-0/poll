import React, { SetStateAction, useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { Fragment } from "react";
import { classNames, industry } from "@/static/static_data";
import { AnalysisPollDataType } from "@/app/api/api_types/analysisPoll_types";
import Text from "@/components/ui/Texts/Text";

const platforms = [
  { id: 1, name: "TypeForm" },
  { id: 2, name: "Google Forms" },
  { id: 3, name: "SurveyMonkey" },
  { id: 4, name: "JotForm" },
  { id: 5, name: "Microsoft Forms" },
  { id: 6, name: "Wufoo" },
  { id: 7, name: "Formstack" },
];

interface BasicProps {
  formData: AnalysisPollDataType; // Replace 'any' with the appropriate type for formData
  handleFormDataChange: (newValue: any) => void; // Replace 'any' with the appropriate type for the value
  setFormData: React.Dispatch<React.SetStateAction<AnalysisPollDataType>>;
  workspaces: any;
  selectedWorkspace: String;
  setSelectedWorkspace: any;
}

const Basic: React.FC<BasicProps> = ({
  formData,
  handleFormDataChange,
  setFormData,
  workspaces,
  selectedWorkspace,
  setSelectedWorkspace,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState(industry?.[0]);
  const [selectedPlatform, setSelectedPlatform] = useState(platforms?.[0]);
  return (
    <>
      <div className="flex flex-col">
        <div className="h-full flex flex-col gap-6">
          <div>
            <Listbox
              value={selectedIndustry}
              onChange={(selectedOption) => {
                setSelectedIndustry(selectedOption);
                setFormData((pre) => ({
                  ...pre,
                  industry: selectedOption.name,
                }));
              }}
            >
              {({ open }) => (
                <>
                  <Label className="block  text-base font-medium  leading-6 text-Pri-Dark ">
                    Industry
                  </Label>
                  <div className="relative mt-2">
                    <ListboxButton className="relative w-full cursor-default rounded-md bg-white border border-Gray-Background  py-3 pl-3 pr-10 text-left text-gray-900    focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                      <span className="block truncate font-normal">
                        {selectedIndustry.name}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {industry.map((ind) => (
                          <ListboxOption
                            key={ind.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-yellow-500 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-3 pl-3 pr-9"
                              )
                            }
                            value={ind}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {ind.name}
                                </span>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-indigo-600",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>

          <div>
            <Listbox
              value={selectedWorkspace}
              onChange={(selectedOption) => {
                setSelectedWorkspace(selectedOption);
                setFormData((pre: any) => ({ ...pre, workspace: selectedOption }));
              }}
              name="workspace"
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
                        {workspaces.map((data: any, idx: any) => (
                          <Listbox.Option
                            key={idx}
                            className={({ active }) =>
                              `${active ? "bg-yellow-500 text-white" : "text-gray-900"}
                                       relative cursor-default select-none py-3 pl-3 pr-9`
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
            <Listbox
              value={selectedPlatform}
              onChange={(selectedOption) => {
                setSelectedPlatform(selectedOption);
                setFormData((pre) => ({
                  ...pre,
                  platform: selectedPlatform.name,
                }));
              }}
            >
              {({ open }) => (
                <>
                  <Label className="block text-base font-medium leading-6 Pri-dark">
                    Which platform did you use for the survey?
                  </Label>
                  <div className="relative mt-2">
                    <ListboxButton className="relative w-full cursor-default rounded-md border border-Gray-Background bg-white py-3 pl-3 pr-10 text-left text-gray-900   focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                      <span className="block truncate font-normal">
                        {selectedPlatform.name}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {platforms.map((platform) => (
                          <ListboxOption
                            key={platform.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-yellow-500 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-3 pl-3 pr-9"
                              )
                            }
                            value={platform}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {platform.name}
                                </span>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-yellow-500",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>

          <div>
            <label
              htmlFor="insights"
              className="block  text-base font-medium leading-6 text-Pri-Dark"
            >
              What are the insights for?
            </label>
            <div className="mt-2">
              <textarea
                id="insights"
                name="insights"
                autoComplete="off"
                required
                rows={3}
                value={formData.insights}
                className="block w-full rounded-md py-3 px-2.5  border-2 border-Gray-Background outline-none  placeholder:text-gray-400 focus:border-yellow-500 sm:text-sm sm:leading-6"
                placeholder="Build reports, leadership presentations, or something else. Let Polly know so it can customize the language."
                onChange={(e) => handleFormDataChange(e)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="customInstructions"
              className="text-base font-medium leading-6 text-Pri-Dark flex items-center gap-2"
            >
              Set custom instructions
              <img src="/images/workspace/info.svg" alt="info" />
            </label>
            <div className="mt-2">
              <textarea
                id="customInstructions"
                name="customInstructions"
                autoComplete="off"
                required
                rows={3}
                value={formData.customInstructions}
                className="block w-full rounded-md py-3 px-2.5  border-2 border-Gray-Background outline-none  placeholder:text-gray-400 focus:border-yellow-500 sm:text-sm sm:leading-6"
                placeholder="Add custom instructions..."
                onChange={(e) => handleFormDataChange(e)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Basic;
