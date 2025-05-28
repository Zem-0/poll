import React, { useState } from "react";
import { MdDone } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  createPolls,
  createZapPolls,
} from "@/lib/features/dashboard/pollsSlice";
import Text from "./ui/Texts/Text";
import Button from "./ui/buttons/Button";

interface ShowPollsOptionsProps {
  toggleClose: () => void;
}

const ShowPollsOptions: React.FC<ShowPollsOptionsProps> = ({ toggleClose }) => {
  const [optionSeleted, setOptionSeleted] = useState("");
  const dispatch = useDispatch();

  function gettt(pollType: string) {
    if (pollType === "The Full works Poll") {
      dispatch(createPolls());
    } else if (pollType === "Zap Poll") {
      dispatch(createZapPolls());
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
          <div className="bg-Almost-white h-full md:h-3/4 max-w-4xl w-[90%] flex flex-col rounded-xl p-6">
            <div className="flex flex-row justify-between">
              <Text variant="h3">
                New Survey: What would you like to do today?
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
            <div className="flex flex-row py-4 gap-4">
              <div
                className="group w-full xl:w-1/2 min-w-40 border-gray-200 h-auto  border-2 rounded-xl p-4 flex flex-col gap-4 cursor-pointer hover:border-gray-300"
                onClick={() => setOptionSeleted("Zap Poll")}
              >
                <div
                  className={`relative w-full bg-Neutral rounded-xl flex items-center justify-center flex-col gap-4 p-6 border-2 border-transparent  group-hover:bg-orange-100 group-hover:border-orange-300 ${optionSeleted === "Zap Poll" && "bg-orange-100 border-orange-300"}`}
                >
                  <img
                    src="/images/polls/zap_poll.svg"
                    width={"35px"}
                    alt="analyze"
                  />
                  <Text variant="body15M" extraCSS="text-[16px] text-center">
                    I want to design and conduct a new{" "}
                    <span className="font-bold">a quick survey. </span>
                  </Text>
                  {optionSeleted === "Zap Poll" && (
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
                        Looking for inspiration drafting the right questions.
                      </Text>
                    </li>
                    <li>
                      <Text variant="body13R" extraCSS="text-textGray">
                        Eager to rapidly rollout a survey in a few minutes.
                      </Text>
                    </li>
                    <li>
                      <Text variant="body13R" extraCSS="text-textGray">
                        Who are tired of time consuming survey tools!
                      </Text>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                className="group w-full xl:w-1/2 min-w-40  border-gray-200 h-auto border-2 rounded-xl p-4 flex flex-col gap-4 cursor-pointer hover:border-gray-300"
                onClick={() => setOptionSeleted("The Full works Poll")}
              >
                <div
                  className={`relative w-full bg-Neutral rounded-xl flex items-center justify-center flex-col gap-4 p-6 border-2 border-transparent  group-hover:bg-orange-100 group-hover:border-orange-300 ${optionSeleted === "The Full works Poll" && "bg-orange-100 border-orange-300"}`}
                >
                  <img
                    src="/images/polls/full_work.svg"
                    width={"43px"}
                    alt="analyze"
                  />
                  <Text variant="body15M" extraCSS="text-[16px] text-center">
                    I want to design, control, and conduct a new{" "}
                    <span className="font-bold">survey. </span>
                  </Text>
                  {optionSeleted === "The Full works Poll" && (
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
                        With detailed questions ready for their audience.
                      </Text>
                    </li>
                    <li>
                      <Text variant="body13R" extraCSS="text-textGray">
                        Looking to rollout standardized surveys or interviews.
                      </Text>
                    </li>
                    <li>
                      <Text variant="body13R" extraCSS="text-textGray">
                        Eager to control more dynamic surveys to capture better
                        insights.
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

export default ShowPollsOptions;
