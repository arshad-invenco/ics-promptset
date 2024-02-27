import { configureStore } from "@reduxjs/toolkit";
import { promptsetSlice } from "./reducers/promptsetSlice";
import { daypartSlice } from "./reducers/daypartSlice";

const store = configureStore({
  reducer: {
    promptset: promptsetSlice.reducer,
    daypart: daypartSlice.reducer,
  },
});

export type PromptRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
