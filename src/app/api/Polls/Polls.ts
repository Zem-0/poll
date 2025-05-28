import axios from "axios";

// Function for the signin process.

async function GetDropOffAmouns(token: string, survey_code: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/get_drop_off_amounts`,
      {
        outline_id: survey_code,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: token,
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
}

export { GetDropOffAmouns };
