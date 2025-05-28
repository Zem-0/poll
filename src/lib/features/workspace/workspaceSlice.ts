import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RatingScale {
  max: number;
  min: number;
  step: number;
  default: number;
}

interface Question {
  question_number: string;
  rating_type?: string;
  rating_scale?: RatingScale; 
  [key: string]: string | boolean | any;
}

interface FormData {
  outline: {
    title: string;
    numberofquestions: number;
    outline_id: string;
    status: string;
    time: string;
    questions: Question[];
  };
}

interface CounterState {
  formData: FormData;
}

const initialState: CounterState = {
  formData: {
    outline: {
      numberofquestions: 0,
      title: "",
      time: "",
      outline_id: "",
      status: "created",
      questions: [],
    },
  },
};

export const counterSlice = createSlice({
  name: "workspace sidebar",
  initialState,
  reducers: {
    handleBasicData: (
      state,
      action: PayloadAction<{
        outline: {
          title: string;
          numberofquestions: number;
          outline_id: string;
          time: string;
          status: string;
          questions: Question[];
        };
      }>
    ) => {
      const { outline } = action.payload;
      state.formData.outline = outline;
    },

    handleChangeTitle: (state, action) => {
      // Destructure the title from the action payload
      const { title } = action.payload;
      // Update the title property of state.formData.outline with the new title
      state.formData.outline.title = title;
    },

    handleChangeSettings: (
      state,
      action: PayloadAction<{
        name: string;
        value: string;
        question_id: string;
      }>
    ) => {
      const { name, value, question_id } = action.payload;
      const existingQuestionIndex = state.formData.outline.questions.findIndex(
        (question) => question.question_number === question_id
      );
      if (existingQuestionIndex !== -1) {
        state.formData.outline.questions[existingQuestionIndex] = {
          ...state.formData.outline.questions[existingQuestionIndex],
          [name]: value,
        };
      } else {
        state.formData.outline.questions.push({
          question_number: question_id,
          [name]: value,
        });
      }
    },

    increment: (state) => {
      // console.log("The data is:", JSON.stringify(state.formData.outline));
    },
    handleToggle: (state, action: PayloadAction<{ question_id: string }>) => {
      const { question_id } = action.payload;
      const questionToToggle = state.formData.outline.questions.find(
        (question) => question.question_number === question_id
      );
      if (questionToToggle) {
        questionToToggle.required = !questionToToggle.required;
      } else {
        state.formData.outline.questions.push({
          question_number: question_id,
          required: true,
        });
      }
    },

    handleOthersResponseToggle: (
      state,
      action: PayloadAction<{ question_id: string }>
    ) => {
      const { question_id } = action.payload;

      const questionToToggle = state.formData.outline.questions.find(
        (question) => question.question_number === question_id
      );

      if (questionToToggle) {
        questionToToggle.allow_others = !questionToToggle.allow_others;
      } else {
        state.formData.outline.questions.push({
          question_number: question_id,
          allow_others: true,
        });
      }
    },
    handleRatingSettingsChange: (
      state,
      action: PayloadAction<{
        question_id: string;
        value: Partial<RatingScale>; // Allow updating specific properties
      }>
    ) => {
      const { question_id, value } = action.payload;
      const question = state.formData.outline.questions.find(
        (q) => q.question_number === question_id
      );

      if (question) {
        if (!question.rating_scale) {
          question.rating_scale = { max: 5, min: 1, step: 1, default: 3 };
        }
        
        question.rating_scale = {
          ...question.rating_scale, // Preserve existing structure
          ...value, // Update only necessary parts
        };
      }
    },
    // Update the handleQuestionOptions reducer in your counterSlice
    handleQuestionOptions: (
      state,
      action: PayloadAction<{
        questions: Array<{
          question_id: string;
          options: string;
          question_number: string;
        }>;
      }>
    ) => {
      const { questions } = action.payload;

      questions.forEach(({ question_id, options }) => {
        const questionIndex = state.formData.outline.questions.findIndex(
          (question) => question.question_number === String(question_id)
        );

        if (questionIndex !== -1) {
          const currentQuestion =
            state.formData.outline.questions[questionIndex];
          try {
            // Parse options but preserve empty strings
            const parsedOptions = JSON.parse(options);

            // Store raw options as-is, including empty strings
            currentQuestion.options = JSON.stringify(parsedOptions);

            // Create formatted options, preserving empty strings
            const formattedOptions = parsedOptions
              .map((option: string, index: number) => {
                const letterPrefix = String.fromCharCode(97 + index);
                // Preserve whitespace in option text
                return `${letterPrefix}. ${option}`;
              })
              .join("\n");

            currentQuestion.formatted_options = formattedOptions;
          } catch (error) {
            console.error("Error parsing options:", error);
            currentQuestion.options = options;
            currentQuestion.formatted_options = options;
          }
        }
      });
    },
    handleQuestionChange: (
      state,
      action: PayloadAction<{ question_id: string; question: string }>
    ) => {
      const { question_id, question } = action.payload;
      const questionToToggle = state.formData.outline.questions.find(
        (question) => question.question_number === question_id
      );
      if (questionToToggle) {
        questionToToggle.question = question;
      }
    },

    handleDynamicToggle: (
      state,
      action: PayloadAction<{ question_id: string }>
    ) => {
      const { question_id } = action.payload;
      const questionToToggle = state.formData.outline.questions.find(
        (question) => question.question_number === question_id
      );
      if (questionToToggle) {
        questionToToggle.dynamic_followup = questionToToggle.dynamic_followup === "TRUE" ? "FALSE" : "TRUE";
      } else {
        state.formData.outline.questions.push({
          question_number: question_id,
          dynamic_followup: "FALSE",
        });
      }
    },

    handleReorderQuestions: (
      state,
      action: PayloadAction<{ questions: Question[] }>
    ) => {
      const { questions } = action.payload;
      // Reassign new question numbers to reflect the order after reordering
      state.formData.outline.questions = questions.map((question, index) => ({
        ...question,
        question_number: (index + 1).toString(), // Update question_number sequentially
      }));

      // console.log("The updated questions data is:", JSON.stringify(state.formData.outline.questions));
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  handleChangeSettings,
  handleOthersResponseToggle,
  handleToggle,
  handleDynamicToggle,
  handleBasicData,
  handleChangeTitle,
  handleQuestionOptions,
  handleQuestionChange,
  handleReorderQuestions,
  handleRatingSettingsChange,
} = counterSlice.actions;

export default counterSlice.reducer;
