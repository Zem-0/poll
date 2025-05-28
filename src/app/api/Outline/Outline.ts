import axios from "axios";

async function GetResponses(access_token: string, survey_code: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getresponsefromsurvey`,
      {
        outline_id: survey_code,
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

// Function for the signin process.
async function saveOutline(workspace: any, titleData: any) {
  if (!workspace || !workspace.outline) {
    console.error("Invalid workspace:", workspace);
    throw new Error("Invalid upload data structure");
  }
  const currentUrl = new URL(window.location.href);
  const outlineId = currentUrl.pathname.split("/").pop();
  const access_token = localStorage.getItem("access_token");

  // Formatting questions with support for rating type questions
  const formattedQuestions = workspace.outline.questions.map((q: any) => {
    const baseQuestion = {
      question_number: String(q.question_number), // Ensure string
      importance: q.importance || "normal",
      required: q.required === true ? "TRUE" : "FALSE",
      instruction: q.instruction,
      dynamic_followup: q.dynamic_followup,
      objective: q.objective,
      max_no_of_questions: q.max_no_of_questions
        ? String(q.max_no_of_questions)
        : null,
      keywords_to_probe: q.keywords_to_probe,
      things_to_avoid: q.things_to_avoid,
      example_questions: q.example_questions,
      allow_others: q.allow_others === true ? "TRUE" : "FALSE",
      max_no_of_choices: q.max_no_of_choices
        ? Number(q.max_no_of_choices)
        : null, // Send as number
      question: q.question,
      options: q.options,
      formatted_options: q.formatted_options,
      type: q.type,
      branching: q.branching,
      skipper_logic: q.skipper_logic || "FALSE",
    };
    // If it's a rating question, add rating-specific fields
    if (q.type === "RATING") {
      return {
        ...baseQuestion,
        rating_type: q.rating_type || "numeric", // Default to numeric
        rating_scale: q.rating_scale || { max: 5, min: 1, step: 1, default: 3 }, // Default scale
        rating_labels: q.rating_labels || {
          1: "Poor",
          2: "Fair",
          3: "Good",
          4: "Very Good",
          5: "Excellent",
        },
      };
    }
    return baseQuestion;
  });

  // Final formatted data
  const formattedData = {
    outline: {
      title: titleData.survey.title || "Untitled Survey",
      outline_id: outlineId,
      status: "Published",
      questions: formattedQuestions,
    },
  };

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/saveoutline`,
      formattedData,
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );
    return response;
  } catch (err: any) {
    console.error("Error saving outline:", err);
    throw err;
  }
}

// Function for the signin process.
function generateUniqueId() {
  // Generate a random number between 0 and 999999
  const randomNumber = Math.floor(Math.random() * 1000000);

  // Convert to string and pad with leading zeros if necessary
  return randomNumber.toString().padStart(6, "0");
}

async function publishOutline(uploadData: any, titleData: any) {
  const access_token = localStorage.getItem("access_token");

  if (!uploadData || !uploadData.outline) {
    console.error("Invalid uploadData:", uploadData);
    throw new Error("Invalid upload data structure");
  }
  const currentUrl = new URL(window.location.href);
  const outlineId = currentUrl.pathname.split("/").pop();
  const formattedQuestions = uploadData.outline.questions.map((q: any) => {
    const baseQuestion = {
      question_number: String(q.question_number), // Ensure string
      importance: q.importance || "normal",
      required: q.required === true ? "TRUE" : "FALSE",
      instruction: q.instruction,
      dynamic_followup: q.dynamic_followup === true ? "TRUE" : "FALSE",
      objective: q.objective,
      max_no_of_questions: q.max_no_of_questions
        ? String(q.max_no_of_questions)
        : null,
      keywords_to_probe: q.keywords_to_probe,
      things_to_avoid: q.things_to_avoid,
      example_questions: q.example_questions,
      allow_others: q.allow_others === true ? "TRUE" : "FALSE",
      max_no_of_choices: q.max_no_of_choices
        ? Number(q.max_no_of_choices)
        : null, // Send as number
      question: q.question,
      options: q.options,
      formatted_options: q.formatted_options,
      type: q.type,
      branching: q.branching,
      skipper_logic: q.skipper_logic || "FALSE",
  };
  
  // If it's a rating question, include rating fields
  if (q.type === "RATING") {
    return {
      ...baseQuestion,
      rating_type: q.rating_type || "numeric", // Default to numeric
      rating_scale: q.rating_scale || {
        max: 5,
        min: 1,
        step: 1,
        default: 3,
      }, // Default scale as object
      rating_labels: q.rating_labels || {
        1: "Very Unlikely",
        2: "Unlikely",
        3: "Neutral",
        4: "Likely",
        5: "Very Likely",
      }, // Default labels as object
    };
  }

  return baseQuestion;
});


const formattedData = {
  outline_id: outlineId,
  title: titleData.survey.title || "Untitled Survey",
  questions: formattedQuestions,
  introduction: uploadData.outline.introduction,
};

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/publishsurvey`,
      formattedData,
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );

    return response;
  } catch (err: any) {
    console.error("Error in publishOutline:", err);
    if (err.response) {
      console.error("Error response data:", err.response.data);
      console.error("Error response status:", err.response.status);
    }
    throw err;
  }
}

function formatOptions(options: any): { [key: number]: string } {
  if (!options) {
    return {};
  }

  let optionsArray: string[];

  if (Array.isArray(options)) {
    optionsArray = options;
  } else if (typeof options === "string") {
    try {
      // First, try to parse as JSON
      optionsArray = JSON.parse(options);
    } catch {
      // If JSON parsing fails, try splitting by comma and newline
      optionsArray = options
        .split(/[,\n]/)
        .map((opt) => opt.trim())
        .filter(Boolean);
    }
  } else if (typeof options === "object" && options !== null) {
    // If it's already an object, return it as is
    return options as { [key: number]: string };
  } else {
    return {};
  }

  // Convert the array to an object with letter keys
  const letterKeys = "abcdefghijklmnopqrstuvwxyz";
  return optionsArray.reduce<{ [key: number]: string }>((acc, opt, index) => {
    if (index < letterKeys.length) {
      acc[index + 1] = `${letterKeys[index]}. ${opt}`;
    } else {
      acc[index + 1] = opt;
    }
    return acc;
  }, {});
}

export { saveOutline, publishOutline, GetResponses };
