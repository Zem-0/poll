import axios from "axios";

import { ProfileSetupFormData } from "@/app/api/api_types/poll_types";

async function CheckRegistraction(access_token: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/checkjwt`, {
      headers: {
        APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        JWTToken: access_token,
      },
    });

    if (response.status === 200 && response.data.status === "success") {
      return true;
    }
    return false; // Explicitly return false for non-success responses
  } catch (err) {
    console.error("Error in CheckRegistraction:", err);
    return false; // Ensure the function always returns a boolean
  }
}

// Function for the signup process.
async function SignUp(email: string, password: string) {
  try {
    // Call the API endpoint for the
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/signup`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );
    // Return the response object.
    return response;
  } catch (err) {
    console.log(err);
  }
}

// Function for the signin process.
async function SignIn(email: string, password: string) {
  try {
    // Call the API endpoint for the
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/signin`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );

    // Return the response object.
    return response;
  } catch (err) {
    console.log(err);
  }
}

// Function for the OTP request.
async function RequestOtp(email: string) {
  // Set the email in the local storage so that it can be retrieved from it.
  localStorage.setItem("email", email);
  try {
    // Call the API for the OTP request..
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/sendotp`,
      {
        email: email,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );

    if (response.status == 200) {
      return true; // If the response is successful then return true.
    }

    return false;
  } catch (err) {
    console.log(err);
  }
}

async function VerifyOtp(email: string, otp: string) {
  try {
    // Call the API for the OTP verification.
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/verifyotp`,
      {
        email: email,
        otp: otp,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );

    if (response.status == 200) {
      return true; // Return true if the server sends success message.
    }

    // Return false if there is any error.
    return false;
  } catch (err) {
    console.log(err);
  }
}

// Function for the signup process.
async function ResetPasswords(email: string, password: string) {
  try {
    // Call the API endpoint for the
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/resetpassword`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );
    // Return the response.
    return response;
  } catch (err) {
    console.log(err);
  }
}

async function setUpProfile(formData: ProfileSetupFormData) {
  const { email, salutation, firstName, lastName, location, industry, phoneNumber } = formData;
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/profilesetup`,
      {
        email: email,
        salutation: salutation,
        firstname: firstName,
        lastname: lastName,
        location: location,
        industry: industry.name,
        phoneNumber: phoneNumber,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: localStorage.getItem("access_token"),
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

async function VerifyCode(otp: string) {
  try {
    // Call the API for the OTP verification.
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/responsequestions`,
      {
        survey_code: otp,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

// Export all the elements.
export { SignUp, SignIn, RequestOtp, VerifyOtp, ResetPasswords, setUpProfile, VerifyCode, CheckRegistraction };
