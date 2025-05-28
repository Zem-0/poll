import axios from "axios";

import { ZapPollDataType } from "@/app/api/api_types/poll_types";
import { AnalysisPollDataType } from "../api_types/analysisPoll_types";

async function getAllOutLine(access_token: string, workspace: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getworkspaceoutlines`,
      { workspace: workspace },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );

    return response;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error("Axios error:", e.response?.data, e.response?.status);
    } else {
      console.error("Unexpected error:", e);
    }
    throw e;
  }
}

async function ZapPollApi(
  access_token: string,
  zapPollData: ZapPollDataType,
  currentWorkspace: string
) {
  const { title, iwantto, tellusmore } = zapPollData;

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/uploadzappoll`,
      {
        title: title,
        iwantto: iwantto,
        document: tellusmore,
        workspace: currentWorkspace,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function ExportPoll(title: string, version: string, outline_id: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/export-poll`,
      {
        outline_id: outline_id,
      },
      { responseType: "blob" } // Specify responseType as 'blob' to handle binary data
    );

    // Create a blob object from the response data
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Create a temporary URL for the blob object
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}_${version}.docx`);
    document.body.appendChild(link);

    // Click the link to trigger the download
    link.click();

    // Remove the temporary link and URL
    link?.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}

async function GetStats(pollId: string) {
  const access_token = localStorage.getItem("access_token");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getinsightsfromsurvey`,
      { outline_id: pollId },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function DuplicatePoll(pollId: string | boolean) {
  const access_token = localStorage.getItem("access_token");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/duplicateoutline`,
      { idoutline: pollId },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );
    return response;
  } catch (e) {
    console.log(e);
  }
}

export { getAllOutLine, ZapPollApi, ExportPoll, GetStats, DuplicatePoll };
