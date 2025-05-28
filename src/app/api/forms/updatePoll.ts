import axios from "axios";

import { OutlineState } from "@/app/api/api_types/poll_types";

async function fetchPollDetails(access_token: string, pollId: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getpolls`,
      {
        idoutline: pollId,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );

    return response;
  } catch (err) {
    console.log(err);
  }
}

async function updatePollDetails(access_token: string, pollId: string, outline: OutlineState) {
  const updatePolls = { ...outline, outline_id: pollId };

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/savepolls`,
      {
        outline: updatePolls,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );

    return response;
  } catch (err) {
    console.log(err);
  }
}

export { fetchPollDetails, updatePollDetails };
