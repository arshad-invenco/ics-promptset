import {createSlice} from "@reduxjs/toolkit";
import {fetchPromptSet} from "../thunks/promptSetThunk";

const initialState = {
    data : {},
    isLoading : true,
    error: null
}

export const promptsetSlice = createSlice({
    name: 'promptSet',
    initialState,
    reducers: {
        setPromptSetData: (state, action) => {
            state.data.push(action.payload);
            state.isLoading = false;
            state.error = false;
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(fetchPromptSet.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.error = false;
        })
        builder.addCase(fetchPromptSet.pending, (state, action) => {
            state.isLoading = true;
            state.error = false;
        })
        builder.addCase(fetchPromptSet.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export const {setPromptSetData} = promptsetSlice.actions;
export default promptsetSlice.reducer;