/* eslint-disable @next/next/no-img-element */
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  VisibilityState
} from "@/app/types/Audience/Audienct_types";
import {
  addGeography,
  changeFullFormData,
} from "@/lib/features/workspace/fullWorkspaceSliece";
import { RootState } from "@/lib/store";
import { classNames, industry, peopleB, peopleC } from "@/static/static_data";

const Audience = () => {
  const dispatch = useDispatch();
  const fullWorkspace = useSelector((state: RootState) => state.fullWorkspace);

  const [visible, setVisible] = useState<VisibilityState>({
    Public: true,
    Private: false,
    Invite: false,
  });

  function changeVisibility(target: string) {
    setVisible((prevVisible) => ({
      ...Object.fromEntries(
        Object.entries(prevVisible).map(([key]) => [key, key === target])
      ),
    }));
  }

  const [selectedEducation, setSelectedEducation] = useState(peopleB[3]);
  const [selectedIndustry, setSelectedIndustry] = useState(peopleC[3]);

  const handleLocationChange = (e: any) => {
    const { value } = e.target;
    dispatch(addGeography({ geography: value }));
  };
  return (
    <>
      <div className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="email"
            className="block text-base font-medium  text-gray-900"
          >
            Where are they from ?
          </label>
          <div className="mt-2 flex flex-wrap flex-row items-center  w-full rounded-md  px-2.5  border-2 border-Gray-Background outline-none  placeholder:text-gray-400  sm:text-sm sm:leading-6">
            <input
              type="text"
              name="geography"
              id="geography"
              className="outline-none h-10"
              placeholder="Enter country or region"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleLocationChange(e);
                  e.currentTarget.value = "";
                }
              }}
            />
            <div className="flex flex-row w-full flex-wrap gap-2">
              {fullWorkspace.fullForm.geography.map((item, index) => (
                <>
                  <div className="bg-Deep-Purple h-8 p-2 flex gap-1 items-center text-white rounded-lg" key={index}>
                    <div>{item}</div>
                    <button>x</button>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Listbox
            value={selectedEducation}
            onChange={(selectedOption) => {
              setSelectedEducation(selectedOption);
              dispatch(
                changeFullFormData({
                  name: "education",
                  value: selectedOption.name,
                })
              );
            }}
          >
            {({ open }) => (
              <>
                <Label className="block  text-base font-medium  text-Pri-Dark">
                  Average education level
                </Label>
                <div className="relative mt-2">
                  <ListboxButton className="relative w-full cursor-default rounded-md bg-white border border-Gray-Background py-2 pl-3 pr-10 text-left text-gray-900   ring-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                    <span className="block truncate font-normal">
                      {fullWorkspace.fullForm.education}
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
                      {peopleB.map((person) => (
                        <ListboxOption
                          key={person.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-yellow-500 text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {person.name}
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
          <Listbox
            value={selectedIndustry}
            onChange={(selectedOption) => {
              setSelectedIndustry(selectedOption);
              dispatch(
                changeFullFormData({
                  name: "industry",
                  value: selectedOption.name,
                })
              );
            }}
          >
            {({ open }) => (
              <>
                <Label className="block  text-base font-medium  leading-6 text-Pri-Dark ">
                  Industry
                </Label>
                <div className="relative mt-2">
                  <ListboxButton className="relative w-full cursor-default rounded-md bg-white border border-Gray-Background  py-2 pl-3 pr-10 text-left text-gray-900    focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                    <span className="block truncate font-normal">
                      {fullWorkspace.fullForm.industry}
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
                      {industry.map((person) => (
                        <ListboxOption
                          key={person.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-yellow-500 text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {person.name}
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

        <div className="w-full">
          <div className="text-Pri-Dark text-base font-medium">Visibility</div>
          <fieldset className="flex w-full flex-col justify-start m-0 p-0 mt-2">
            <button
              className="flex flex-row  "
              onClick={() => {
                changeVisibility("Public");
                dispatch(
                  changeFullFormData({ name: "visibility", value: "Public" })
                );
              }}
              id="Public"
            >
              <div>
                {visible.Public == true && (
                  <div>
                    <img
                      src="images/visibility/checked.svg"
                      className="h-6 w-8"
                      alt=""
                    />
                  </div>
                )}
                {visible.Public == false && (
                  <div>
                    <img
                      src="images/visibility/unchecked.svg"
                      className="h-6 w-8"
                      alt=""
                    />
                  </div>
                )}
              </div>
              <div className="pl-4">
                <div className="text-start text-Pri-Dark text-base font-medium">
                  Public
                </div>
                <div className="flex justify-start items-start text-start text-exsm text-Dark-gray">
                  (Free) Anyone can respond to the poll. Responses & insights
                  may be used by PollVault.
                </div>
              </div>
            </button>
            <button
              className="flex flex-row  mt-4"
              onClick={() => {
                changeVisibility("Private");
                dispatch(
                  changeFullFormData({ name: "visibility", value: "Private" })
                );
              }}
              id="Private"
            >
              <div>
                {visible.Private == true && (
                  <div>
                    <img
                      src="images/visibility/checked.svg"
                      className="h-6 w-8"
                      alt=""
                    />
                  </div>
                )}
                {visible.Private == false && (
                  <div>
                    <img
                      src="images/visibility/unchecked.svg"
                      className="h-6 w-8"
                      alt=""
                    />
                  </div>
                )}
              </div>
              <div className="pl-4">
                <div className="text-start text-Pri-Dark text-base font-medium">
                  Anyone with the link
                </div>
                <div className="flex justify-start items-start text-start  text-exsm text-Dark-gray">
                  Only people with the link, code, or QR code can respond.
                  Responses & insights are private.
                </div>
              </div>
            </button>
            <button
              className="flex flex-row  mt-4"
              onClick={() => {
                changeVisibility("Invite");
                dispatch(
                  changeFullFormData({ name: "visibility", value: "Invite" })
                );
              }}
              id="Invite"
            >
              <div>
                {visible.Invite == true && (
                  <div>
                    <img
                      src="images/visibility/checked.svg"
                      className="h-6 w-8"
                      alt=""
                    />
                  </div>
                )}
                {visible.Invite == false && (
                  <div>
                    <img
                      src="images/visibility/unchecked.svg"
                      className="h-6 w-8"
                      alt=""
                    />
                  </div>
                )}
              </div>
              <div className="pl-4">
                <div className="text-start text-Dark-gray text-base font-medium">
                  Invite only
                </div>
                <div className="flex justify-start items-start text-start  text-exsm text-Dark-gray">
                  (Coming soon) Unique link for each invited individual.
                  Responses & insights are private.
                </div>
              </div>
            </button>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export default Audience;
