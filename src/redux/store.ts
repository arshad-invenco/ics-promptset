import {configureStore} from "@reduxjs/toolkit";
import {promptsetSlice} from "./reducers/promptsetSlice"


const store = configureStore({
    reducer: {
        promptset: promptsetSlice.reducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export default store;