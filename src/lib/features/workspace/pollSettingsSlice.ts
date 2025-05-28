import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PollData {
  survey: {
    title: string;
    education: string;
    endafterdate: string;
    endafter: string;
    geography: string;
    goal: string;
    industry: string;
    instruction: string;
    introduction: string;
    visibility: string;
  };
}

interface PollState {
  pollData: PollData;
}

const initialState: PollState = {
  pollData: {
    survey: {
      title: "",
      education: "",
      endafterdate: "",
      endafter: "",
      geography: "",
      goal: "",
      industry: "",
      instruction: "",
      introduction: "",
      visibility: "Public",
    },
  },
};

type SetBasicDataPayload = {
  survey: PollData["survey"];
};

export const pollSettingsSlice = createSlice({
  name: "Poll settings",
  initialState,
  reducers: {
    setBasicData: (state, action: PayloadAction<SetBasicDataPayload>) => {
      const { survey } = action.payload;
      state.pollData.survey = survey;
    },
    changeBasicData: (
      state,
      action: PayloadAction<{ name: keyof PollData["survey"]; value: string }>
    ) => {
      const { name, value } = action.payload;

      state.pollData.survey = {
        ...state.pollData.survey,

        ...state.pollData.survey,
        [name]: value,
      };
    },
  },
});

export const { setBasicData, changeBasicData } = pollSettingsSlice.actions;

export default pollSettingsSlice.reducer;
