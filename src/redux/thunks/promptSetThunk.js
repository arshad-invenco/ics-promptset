import {createAsyncThunk} from "@reduxjs/toolkit";


export const fetchPromptSet = createAsyncThunk(
    "[prompt set]/fetchPromptSet",
    async () => {
        const response = await fetch('http://localhost:3001/promptSetData');
        return response.json();
    }
)