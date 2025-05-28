import { FileMetadata } from "@/app/api/ask polly/polly";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnalysisFilesState {
  files: FileMetadata[];
}

const initialState: AnalysisFilesState = {
  files: [],
};

const analysisFilesSlice = createSlice({
  name: "analysisFiles",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileMetadata[]>) => {
      state.files = action.payload;
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
    editFile: (
      state,
      action: PayloadAction<{ id: string; updatedData: Partial<FileMetadata> }>
    ) => {
      const { id, updatedData } = action.payload;
      const fileIndex = state.files.findIndex((file) => file.id === id);
      if (fileIndex !== -1) {
        state.files[fileIndex] = { ...state.files[fileIndex], ...updatedData };
      }
    },
    addFile: (state, action: PayloadAction<FileMetadata>) => {
      state.files.unshift(action.payload); // Add new file at the beginning
    },
  },
});

export const { setFiles, deleteFile, editFile, addFile } = analysisFilesSlice.actions;
export default analysisFilesSlice.reducer;
