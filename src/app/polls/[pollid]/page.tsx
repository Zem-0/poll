"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPollSettings } from "@/app/api/workspace/pollSettings";
import WorkspaceHeader from "@/app/polls/[pollid]/WorkspaceHeader";
import { setBasicData } from "@/lib/features/workspace/pollSettingsSlice";
import { handleBasicData } from "@/lib/features/workspace/workspaceSlice";
import { RootState } from "@/lib/store";

import Flow from "./components/Flow";
import Integrations from "./components/Integrations";
import Outline from "./components/Outline";
import Results from "./components/Results";
import Share from "./components/Share";
import AskPolly from "../../component/askpolly/page";
import Files from "@/app/analyze/[pollid]/components/Files/Files";
import PublishedPopup from "./components/PublishedPopup";
import Deer from "./components/Deer";

interface PageProps {
  params: any;
}

const Page: React.FC<PageProps> = ({ params }) => {
  const dispatch = useDispatch();
  const workspaceHeader = useSelector(
    (state: RootState) => state.workspaceHeader
  );
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const outlineSlice = useSelector((state: RootState) => state.outline);

  useEffect(() => {
    async function getDetails() {
      setIsQuestionsLoading(true);
      const access_token = localStorage.getItem("access_token");
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getoutline`,
          {
            idoutline: params.pollid,
          },
          {
            headers: {
              APISECRET: process.env.NEXT_PUBLIC_APISECRET,
              JWTToken: access_token,
            },
          }
        );
                
        dispatch(
          handleBasicData({
            outline: response.data.outline,
          })
        );
      } catch (err) {
        console.log(err);
      } finally {
        setIsQuestionsLoading(false);
      }
    }
    getDetails();
  }, [dispatch, params]);

  useEffect(() => {
    async function getAllPollsSettings() {
      try {
        const access_token = localStorage.getItem("access_token") || null;
        if (access_token !== null) {
          const response = await getPollSettings(access_token, params.pollid);
          dispatch(
            setBasicData({
              survey: response?.data.survey,
            })
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

    getAllPollsSettings();
  }, [dispatch, params]);

  return (
    <div className="flex flex-col min-h-screen">
      <WorkspaceHeader id={params.pollid} />
      {workspaceHeader.header === "Outline" && (
        <Outline
          pollId={params.pollid}
          isQuestionsLoading={isQuestionsLoading}
        />
      )}
      {workspaceHeader.header === "askPolly" && <AskPolly />}
      {workspaceHeader.header === "files" && <Files pollId={params.pollid} />}
      {workspaceHeader.header === "Flow" && <Flow />}
      {workspaceHeader.header === "Integrations" && <Integrations />}
      {workspaceHeader.header === "Share" && <Share />}
      {workspaceHeader.header === "Results" && (
        <Results pollId={params.pollid} />
      )}
      {workspaceHeader.header === "Deer" && (
        <Deer pollId={params.pollid} />
      )}

      {/* for publish popup */}
      {outlineSlice.survey_published && (
        <PublishedPopup />
      )}
    </div>
  );
};

export default Page;
