"use client";

import React, { useEffect, useState } from "react";
import AnalyzeHeader from "./AnalyzeHeader";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import Files from "./components/Files/Files";
import AskPolly from "@/app/component/askpolly/page";
import Chat from "./components/Chat/Chat";
import { getSingleAnalysisPollDetails } from "@/app/api/dashboard/analysis";
import { Deer } from "@/app/polls/[pollid]/components/Deer";

interface PageProps {
  params: {
    pollid: string;  // Add this to define the expected parameter
  }
}


const AnayzePage: React.FC<PageProps> = ({ params }) => {
  const analyzeHeader = useSelector((state: RootState) => state.analyzeHeader);
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [pollDetails, setPollDetails] = useState<any>(null);
  
  //for the survey header
  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        const accessToken = localStorage.getItem("access_token"); // Retrieve token from local storage
        if (!accessToken) {
          throw new Error("Access token not found");
        }
        const details = await getSingleAnalysisPollDetails(
          params.pollid,
          accessToken,
          currentWorkspace
        );
        
        setPollDetails(details.data);
      } catch (err) {
        console.error("Error fetching poll details:", err);
      } 
    };

    fetchPollDetails();
  }, [params.pollid]);

  return (
    <div className="flex flex-col min-h-screen ">
      <AnalyzeHeader id={params.pollid} title={pollDetails?.metadata.title || ""}/>
      {analyzeHeader.header === "Ask Polly" && (
        <AskPolly />
      )}
      {analyzeHeader.header === "Files" && <Files  pollId={params.pollid}/>}
      {analyzeHeader.header === "Chat" && <Chat />}
      {analyzeHeader.header === "Deer" && <Deer pollId={params.pollid} />}
    </div>
  );
};

export default AnayzePage;
