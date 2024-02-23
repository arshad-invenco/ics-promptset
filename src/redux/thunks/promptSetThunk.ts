import {createAsyncThunk} from "@reduxjs/toolkit";
import {PromptSetInterface} from "../../services/promptset.interface";


export const fetchPromptSet = createAsyncThunk<PromptSetInterface>(
    "[prompt set]/fetchPromptSet",
    async () => {
        const response = await fetch('http://localhost:3001/promptSetData');
        const data = await response.json();
        return data as PromptSetInterface;
    }
)