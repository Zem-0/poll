"use client";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeFormData } from "@/lib/features/dashboard/updatePoll";
import { RootState } from "@/lib/store";
import { peopleA, classNames } from "@/static/static_data";

interface BasicPollDetailsProps {
  handleExport: () => void;
  handleButtonClick: () => void;
  setFormPart: (part: string) => void;
}

const BasicPollDetails: React.FC<BasicPollDetailsProps> = ({
  handleExport,
  handleButtonClick,
  setFormPart,
}) => {
      const [selected, setSelected] = useState(peopleA[3]);
  const dispatch = useDispatch();
  const updatePollSlice = useSelector(
    (state: RootState) => state.updatePoll.outline
  );

  const handleDateChange = (date: any) => {
    dispatch(
      changeFormData({
        name: "endafterdate",
        value: `${date?.$y}-${date?.$M + 1}-${date?.$D}`,
      })
    );
  };

  return (
    <div className="h-full w-full top-0 left-0 px-12 flex flex-col gap-6 absolute">
      <div className="text-[18px] text-Pri-Dark font-medium mt-4">Basics</div>
      <div>
        <Listbox
          value={selected}
          onChange={(selectedOption) => {
            setSelected(selectedOption);
          }}
        >
          {({ open }) => (
            <>
              <Listbox.Label className="block text-base font-medium leading-6 Pri-dark">
                Goal
              </Listbox.Label>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md border border-Gray-Background bg-white py-3 pl-3 pr-10 text-left text-gray-900   ring-inset  focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-base sm:leading-6">
                  <span className="block truncate">{updatePollSlice.goal}</span>
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
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-base">
                    {peopleA.map((person) => (
                      <Listbox.Option
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
                              onClick={() => {
                                dispatch(
                                  changeFormData({
                                    name: "goal",
                                    value: person.name,
                                  })
                                );
                              }}
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
        <div className="text-base font-medium leading-6 text-Pri-Dark">
          End after
        </div>
        <div className="w-5/6 flex justify-between mt-2 gap-4">
          <DatePicker
            className="h-4"
            defaultValue={dayjs(updatePollSlice.endafterdate)}
            onChange={(e) => {
              handleDateChange(e);
            }}
          />

          <div className="flex flex-row bg-white border ring-none border-Gray-Background rounded-md hover:outline-yellow-500">
            <img src="/images/response_stack.svg" alt="icon" className="p-2" />
            <input
                type="number"
                min={0}
              className="w-full  bg-white rounded-md h-14 p-2   outline-none"
              name="endafterresponses"
              value={updatePollSlice?.endafterresponses}
              placeholder="# of response"
              onChange={(e) => {
                dispatch(
                  changeFormData({
                    name: "endafterresponses",
                    value: e.target.value,
                  })
                );
              }}
            />
          </div>
        </div>
      </div>
      <hr />
      <div>
        <div className="flex flex-row gap-2   justify-between">
          <div className="text-Pri-Dark font-medium">
            <span className="text-base font-sm">Export your poll</span>
            <span className="italic text-base font-sm">(.docs file)</span>
          </div>
          <button
            onClick={() => {
              handleExport();
            }}
          >
            <img src="/images/poll_type/download.svg" alt="" />
          </button>
        </div>
        <span className="italic text-base font-sm ">
          version {updatePollSlice.version}
        </span>
        <div className="flex justify-end pt-12 pb-8">
          <button
            className="bg-Pri-Dark font-bold h-10 w-1/5 text-white rounded-md"
            onClick={() => {
              handleButtonClick();
              setFormPart("audience");
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicPollDetails;
