import { createSlice } from "@reduxjs/toolkit";

export const pollsSlice = createSlice({
  name: "Polls slice",
  initialState: {
    showModal: false,
    showCreatePoll: false,
    showZapPoll: false,
    showAnalyze: false,
  },
  reducers: {
    createPolls: (state) => {
      state.showModal = !state.showModal;
    },
    showPollPublished: (state) => {
      state.showCreatePoll = !state.showCreatePoll;
    },
    createZapPolls: (state) => {
      state.showZapPoll = !state.showZapPoll;
    },
    createAnalyze: (state) => {
      state.showAnalyze = !state.showAnalyze;
    }
  },
});

export const { createPolls, showPollPublished, createZapPolls, createAnalyze } =
  pollsSlice.actions;

export default pollsSlice.reducer;
