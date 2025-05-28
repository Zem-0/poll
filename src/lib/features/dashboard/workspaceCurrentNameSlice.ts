import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WorkspaceState {
  currentWorkspace: string;
}

const initialState: WorkspaceState = {
  currentWorkspace: "My workspace", // Default value
};

const workspaceCurrentNameSlice = createSlice({
  name: "workspaceCurrentName",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.currentWorkspace = action.payload;
    },
  },
});

export const { setCurrentWorkspace } = workspaceCurrentNameSlice.actions;

export default workspaceCurrentNameSlice.reducer;
