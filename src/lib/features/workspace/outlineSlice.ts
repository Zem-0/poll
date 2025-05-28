import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { saveOutline } from "@/app/api/Outline/Outline";

export const outlineSlice = createSlice({
  name: "Outline states",
  initialState: {
    survey_published: false,
    survey_link: "sample surcey",
    unique_link: "survey unique code",
    workspackeBlur: false,
  },
  reducers: {
    saveOutlineChanges: (state, action: PayloadAction<{ workspace: any; titleData: any }>) => {
      const { workspace, titleData } = action.payload; // Unpacking workspace and titleData
      // Ensure both arguments are passed to saveOutline
      saveOutline(workspace, titleData);
    },
    publishChanges: (state, action) => {
      state.survey_published = true;
      const { survey_link, unique_link } = action.payload;
      state.survey_link = survey_link;
      state.unique_link = unique_link;
    },
    closeSurveyPublished: (state) => {
      state.survey_published = false;
    },
    setSurveyValues: (state, action) => {
      const { survey_link, unique_link } = action.payload;
      state.survey_link = survey_link;
      state.unique_link = unique_link;
    },

    backgroundBlur: (state, action) => {
      const { open } = action.payload;
      state.workspackeBlur = open;
    },
  },
});

export const {
  saveOutlineChanges,
  publishChanges,
  setSurveyValues,
  closeSurveyPublished,
  backgroundBlur,
} = outlineSlice.actions;

export default outlineSlice.reducer;
