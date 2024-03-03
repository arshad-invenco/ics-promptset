import { configureStore } from "@reduxjs/toolkit";
import { promptsetSlice } from "./reducers/promptsetSlice";
import { daypartSlice } from "./reducers/daypartSlice";
import { keycodeSlice } from "./reducers/keycodeSlice";
import { softkeySlice } from "./reducers/softkeySlice";
import { fontSlice } from "./reducers/fontSlice";
import { assetSlice } from "./reducers/mediaSlice";
import { touchMaskSlice } from "./reducers/touchMaskSlice";

const store = configureStore({
  reducer: {
    promptset: promptsetSlice.reducer,
    daypart: daypartSlice.reducer,
    keycode: keycodeSlice.reducer,
    softkey: softkeySlice.reducer,
    font: fontSlice.reducer,
    asset: assetSlice.reducer,
    touchmask: touchMaskSlice.reducer,
  },
});

export type PromptRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
