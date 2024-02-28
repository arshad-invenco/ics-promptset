import { configureStore } from "@reduxjs/toolkit";
import { promptsetSlice } from "./reducers/promptsetSlice";
import { daypartSlice } from "./reducers/daypartSlice";
import { keycodeSlice } from "./reducers/keycodeSlice";
import { softkeySlice } from "./reducers/softkeySlice";

const store = configureStore({
  reducer: {
    promptset: promptsetSlice.reducer,
    daypart: daypartSlice.reducer,
    keycode: keycodeSlice.reducer,
    softkey: softkeySlice.reducer,
  },
});

export type PromptRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
