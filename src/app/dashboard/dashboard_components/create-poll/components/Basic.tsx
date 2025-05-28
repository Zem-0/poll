// Basic.tsx
"use state";

import { useDispatch, useSelector } from "react-redux";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { DatePicker } from "@mui/x-date-pickers";
import { Fragment, useState } from "react";
import dayjs from "dayjs";
import { changeFullFormData } from "@/lib/features/workspace/fullWorkspaceSliece";
import { RootState } from "@/lib/store";
import mammoth from "mammoth";
import { classNames, peopleA } from "@/static/static_data";
import Text from "@/components/ui/Texts/Text";
import ConversationToggles from "../../ConversationToggles";

const Basic: React.FC<any> = ({
  workspaces,
  selectedWorkspace,
  setSelectedWorkspace,
}) => {
  const dispatch = useDispatch();
  const fullWorkspace = useSelector((state: RootState) => state.fullWorkspace);
  const [selected, setSelected] = useState(peopleA[0]);
  const [fileName, setFileName] = useState("");
  const [contentOption, setContentOption] = useState("simple");

  const handleDateChange = (date: any) => {
    if (date && dayjs(date).isValid()) {
      dispatch(
        changeFullFormData({
          name: "endafterdate",
          value: dayjs(date).format("YYYY-MM-DD"),
        })
      );
    } else {
      console.error("Invalid date:", date);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      let content: string | undefined;

      try {
        switch (file.type) {
          case "text/plain":
            content = e.target?.result as string;
            break;

          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            content = result.value;
            break;

          default:
            throw new Error(`Unsupported file type: ${file.type}`);
        }

        if (content) {
          dispatch(changeFullFormData({ name: "document", value: content }));
        }
      } catch (error) {
        console.error("Error processing file:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };
  

  return (
    <div className="flex flex-col">
      <div className="h-full flex flex-col gap-5">
        <ConversationToggles
          contentOption={contentOption}
          setContentOption={setContentOption}
        />
        <div>
          <label htmlFor="title" className="block">
            <Text variant="body15R">Title</Text>
          </label>
          <div className="mt-2">
            <input
              id="title"
              name="title"
              type="text"
              autoComplete="off"
              required
              value={fullWorkspace.fullForm.title}
              className="block w-full rounded-md py-3 px-2.5  border-2 border-Gray-Background outline-none  placeholder:text-gray-400 focus:border-yellow-500 sm:text-sm sm:leading-6"
              placeholder="Enter your poll title"
              onChange={(e) => {
                dispatch(
                  changeFullFormData({
                    name: "title",
                    value: e.target.value,
                  })
                );
              }}
            />
          </div>
        </div>

        <div>
          <Listbox
            value={selected}
            onChange={(selectedOption) => {
              dispatch(
                changeFullFormData({
                  name: "goal",
                  value: selectedOption.name,
                })
              );
              setSelected(selectedOption);
            }}
          >
            {({ open }) => (
              <>
                <Text variant="body15R">Goal</Text>
                <div className="relative mt-2">
                  <ListboxButton className="relative w-full cursor-default rounded-md border border-Gray-Background bg-white py-3 pl-3 pr-10 text-left text-gray-900   focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                    <span className="block truncate font-normal">
                      {fullWorkspace.fullForm.goal}
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
                      {peopleA.map((person) => (
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
            value={selectedWorkspace}
            onChange={(selectedOption) => {
              setSelectedWorkspace(selectedOption);
              dispatch(
                changeFullFormData({
                  name: "workspace",
                  value: selectedOption,
                }))
            }}
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
                             relative cursor-default select-none py-2 pl-3 pr-9`
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
          <label htmlFor="file-upload" className="block">
            <Text variant="body15R">Upload introduction and questions</Text>
          </label>
          <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed text-Pri-Dark px-6 py-10">
            <div className="text-center flex flex-col gap-2">
              <div className="flex justify-center">
                <img
                  src="/images/workspace/upload_file.svg"
                  alt=""
                  className="w-8 h-auto"
                />
              </div>

              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold  text-Normal-Blue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 hover:text-Normal-Blue"
                >
                  <span className="">Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".txt,.pdf,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>

              {fileName === "" ? (
                <p className="text-xs leading-5 text-gray-600">
                  Text or Word file
                </p>
              ) : (
                <div className="text-xs w-5/6 px-2 py-1 text-gray-600 bg-blue-200 rounded-xl flex flex-row gap-1 justify-around">
                  <span>{fileName}</span>
                  <span>✕</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <Text variant="body15R">End after</Text>
          <div className="w-full flex justify-between gap-4">
            <DatePicker
              value={dayjs(fullWorkspace.fullForm.endafterdate)}
              defaultValue={dayjs(fullWorkspace.fullForm.endafterdate).format(
                "YYYY-MM-DD"
              )}
              onChange={handleDateChange}
            />
            <input
              className=" bg-white rounded-lg h-14  border-none ring-none outline-none"
              name="endafterresponses"
              value={fullWorkspace.fullForm.endafterresponses}
              placeholder="# of responses"
              onChange={(e) => {
                dispatch(
                  changeFullFormData({
                    name: "endafterresponses",
                    value: e.target.value,
                  })
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basic;
