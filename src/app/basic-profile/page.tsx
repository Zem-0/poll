/* eslint-disable @next/next/no-img-element */
"use client";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";

import PollvaultSidebarData from "@/components/PollvaultSidebarData";
import { classNames, industry, salutation } from "../../static/static_data";
import { setUpProfile } from "../api/auth";
import Button from "@/components/ui/buttons/Button";

interface Industry {
  name: string;
}

const BasicProfile = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selected, setSelected] = useState(salutation[0]);
  const [formData, setFormData] = useState({
    email: "",
    salutation: "Mr",
    firstName: "",
    lastName: "",
    location: "US",
    industry: industry[0],
    phoneNumber: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      email: localStorage.getItem("email") || "",
    }));
  }, []);

  async function handeProfileSubmit() {
    try {
      const response = await setUpProfile(formData);
      if (response?.status === 200) {
        window.location.href = `/dashboard/${encodeURIComponent("My workspace")}`;
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("Failed to set up profile");
    }
  }

  return (
    <>
      <div className="h-screen overflow-y-hidden">
        <div className="flex min-h-full flex-1">
          <PollvaultSidebarData />
          <div className="w-3/4 md:w-3/4 bg-Bg-Gray flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="h-full flex flex-row items-center justify-center">
              <div className="h-4/5 flex flex-col justify-center max-w-[400px]">
                <div className=" justify-center flex md:justify-start font-sans font-bold text-2xl">Basic Profile</div>
                <div className="mt-6 mb-4 flex text-center md:text-start font-semibold text-Pri-Dark text-base">Enter the basic details of your profile. You can update later from the dashboard.</div>
                <div>
                  <Listbox value={selected} onChange={setSelected}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label>
                        <div className="relative mt-2">
                          <Listbox.Button className="relative w-24    border-Gray-Background  cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900  border focus:border-Purple-Border sm:text-sm sm:leading-6">
                            <span className="block truncate">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </Listbox.Button>

                          <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base focus:outline-none sm:text-sm">
                              {salutation.map((salutation) => (
                                <Listbox.Option
                                  key={salutation.id}
                                  className={({ active }) => classNames(active ? "bg-yellow-500 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-8 pr-4")}
                                  value={salutation}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}>{salutation.name}</span>

                                      {selected ? (
                                        <span className={classNames(active ? "text-white" : "text-yellow-500", "absolute inset-y-0 left-0 flex items-center pl-1.5")}>
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
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    onChange={handleChange}
                    className="block w-full text-sm rounded-md border  border-Gray-Background py-1.5 pl-4 outline-none text-gray-900  placeholder:text-gray-400  focus:border-Purple-Border  m:text-sm sm:leading-6 focus:bg-white "
                    placeholder="First name "
                  />
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    onChange={handleChange}
                    className="block w-full text-sm rounded-md border  border-Gray-Background  py-1.5 pl-4 outline-none text-gray-900   placeholder:text-gray-400  focus:border-Purple-Border  m:text-sm sm:leading-6"
                    placeholder="Last name"
                  />
                </div>
                <div className="mt-2">
                  <input
                    type="email"
                    name="location"
                    id="email"
                    onChange={handleChange}
                    className="block w-full text-sm  rounded-md border  border-Gray-Background  py-1.5 pl-4 outline-none text-gray-900  placeholder:text-gray-400  focus:border-Purple-Border  m:text-sm sm:leading-6"
                    placeholder="Location"
                  />
                </div>
                <div className="mt-2">
                  <Listbox value={selectedIndustry} onChange={setSelectedIndustry}>
                    {({ open }) => (
                      <>
                        <div className="relative mt-2">
                          <Listbox.Button className="text-gray-400 h-10 outline-none border  border-Gray-Background  bg-white  relative w-full cursor-default rounded-md py-1.5 pl-3 pr-10 text-left   focus:outline-none focus:ring-0 sm:text-sm sm:leading-6">
                            <span className="block truncate">{selectedIndustry === null ? <> Select an industry</> : <> {selectedIndustry?.name}</>}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </Listbox.Button>

                          <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {industry.map((salutation) => (
                                <Listbox.Option
                                  key={salutation.id}
                                  className={({ active }) => classNames(active ? "bg-yellow-600 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")}
                                  value={salutation}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}>{salutation.name}</span>

                                      {selected ? (
                                        <span className={classNames(active ? "text-white" : "text-yellow-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
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
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="absolute w-16 inset-y-0 left-0 flex items-center">
                      <select id="country" name="country" autoComplete="country" className="m-1 w-16 rounded-md  bg-white py-0 flex pl-4 justify-center  text-gray-500 focus:outline-none  sm:text-sm">
                        <option>US</option>
                        <option>CA</option>
                        <option>EU</option>
                      </select>
                    </div>
                    <input
                      type="phone"
                      name="phoneNumber"
                      id="phone"
                      onChange={handleChange}
                      className="block p-4  w-full rounded-md border  border-Gray-Background  py-1.5 pl-16 text-gray-900 outline-none focus:border-Purple-Border placeholder:text-gray-400   sm:text-sm sm:leading-6"
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                  label="Continue"
                    type="primaryBlack"
                    onClick={() => {
                      handeProfileSubmit();
                    }}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicProfile;
