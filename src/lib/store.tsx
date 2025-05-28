import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import conversationSlice from "./features/conversation/conversationSlice";
import pollsSlice from "./features/dashboard/pollsSlice";
import workspaceCurrentNameSlice from "./features/dashboard/workspaceCurrentNameSlice";
import updatePoll from "./features/dashboard/updatePoll";
import fullWorkspaceSliece from "./features/workspace/fullWorkspaceSliece";
import outlineSlicer from "./features/workspace/outlineSlice";
import pollSettingsSlice from "./features/workspace/pollSettingsSlice";
import workSpaceHeaderSlice from "./features/workspace/workSpaceHeaderSlice";
import analyzeHeaderSlice  from "./features/workspace/analyzeHeaderSlice";
import workspaceReducer from "./features/workspace/workspaceSlice";
import workspaceOutlineSlice from "./features/workspaceOutlines/workspaceOutlineSlice";
import askPollySlice from "./features/askPolly/askPollySlice";
import analysisFilesSlice from "./features/analysisFiles/analysisFilesSlice";
import creditsSlice from "./features/credits/creditsSlice";

export default configureStore({
  reducer: {
    workspace: workspaceReducer,
    outline: outlineSlicer,
    workspaceHeader: workSpaceHeaderSlice,
    analyzeHeader: analyzeHeaderSlice,
    polls: pollsSlice,
    currentWorkspace: workspaceCurrentNameSlice,
    pollSettings: pollSettingsSlice,
    updatePoll: updatePoll,
    fullWorkspace: fullWorkspaceSliece,
    worksapceOutline: workspaceOutlineSlice,
    conversation: conversationSlice,
    askPolly: askPollySlice,
    analysisFiles : analysisFilesSlice,
    credits : creditsSlice
  },
});

const rootReducer = combineReducers({
  workspace: workspaceReducer,
  outline: outlineSlicer,
  workspaceHeader: workSpaceHeaderSlice,
  analyzeHeader: analyzeHeaderSlice,
  polls: pollsSlice,
  currentWorkspace: workspaceCurrentNameSlice,
  pollSettings: pollSettingsSlice,
  updatePoll: updatePoll,
  fullWorkspace: fullWorkspaceSliece,
  worksapceOutline: workspaceOutlineSlice,
  conversation: conversationSlice,
  askPolly: askPollySlice,
  analysisFiles : analysisFilesSlice,
  credits : creditsSlice
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;


// Export typed versions of hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export default store;