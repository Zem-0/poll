import axios from "axios";

import { UploadDataType } from "@/app/api/api_types/poll_types";

// Function for the signin process.
async function UploadPoll(uploadData: UploadDataType) {
  try {
    const {
      title,
      goal,
      document,
      workspace,
      endafterdate,
      endafterresponses,
      geography,
      education,
      industry,
      visibility,
    } = uploadData;

    const joinedGeography = Array.isArray(geography) ? geography.join(",") : geography;
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/uploadpoll`,
      {
        workspace,
        title,
        goal,
        document,
        endafterdate: endafterdate ? new Date(endafterdate).toISOString().split('T')[0] : null,
        endafterresponses,
        geography: joinedGeography,
        education,
        industry,
        visibility,
      },
      {
        headers: {
          'APISECRET': process.env.NEXT_PUBLIC_APISECRET,
          'JWTToken': localStorage.getItem("access_token"),
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return response;
    } else {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
  } catch (err) {
    console.error("Error in upload poll:", err);
    throw err; // Re-throw to handle in component
  }
}


async function GetPublishedPoll(access_token: string, idoutline: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getworld`,
      {
        idoutline,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );

    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    console.log(err);
  }
}

async function GetWorkspaceOutlines(access_token: string, workspace: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getworkspaceoutlines`,
      {
        workspace,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );

    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    console.log(err);
  }
}

async function deleteQuestion(access_token: string, data: { outline_id: string; question_number: string }) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/deletequestion`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "APISECRET": process.env.NEXT_PUBLIC_APISECRET || "",
          "JWTToken": access_token,
        },
      }
    );

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
      throw error.response?.data;
    }
    throw error;
  }
}

async function duplicateQuestion(access_token: string, data: { 
  outline_id: string; 
  question_number: string  // Keep as string since backend expects string
}) {
  // Convert question number to integer before sending
  const payload = {
    outline_id: data.outline_id,
    question_number: parseInt(data.question_number).toString() 
  };

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/duplicatequestion`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "APISECRET": process.env.NEXT_PUBLIC_APISECRET || "",
          "JWTToken": access_token,
        },
      }
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
      throw error.response?.data;
    }
    throw error;
  }
}

export { UploadPoll, GetPublishedPoll, GetWorkspaceOutlines, duplicateQuestion, deleteQuestion };

