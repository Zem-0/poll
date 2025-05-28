/* eslint-disable @next/next/no-img-element */
"use client";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toogleChanges } from "@/lib/features/workspace/analyzeHeaderSlice";
import { RootState } from "@/lib/store";
import Navbar from "@/app/component/Navbar";
import Button from "@/components/ui/buttons/Button";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface PageProps {
  id: any;
  title: string;
}

const AnalyzeHeader: React.FC<PageProps> = ({ id, title }) => {
  const analyzeHeader = useSelector((state: RootState) => state.analyzeHeader);
  const dispatch = useDispatch();
  
  return (
    <>
      <Disclosure as="header" className="bg-white  border-2 border-Gray-Background">
        {({ open }) => (
          <>
            <div className="mx-auto">
              <Navbar centerContent={title || "Survey Title"}/>
              <nav className="flex gap-6 py-3 px-2 sm:px-4 lg:px-8" aria-label="Global">
                
                <button
                  key={"Ask Polly"}
                  name="Ask Polly"
                  className={classNames(
                    analyzeHeader.header === "Ask Polly" ? "text-Normal-Blue " : "text-gray-900 hover:text-gray-900",
                    "flex items-center text-sm font-medium"
                  )}
                  onClick={() => {
                    dispatch(toogleChanges({ name: "Ask Polly" }));
                  }}
                >
                  <div className={`${analyzeHeader.header == "Ask Polly" ? "border-b-2 border-Purple-Border" : "font-medium"} py-0.5 px-1 `}>
                    Ask Polly
                  </div>
                </button>

                <button
                  key={"Files"}
                  name={"Files"}
                  className={classNames(
                    analyzeHeader.header === "Files" ? "text-Normal-Blue " : "text-gray-900 hover:text-gray-900",
                    "flex items-center text-sm font-medium"
                  )}
                  onClick={() => {
                    dispatch(toogleChanges({ name: "Files" }));
                  }}
                >
                  <div className={`${analyzeHeader.header == "Files" ? "border-b-2 border-Purple-Border " : "font-medium"} py-0.5 px-1 `}>
                    Files
                  </div>
                </button>

                <button
                  key={"Chat"}
                  name={"Chat"}
                  className={classNames(
                    analyzeHeader.header === "Chat" ? "text-Normal-Blue " : "text-gray-900 hover:text-gray-900",
                    "flex items-center text-sm font-medium"
                  )}
                  onClick={() => {
                    dispatch(toogleChanges({ name: "Chat" }));
                  }}
                >
                  <div className={`${analyzeHeader.header == "Chat" ? "border-b-2 border-Purple-Border " : "font-medium"} py-0.5 px-1 `}>
                    Chat
                  </div>
                </button>

                <button
                  key={"Results"}
                  name={"Results"}
                  className={classNames(
                    analyzeHeader.header === "Results" ? "text-Normal-Blue " : "text-gray-900 hover:text-gray-900",
                    "flex items-center text-sm font-medium"
                  )}
                  onClick={() => {
                    dispatch(toogleChanges({ name: "Results" }));
                  }}
                >
                  <div className={`${analyzeHeader.header == "Results" ? "border-b-2 border-Purple-Border" : "font-medium"} py-0.5 px-1 `}>
                    Results
                  </div>
                </button>

                <button
                  key={"Deer"}
                  name={"Deer"}
                  className={classNames(
                    analyzeHeader.header === "Deer" ? "text-Normal-Blue " : "text-gray-900 hover:text-gray-900",
                    "flex items-center text-sm font-medium"
                  )}
                  onClick={() => {
                    dispatch(toogleChanges({ name: "Deer" }));
                  }}
                >
                  <div className={`${analyzeHeader.header == "Deer" ? "border-b-2 border-Purple-Border" : "font-medium"} py-0.5 px-1 `}>
                    Deer
                  </div>
                </button>

              </nav>
            </div>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default AnalyzeHeader;
