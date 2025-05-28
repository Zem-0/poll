import axios from "axios";
import { AnalysisPollDataType } from "../api_types/analysisPoll_types";

//for creation of analysis poll
async function AnalysisPollApi(
    access_token: string,
    analysisPollData: AnalysisPollDataType
  ) {
    const {
      title,
      purpose,
      insights,
      industry,
      platform,
      imported,
      customInstructions,
      workspace,
    } = analysisPollData;
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_PORT}/analysis-poll`,
        {
          title,
          purpose,
          insights,
          industry,
          platform,
          imported,
          customInstructions,
          workspace,
        },
        {
          headers: {
            APISECRET: process.env.NEXT_PUBLIC_APISECRET,
            JWTToken: access_token,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error in AnalysisPollApi:", error);
      throw error;
    }
}

//get analysis poll
async function getAllAnalysisPollsApi(access_token: string, workspace: string) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_PORT}/analysis-polls/${workspace}`,
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

  // Get single analysis poll details
async function getSingleAnalysisPollDetails(pollId: string, access_token: string, workspace: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/analysis-poll/${pollId}`,
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
        params: {
          workspace, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching analysis poll details:", error);
    throw error;
  }
}

//for deleting the analysis poll
async function deleteAnalysisPollApi(pollId: string, accessToken: string) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/analysis-poll/${pollId}`,
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting analysis poll:",
        error.response?.data,
        error.response?.status
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}
  

  export { AnalysisPollApi, getAllAnalysisPollsApi, getSingleAnalysisPollDetails, deleteAnalysisPollApi };
