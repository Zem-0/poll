import { createSlice } from "@reduxjs/toolkit";

export const analyzeHeaderSlice = createSlice({
  name: "Analyze header",
  initialState: {
    header: "Ask Polly",
    workspaceName: ""
  },
  reducers: {
    toogleChanges: (state, action) => {
      const { name } = action.payload;
      state.header = name;
    },
  },
});

export const { toogleChanges } = analyzeHeaderSlice.actions;

export default analyzeHeaderSlice.reducer;