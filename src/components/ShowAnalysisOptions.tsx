import React, { useState } from "react";
import { MdDone } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  createAnalyze,
} from "@/lib/features/dashboard/pollsSlice";
import Text from "./ui/Texts/Text";
import Button from "./ui/buttons/Button";

interface ShowAnalysisOptionsProps {
  toggleClose: () => void;
}

const ShowAnalysisOptions: React.FC<ShowAnalysisOptionsProps> = ({ toggleClose }) => {
  const [optionSeleted, setOptionSeleted] = useState("");
  const dispatch = useDispatch();

  function gettt(pollType: string) {
    if(pollType === "Analyze Poll") {
      dispatch(createAnalyze());
    }
  }

  const handlePollsClick = () => {
    gettt(optionSeleted);
    setOptionSeleted("");
    toggleClose();
  };

  return (
    <>
      <div className="backdrop-blur-sm bg-opacity-50 w-screen justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
        <div className="min-h-screen w-full flex flex-row items-center justify-center">
          <div className="bg-Almost-white h-full md:h-3/4 max-w-4xl  flex flex-col rounded-xl p-6">
            <div className="flex flex-row justify-between">
              <Text variant="h3">
                New Analysis: What would you like to Analysis?
              </Text>
              <div className="flex justify-end ">
                <button
                  className="bg-Cross rounded-3xl h-6 w-6 hover:rotate-90 transition-transform"
                  onClick={toggleClose}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex py-4 gap-4">
              <div
                className="group w-full border-gray-200 border-2 rounded-xl p-4 flex flex-col gap-4 cursor-pointer hover:border-gray-300"
                onClick={() => setOptionSeleted("Analyze Poll")}
              >
                <div
                  className={`relative w-full bg-Neutral rounded-xl flex items-center justify-center flex-col gap-4 p-6 border-2 border-transparent  group-hover:bg-orange-100 group-hover:border-orange-300 ${optionSeleted === "Analyze Poll" && "bg-orange-100 border-orange-300"}`}
                >
                  <img
                    src="/images/polls/analyze.svg"
                    width={"43px"}
                    alt="analyze"
                  />
                  <Text variant="body15M" extraCSS="text-[16px] text-center">
                    I want to{" "}
                    <span className="font-bold">analyze existing </span> survey
                    & interview findings.
                  </Text>
                  {optionSeleted === "Analyze Poll" && (
                    <div className="absolute top-0 right-0 -translate-y-2/4 translate-x-2/4 rounded-full w-7 h-7 bg-purple-grad-dark-start text-white text-xl flex items-center justify-center">
                      <MdDone />
                    </div>
                  )}
                </div>

                <div>
                  <Text variant="body13M" extraCSS="font-extrabold">
                    Idea for users...
                  </Text>
                  <ul className="list-disc pl-4 mb-2 flex flex-col gap-2  text-left">
                    <li>
                      <Text variant="body13R" extraCSS="text-textGray">
                        With existing interview notes or responses from other
                        survey tools like SurveyMonkey, etc.
                      </Text>
                    </li>
                    <li>
                      <Text variant="body13R" extraCSS="text-textGray">
                        Looking for unique insights from their surveys /
                        interviews.
                      </Text>
                    </li>
                    <li>
                      <Text variant="body13R" extraCSS="text-textGray">
                        Eager to quickly use findings for reports or
                        presentations.
                      </Text>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-end gap-2">
              <Button
                label="Cancel"
                type="primaryWhite"
                onClick={toggleClose}
              />

              <Button
                label="Get Started"
                type="primaryBlack"
                disabled={optionSeleted === ""}
                onClick={() => {
                  handlePollsClick();
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ShowAnalysisOptions;