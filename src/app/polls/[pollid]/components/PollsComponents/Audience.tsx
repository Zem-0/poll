/* eslint-disable @next/next/no-img-element */
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updatePollDetails } from "@/app/api/forms/updatePoll";
import { changeFormData } from "@/lib/features/dashboard/updatePoll";
import { RootState } from "@/lib/store";
import { classNames, industry, peopleB, peopleC } from "@/static/static_data";

interface VisibilityState {
  [key: string]: boolean;
}

interface AudienceProps {
  pollId: string;
}

const Audience: React.FC<AudienceProps> = ({ pollId }) => {
  const [visible, setVisible] = useState<VisibilityState>({
    Public: true,
    Private: false,
    Invite: false,
  });

  function changeVisibility(target: string) {
    setVisible((prevVisible) => ({
      ...Object.fromEntries(Object.entries(prevVisible).map(([key]) => [key, key === target])),
    }));
  }

  const [selectedEducation, setSelectedEducation] = useState(peopleB[3]);
  const [selectedIndustry, setSelectedIndustry] = useState(peopleC[3]);
  const dispatch = useDispatch();
  const updatePollSlice = useSelector((state: RootState) => state.updatePoll.outline);

  async function handeSubmit() {
    const access_token = localStorage.getItem("access_token") || null;

    if (access_token !== null) {
      const response = await updatePollDetails(access_token, pollId, updatePollSlice);
      if (response?.status == 200) {
        // console.log(response);
      }
    }
  }

  const handleLocationChange = (e: any) => {
    const { value } = e.target;
    dispatch(changeFormData({ name: "geography", value: value }));
  };

  return (
    <>
      <div className="w-full absolute flex flex-col top-0 left-0 h-screen gap-6 px-12 pb-4 text-Pri-Dark">
        <div className="text-[18px] text-Pri-Dark font-medium mt-4">Audience</div>
        <div>
          <label htmlFor="email" className="block text-base font-medium leading-6 text-Pri-Dark">
            Where are they from ?
          </label>
          <div className="mt-2">
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
                {updatePollSlice.geography.split(",").map((item, index) => (
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
        </div>
        <div>
          <Listbox
            value={selectedEducation}
            onChange={(selectedOption) => {
              setSelectedEducation(selectedOption);
            }}
          >
            {({ open }) => (
              <>
                <Listbox.Label className="block text-base font-medium leading-6 text-Pri-Dark">Average education level</Listbox.Label>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white border border-Gray-Background  py-3 pl-3 pr-10 text-left text-gray-900  outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                    <span className="block truncate">{updatePollSlice.education}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {peopleB.map((person) => (
                        <Listbox.Option
                          key={person.id}
                          className={({ active }) => classNames(active ? "bg-yellow-500 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")}
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}
                                onClick={() => {
                                  dispatch(
                                    changeFormData({
                                      name: "education",
                                      value: person.name,
                                    })
                                  );
                                }}
                              >
                                {person.name}
                              </span>

                              {selected ? (
                                <span className={classNames(active ? "text-white" : "text-yellow-500", "absolute inset-y-0 right-0 flex items-center pr-4")}>
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
            value={selectedIndustry}
            onChange={(selectedOption) => {
              setSelectedIndustry(selectedOption);
            }}
          >
            {({ open }) => (
              <>
                <Listbox.Label className="block text-base font-medium leading-6 text-Pri-Dark">Industry</Listbox.Label>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 border border-Gray-Background  focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                    <span className="block truncate">{updatePollSlice.industry}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {industry.map((person) => (
                        <Listbox.Option
                          key={person.id}
                          className={({ active }) => classNames(active ? "bg-yellow-500 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")}
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}
                                onClick={() => {
                                  dispatch(
                                    changeFormData({
                                      name: "industry",
                                      value: person.name,
                                    })
                                  );
                                }}
                              >
                                {person.name}
                              </span>

                              {selected ? (
                                <span className={classNames(active ? "text-white" : "text-indigo-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
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

        <div className="mt-8 tex-base font-medium">Visibility</div>
        <div className="w-full">
          <fieldset className="flex w-full flex-col justify-start m-0 p-0">
            <button
              className="flex flex-row  "
              onClick={() => {
                changeVisibility("Public");
                dispatch(changeFormData({ name: "visibility", value: "Public" }));
              }}
              id="Public"
            >
              <div>
                {visible.Public == true && (
                  <div>
                    <img src="/images/visibility/checked.svg" className="h-6 w-8" alt="" />
                  </div>
                )}
                {visible.Public == false && (
                  <div>
                    <img src="/images/visibility/unchecked.svg" className="h-6 w-8" alt="" />
                  </div>
                )}
              </div>
              <div className="pl-4">
                <div className={`${visible.Public === true ? "font-semibold " : ""} text-base text-start text-Pri-Dark font-medium `}>Public</div>
                <div className="flex justify-start items-start text-start  text-exsm text-Dark-gray">(Free) Anyone can respond to the poll. Responses & insights may be used by PollVault.</div>
              </div>
            </button>
            <button
              className="flex flex-row  mt-4"
              onClick={() => {
                changeVisibility("Private");
                dispatch(changeFormData({ name: "visibility", value: "Private" }));
              }}
              id="Private"
            >
              <div>
                {visible.Private == true && (
                  <div>
                    <img src="/images/visibility/checked.svg" className="h-6 w-8" alt="" />
                  </div>
                )}
                {visible.Private == false && (
                  <div>
                    <img src="/images/visibility/unchecked.svg" className="h-6 w-8" alt="" />
                  </div>
                )}
              </div>
              <div className="pl-4">
                <div className={`${visible.Private === true ? "font-semibold " : ""} text-base text-start text-Pri-Dark font-medium `}>Anyone with the link</div>
                <div className="flex justify-start items-start text-start  text-exsm text-Dark-gray">Only people with the link, code, or QR code can respond. Responses & insights are private.</div>
              </div>
            </button>
            <button
              className="flex flex-row  mt-4"
              onClick={() => {
                changeVisibility("Invite");
                dispatch(changeFormData({ name: "visibility", value: "Invite" }));
              }}
              id="Invite"
            >
              <div>
                {visible.Invite == true && (
                  <div>
                    <img src="/images/visibility/checked.svg" className="h-6 w-8" alt="" />
                  </div>
                )}
                {visible.Invite == false && (
                  <div>
                    <img src="/images/visibility/unchecked.svg" className="h-6 w-8" alt="" />
                  </div>
                )}
              </div>
              <div className="pl-4">
                <div className="text-start text-Dark-gray text-base font-medium">Invite only</div>
                <div className="flex justify-start items-start text-start  text-exsm text-Dark-gray">(Coming soon) Unique link for each Invited individual. Responses & insights are private.</div>
              </div>
            </button>
          </fieldset>
        </div>
        <div className="flex justify-end items-start mt-12  flex-grow ">
          <button
            className="bg-Pri-Dark font-medium px-5 py-2.5  text-white rounded-md flex  justify-center items-center"
            onClick={() => {
              handeSubmit();
            }}
          >
            Update
            <img src="/images/dashboard/tick.svg" alt="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Audience;
