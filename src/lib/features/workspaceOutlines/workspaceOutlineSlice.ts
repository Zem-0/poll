import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Poll {
  name: string;
  title: string;
  goal: string;
  visibility: string;
  endafterresponses: string;
  endafterdate: string;
  lengthtime: string;
  lengthquestions: string;
  completion: string;
  outline_id: string;
  status: string;
}

interface WorkspaceOperationState {
  outlines: Poll[];
}

const initialState: WorkspaceOperationState = {
  outlines: [
    {
      name: "",
      title: "",
      goal: "",
      visibility: "",
      endafterresponses: "",
      endafterdate: "",
      lengthtime: "",
      lengthquestions: "",
      completion: "",
      outline_id: "",
      status: "",
    },
  ],
};

export const workspaceOutlineSlice = createSlice({
  name: "workspaceOperation",
  initialState,
  reducers: {
    setWorkspaceOutline: (state, action) => {
      const { outlines } = action.payload;
      state.outlines = outlines;
    },
  },
});

export const { setWorkspaceOutline } = workspaceOutlineSlice.actions;

export default workspaceOutlineSlice.reducer;
