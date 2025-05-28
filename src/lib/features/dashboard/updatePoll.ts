import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OutlineState {
  title: string;
  outline_id: string;
  education: string;
  endafterdate: string;
  geography: string;
  goal: string;
  industry: string;
  instruction: string;
  introduction: string;
  visibility: string;
  endafter: string;
  version: string;
  endafterresponses: string;
}

interface UpdatePollState {
  outline: OutlineState;
}

const initialState: UpdatePollState = {
  outline: {
    title: "",
    outline_id: "",
    education: "",
    endafterdate: "",
    endafterresponses: "",
    endafter: "",
    geography: "",
    goal: "",
    industry: "",
    instruction: "",
    introduction: "",
    visibility: "",
    version: "",
  },
};

export const updatePollSlice = createSlice({
  name: "Update the poll",
  initialState,

  reducers: {
    setInitialForm: (
      state,
      action: PayloadAction<{ updateValues: OutlineState }>
    ) => {
      const { updateValues } = action.payload;
      state.outline = updateValues;
    },
    changeFormData: (
      state,
      action: PayloadAction<{ name: keyof OutlineState; value: string }>
    ) => {
      const { name, value } = action.payload;
      state.outline[name] = value;
    },
  },
});

export const { setInitialForm, changeFormData } = updatePollSlice.actions;
export default updatePollSlice.reducer;
