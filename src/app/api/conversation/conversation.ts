import axios from "axios";

import { CurrentQuestionState } from "../api_types/poll_types";

async function getInstructions(survey_code: string, responder_id: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getrespondent`,
      {
        survey_code: survey_code,
        responder_id: responder_id,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function getFirstQuestion(survey_code: string, responder_id: string) {
  
  // const access_token = localStorage.getItem("access_token");
  try {
    // Call the API endpoint for the
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getfirstquestion`,
      {
        survey_code,
        responder_id,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );

    // if (response.data) {
    //   if (typeof response.data.options === "string" && response.data.options.trim() !== "") {
    //     try {
    //       response.data.options = JSON.parse(response.data.options);
    //     } catch (parseError) {
    //       console.error("Error parsing options:", parseError);
    //       response.data.options = [];
    //     }
    //   } else {
    //     response.data.options = [];
    //   }
    // }

    // Ensure max_no_of_choices is a number
    response.data.max_no_of_choices =
      parseInt(response.data.max_no_of_choices) || 1;

    return response;
  } catch (e) {
    console.log(e);
  }
}

async function getNextQuestion(
  answer: string,
  prevQuestion: CurrentQuestionState
) {
  const updatedPrevQuestion = {
    survey_code: prevQuestion.survey_code,
    current_question: {
      ...prevQuestion.current_question,
      answer_type: "text",
      answer: answer,
    },
  };

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/text/savegetnextquestion`,
      updatedPrevQuestion,
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );

    if (response.data && !Array.isArray(response.data.options)) {
      console.error("Unexpected options format:", response.data.options);
      response.data.options = [];
    }

    // Ensure max_no_of_choices is a number
    response.data.max_no_of_choices =
      parseInt(response.data.max_no_of_choices) || 1;
    return response;
  } catch (e) {
    console.error("Error fetching next question:", e);
    throw e;
  }
}

async function sendFeedback(
  survey_code: string,
  responder_id: string,
  feedback_text: string
) {
  try {
    // Call the API endpoint for the
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/savefeedback`,
      {
        survey_code,
        responder_id,
        feedback_text,
      },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
}

async function getNextQuestionVoice(
  answer: string,
  prevQuestion: CurrentQuestionState
) {
  // prevQuestion.current_question.answer_type="text"

  const updatedQuestion = {
    ...prevQuestion.current_question,
    answer_type: "text",
    answer: answer,
  };

  // Create a new object for prevQuestion with the updated current_question
  const updatedPrevQuestion: CurrentQuestionState = {
    ...prevQuestion,
    current_question: updatedQuestion,
  };
  try {
    // Call the API endpoint for the
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/voice/savegetnextquestion`,

      updatedPrevQuestion,

      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          // JWTToken: access_token,
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
}

// Add this function with other API calls in your conversation.ts file
const recordSurveyVisit = async (survey_code: string, visitor_id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/record-survey-visit/${survey_code}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "visitor-id": visitor_id,
          "visit-type": "visit",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error recording visit:", error);
  }
};

export {
  getFirstQuestion,
  getNextQuestion,
  getNextQuestionVoice,
  getInstructions,
  sendFeedback,
  recordSurveyVisit,
};
