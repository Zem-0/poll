import Navbar from "@/app/component/Navbar";
import React, { useEffect, useState } from "react";
import Text from "../ui/Texts/Text";
import { MdDone } from "react-icons/md";
import Button from "../ui/buttons/Button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createAnalyze, createPolls, createZapPolls } from "@/lib/features/dashboard/pollsSlice";
import CreatePoll from "@/app/dashboard/dashboard_components/create-poll/page";
import ZapPoll from "@/app/dashboard/dashboard_components/zap-poll/zapopoll";
import AnalyzePoll from "@/app/dashboard/dashboard_components/analyze-poll/page";
import { GetAllWorkspaces } from "@/app/api/workspace/workSpaces";

const formOptions = [
  {
    id: "analyze-poll",
    title: "Analyze existing data & research",
    description:
      "Ideal for users with existing interviews or surveys, seeking quick, unique insights.",
    image: "/images/polls/analyze.svg",
    status: "active",
  },
  {
    id: "zap-poll",
    title: "Rollout zap survey using a few words",
    description:
      "Ideal for rapid survey design and rollout with minimal hassle in just 5 mins!.",
    image: "/images/polls/zap_poll.svg",
    status: "active",
  },
  {
    id: "full-works-poll",
    title: "Rollout dynamic survey w/full control",
    description:
      "Ideal for ditching old-school survey tools to wow users AND collect deeper insights.",
    image: "/images/polls/full_work.svg",
    status: "active",
  },
  {
    id: "audio-interview",
    title: "Rollout dynamic voice interview",
    description:
      "Ideal for streamlined, voice-based interviews for deeper, insights, as if you are there!",
    image: "/images/polls/audio_interview.svg",
    status: "active",
  },
  {
    id: "deliverables",
    title: "Create professional deliverables",
    description:
      "Coming soon - professional-grade presentation, research, reports, and more...",
    image: "/images/polls/presentation.svg",
    status: "in-active",
  },
  {
    id: "personal-expert",
    title: "Manage your personal expert network",
    description:
      "Coming soon - augment yourself with your 24x7 expert network.",
    image: "/images/polls/users.svg",
    status: "in-active",
  },
];

const HomeScreen = () => {
  const [optionSeleted, setOptionSeleted] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const handlePollsClick = () => {
    gettt(optionSeleted);
    setOptionSeleted("");
  };

   function gettt(pollType: string) {
      if (pollType === "full-works-poll") {
        dispatch(createPolls());
      } else if (pollType === "zap-poll") {
        dispatch(createZapPolls());
      } else if (pollType === "analyze-poll") {
        dispatch(createAnalyze())
      }
    }

    useEffect(() => {
      const getAllWorkspaces = async () => {
        const access_token = localStorage.getItem("access_token");
        if (!access_token) return;
  
        try {
          const response = await GetAllWorkspaces(access_token);
          
          if (response?.status === 200) {
            const workspacesData = response.data?.workspaces.reverse();
            setWorkspaces(workspacesData);            
          }
        } catch (error) {
          console.error("Error fetching workspaces:", error);
        } 
      };
  
      getAllWorkspaces();
    }, []);
    

  return (
    <div>
      <div className="flex min-h-screen flex-col ">
        {/* this is the navbar */}
        <Navbar />
        <div className="w-screen min-h-[calc(100vh-75px)] justify-center items-center flex">
          <div className="bg-Almost-white shadow-2xl h-full max-w-[90%] flex flex-col rounded-xl p-6 m-4">
            <div className="flex flex-row items-center justify-center">
              <Text variant="h3">What would you like to do today?</Text>
            </div>

            <div className="grid grid-cols-3 py-4 gap-4">
              {formOptions.map((option) => {
                const isInactive = option.status === "in-active";
                return (
                  <div
                    key={option.id}
                    className={`group max-w-[227px] h-auto border-2 rounded-xl p-4 flex flex-col gap-4
                              ${isInactive ? "border-gray-200 opacity-80 cursor-not-allowed" : "cursor-pointer hover:border-gray-300"}`}
                    onClick={() => {
                      if (!isInactive) {
                        setOptionSeleted(option.id);
                      }
                    }}
                  >
                    <div
                      className={`relative bg-Neutral rounded-xl flex items-center justify-center flex-col gap-4 p-4 border-2 border-transparent
            ${!isInactive && "group-hover:bg-orange-100 group-hover:border-orange-300"}
            ${optionSeleted === option.id && !isInactive && "bg-orange-100 border-orange-300"}`}
                    >
                      <img src={option.image} width={"33px"} alt="analyze" />
                      <Text
                        variant="body15M"
                        extraCSS="text-[16px] text-center"
                      >
                        {option.title}
                      </Text>
                      {optionSeleted === option.id && (
                        <div className="absolute top-0 right-0 -translate-y-2/4 translate-x-2/4 rounded-full w-7 h-7 bg-purple-grad-dark-start text-white text-xl flex items-center justify-center">
                          <MdDone />
                        </div>
                      )}
                    </div>

                    <div>
                      <Text variant="body13M" extraCSS="text-textGray">
                        {option.description}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* buttons */}
            <div className="flex flex-row justify-center gap-2">
              <Button
                label="Show dashboard"
                type="primaryWhite"
                onClick={() =>
                  router.push(
                    `/dashboard/${encodeURIComponent("My workspace")}`
                  )
                }
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

      {/* all the popup-options */}
      <ZapPoll workspaces={workspaces} />
      <CreatePoll workspaces={workspaces}/> 
      <AnalyzePoll workspaces={workspaces}/> 
    </div>
  );
};

export default HomeScreen;
