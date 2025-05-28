import { createSlice } from "@reduxjs/toolkit";

export const conversationSlice = createSlice({
  name: "Conversation slice",
  initialState: {
    conversation_type: "text",
    currentQuestion: {
      survey_code: "",
      current_question: {
        answer_type: "text",
        max_no_of_choices: 0,
        question_number: 0,
        total_time: "",
        question: "",
        completion: "",
        type: "",
        options: [""],
        answer: "",
        responder_id: "",
        rating_type: "", 
        rating_scale: { max: 5, min: 1, step: 1, default: 3 }, 
        rating_labels: {},
      },
    },
  },
  reducers: {
    toogleConversationType: (state, action) => {
      const { userPreference } = action.payload;

      state.conversation_type = userPreference;
      // console.log(JSON.parse(JSON.stringify(state.conversation_type)))
    },

    setSurveyCode: (state, action) => {
      const { survey_code } = action.payload;
      state.currentQuestion.survey_code = survey_code;
    },

    startTheConversation: (state, action) => {
      const { current_question } = action.payload;
      state.currentQuestion.current_question = current_question;
    },

    prevConversation: (state, action) => {
      const { answer, current_question } = action.payload;
      state.currentQuestion = {
        ...state.currentQuestion,
        current_question: {
          ...current_question,
          answer,
        },
      };
    },
  },
});

export const { toogleConversationType, setSurveyCode, startTheConversation, prevConversation } = conversationSlice.actions;

export default conversationSlice.reducer;
