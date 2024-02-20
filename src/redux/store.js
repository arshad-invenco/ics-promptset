import {configureStore} from "@reduxjs/toolkit";
import {promptsetSlice} from "./reducers/promptsetSlice";

export const store = configureStore({
    reducer: {
        promptset: promptsetSlice.reducer,
    },
});