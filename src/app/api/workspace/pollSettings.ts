import axios from "axios";

async function getPollSettings(access_token: string, poll_id: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getpolls`,
      { idoutline: poll_id },
      {
        headers: {
          "Content-Type": "application/json",
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

async function DeletePoll(access_token: string, poll_id: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/deleteoutline`,
      { idoutline: poll_id },
      {
        headers: {
          "Content-Type": "application/json",
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

export { getPollSettings, DeletePoll };
