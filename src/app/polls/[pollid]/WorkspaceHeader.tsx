/* eslint-disable @next/next/no-img-element */
"use client";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetPublishedPoll } from "@/app/api/forms/poll";
import { saveOutline, publishOutline } from "@/app/api/Outline/Outline";
import {
  publishChanges,
  setSurveyValues,
} from "@/lib/features/workspace/outlineSlice";
import { toogleChanges } from "@/lib/features/workspace/workSpaceHeaderSlice";
import { RootState } from "@/lib/store";
import { userNavigation } from "@/static/static_data";
import { navigation, user } from "@/static/workspace";
import Navbar from "@/app/component/Navbar";
import Button from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/component/ToasterProvider";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface PageProps {
  id: any;
}

const WorkspaceHeader: React.FC<PageProps> = ({ id }) => {
  const workspace = useSelector((state: RootState) => state.workspace.formData);
  const router = useRouter();
  const workspaceOutlineSlice = useSelector(
    (state: RootState) => state.pollSettings.pollData
  );
  const workspaceHeader = useSelector(
    (state: RootState) => state.workspaceHeader
  );
  const [saveLoading, setSaveLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const dispatch = useDispatch();
  const outlineSlice = useSelector((state: RootState) => state.outline);
  const survey_code = outlineSlice.survey_link;
  const unique_link = outlineSlice.unique_link;
  const { showToast } = useToast();

  async function Publish() {
    setPublishLoading(true);
    try {
      const response = await publishOutline(workspace, workspaceOutlineSlice);

      if (response?.status !== 200) throw new Error("Failed to delete file");
      showToast({ type: "success", message: "Poll published successfully!" });

        dispatch(
          publishChanges({
            survey_link: response.data.survey_code,
            unique_link: `${process.env.NEXT_PUBLIC_FRONTEND_PORT}/conversation/${response.data.survey_code}`,
          })
        );
    } catch (err) {
      showToast({ type: "error", message: "Failed to publish poll!" });
      console.log(err);
    } finally {
      setPublishLoading(false);
    }
  }

  async function Save() {
    try {
      setSaveLoading(true);
      const response = await saveOutline(workspace, workspaceOutlineSlice);

      if (response?.status !== 200) throw new Error("Failed to delete file");

      setSaveLoading(false);
      showToast({ type: "success", message: "Poll saved successfully!" });
    } catch (err) {
      showToast({ type: "error", message: "Failed to save poll!" });
      console.error(err);
      setSaveLoading(false);
    }
  }

  async function getPublishedPoll() {
    try {
      const access_token = localStorage.getItem("access_token") || null;
      if (access_token !== null) {
        const response = await GetPublishedPoll(access_token, id);
        if (response?.status === 200) {
          dispatch(
            publishChanges({
              survey_link: response.data.survey_code,
              unique_link: `${process.env.NEXT_PUBLIC_FRONTEND_PORT}/conversation/${response.data.survey_code}`,
            })
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function setPublishValue() {
      try {
        const access_token = localStorage.getItem("access_token") || null;
        if (access_token !== null) {
          const response = await GetPublishedPoll(access_token, id);
          if (response?.status === 200) {
            dispatch(
              setSurveyValues({
                survey_link: response.data.survey_code,
                unique_link: `${process.env.NEXT_PUBLIC_FRONTEND_PORT}/conversation/${response.data.survey_code}`,
              })
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    setPublishValue();
  }, []);

  return (
    <>
      <Disclosure
        as="header"
        className="bg-white shadow border-2 border-Gray-Background"
      >
        {({ open }) => (
          <>
            {/* <div className="mx-auto px-2 sm:px-4  lg:px-8"> */}
            <div>
              <Navbar
                centerContent={workspaceOutlineSlice?.survey?.title || ""}
              />
              <nav
                className="hidden lg:flex gap-6  lg:py-2 mx-auto px-2 sm:px-4  lg:px-8"
                aria-label="Global"
              >
                <button
                  key={"Outline"}
                  name="Outline"
                  className={classNames(
                    workspaceHeader.header === "Outline"
                      ? "text-Normal-Blue "
                      : "text-gray-900  hover:text-gray-900",
                    "flex  items-center  text-sm font-medium "
                  )}
                  onClick={() => {
                    dispatch(toogleChanges({ name: "Outline" }));
                  }}
                >
                  <div
                    className={`${workspaceHeader.header == "Outline" ? "border-b-2 border-Purple-Border font-semibold" : "font-medium"} py-0.5 px-1 `}
                  >
                    Outline
                  </div>
                </button>

                <button
                  key={"Results"}
                  name={"Results"}
                  className={classNames(
                    workspaceHeader.header === "Results"
                      ? "text-Normal-Blue "
                      : "text-gray-900  hover:text-gray-900",
                    "flex  items-center  text-sm font-medium "
                  )}
                  onClick={() => {
                    dispatch(toogleChanges({ name: "Results" }));
                  }}
                >
                  <div
                    className={`${workspaceHeader.header == "Results" ? "border-b-2 border-Purple-Border font-semibold" : ""} py-0.5 px-1 `}
                  >
                    <div className={`text-medium font-medium`}> Results</div>
                  </div>
                </button>

                <button
                  key={"askPolly"}
                  name={"askPolly"}
                  className={classNames(
                    workspaceHeader.header === "askPolly"
                      ? "text-Normal-Blue "
                      : "text-gray-900  hover:text-gray-900",
                    "flex  items-center  text-sm font-medium "
                  )}
                  onClick={() => {
                    dispatch(toogleChanges({ name: "askPolly" }));
                  }}
                >
                  <div
                    className={`${workspaceHeader.header == "askPolly" ? "border-b-2 border-Purple-Border font-semibold" : ""} py-0.5 px-1 `}
                  >
                    <div className={`text-medium font-medium text-nowrap`}>
                      {" "}
                      Ask Polly
                    </div>
                  </div>
                </button>

                <button
                  key={"files"}
                  name={"files"}
                  className={classNames(
                    workspaceHeader.header === "files"
                      ? "text-Normal-Blue "
                      : "text-gray-900  hover:text-gray-900",
                    "flex  items-center  text-sm font-medium "
                  )}
                  onClick={() => {
                    dispatch(toogleChanges({ name: "files" }));
                  }}
                >
                  <div
                    className={`${workspaceHeader.header == "files" ? "border-b-2 border-Purple-Border font-semibold" : ""} py-0.5 px-1 `}
                  >
                    <div className={`text-medium font-medium text-nowrap`}>
                      Files
                    </div>
                  </div>
                </button>

                <button
                  key={"integrations"}
                  name={"integrations"}
                  className={classNames(
                    "text-gray-900 cursor-not-allowed hover:text-gray-900",
                    "inline-flex items-center   text-sm font-medium "
                  )}
                >
                  <div
                    className={` "border-b-2 border-blue-800"   text-medium  font-medium text-Lt-Gray`}
                  >
                    {" "}
                    Integrations
                  </div>
                </button>

                {/* <button key={"promote"} name={"promote"} className={classNames("text-gray-900 cursor-not-allowed  hover:text-gray-900", "inline-flex items-center  text-sm font-medium ")}>
                  <div className={` "border-b-2 border-blue-800" : ""} text-medium font-medium text-Lt-Gray `}> Promote</div>
                </button>

                <button key={"flow"} disabled name={"flow"} className={classNames("text-gray-900 cursor-not-allowed hover:text-gray-900", "inline-flex items-center text-sm font-medium ")}>
                  <div className={` "border-b-2 border-blue-800" : ""} text-medium font-medium text-Lt-Gray `}> Flow</div>
                </button> */}

                <div className="w-full items-center flex flex-row justify-end gap-2">
                  <div>
                    <Button
                      label="Save"
                      type="primaryBlue"
                      onClick={() => Save()}
                      loading={saveLoading}
                    />
                  </div>
                  <div>
                    <Button
                      label="Publish"
                      type="primaryBlack"
                      clickAnimation={true}
                      onClick={() => Publish()}
                      loading={publishLoading}
                    />
                  </div>

                  <div>
                    <Button
                      type="primaryWhite"
                      onClick={() => {
                        if (unique_link) {
                          window.open(unique_link, "_blank"); // Opens the link in a new tab
                        }
                      }}
                      // loading={publishLoading}
                      iconSrc="/images/workspace/globe.svg"
                      iconHoverSrc="/images/workspace/globeWhite.svg"
                    />
                  </div>

                  <div>
                    <Button
                      type="primaryWhite"
                      onClick={getPublishedPoll}
                      // loading={publishLoading}
                      iconSrc="/images/workspace/password.svg"
                      iconHoverSrc="/images/workspace/passwordWhite.svg"
                    />
                  </div>
                </div>
              </nav>
            </div>

            <Disclosure.Panel
              as="nav"
              className="lg:hidden"
              aria-label="Global"
            >
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                      "block rounded-md py-2  text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default WorkspaceHeader;
