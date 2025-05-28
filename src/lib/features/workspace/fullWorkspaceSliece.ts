import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

interface FullWorkspaceState {
  fullForm: {
    workspace: string;
    title: string;
    goal: string;
    document: string;
    endafterdate: string;
    endafterresponses: string;
    education: string;
    geography: string[];
    industry: string;
    visibility: string;
  };
}

const initialState: FullWorkspaceState = {
  fullForm: {
    workspace: "My workspace",
    title: "",
    goal: "Choose a goal",
    document: "",
    endafterdate: dayjs().format("YYYY-MM-DD"),
    endafterresponses: "",
    education: "Choose the education level",
    geography: [],
    industry: "Choose your industry",
    visibility: "Public",
  },
};

export const fullWorkspaceSlice = createSlice({
  name: "Full workspace",
  initialState,
  reducers: {
    updateWorkspace: (state, action) => {
      state.fullForm.workspace = action.payload; 
    },
    changeFullFormData: (state, action) => {
      const { name, value } = action.payload;
      state.fullForm = {
        ...state.fullForm,
        [name]: value,
      };
      // console.log("The data is first time:", JSON.parse(JSON.stringify(state.fullForm)));
    },

    resetFullFormData: (state) => {
      state.fullForm = initialState.fullForm;
      // console.log("The data is first time:", JSON.parse(JSON.stringify(state.fullForm)));
    },

    addGeography: (state, action) => {
      const { geography } = action.payload;
      state.fullForm.geography = [...state.fullForm.geography, geography];
    },
  },
});

export const { changeFullFormData, resetFullFormData, addGeography, updateWorkspace } =
  fullWorkspaceSlice.actions;
export default fullWorkspaceSlice.reducer;
