import {createSlice} from "@reduxjs/toolkit";
import {fetchPromptSet} from "../thunks/promptSetThunk";
import {PromptSetInterface} from "../../models/promptset.modal";

export interface PromptSetState {
    data: PromptSetInterface;
    isLoading: boolean;
    error: boolean;
}

const initialState: PromptSetState = {
    data: {} as PromptSetInterface,
    isLoading: true,
    error: false,
};

export const promptsetSlice = createSlice({
    name: "promptSet",
    initialState,
    reducers: {
        setPromptSetData: (state, action) => {
            state.data = action.payload;
            state.isLoading = false;
            state.error = false;
        },
        updateInputElement: (state, action) => {
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    assignment.elements = assignment.elements.map((element) => {
                        if (element.id === action.payload.id) {
                            return action.payload;
                        }
                        return element;
                    });
                    return assignment;
                });
                return state;
            });
        },
        updateTouchMap: (state, action) => {
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    if (assignment.touchmap) {
                        assignment.touchmap.areas = assignment.touchmap.areas.map((area) => {
                            if (area.id === action.payload.id) {
                                return action.payload;
                            }
                            return area;
                        });
                    }
                    return assignment;
                });
                return state;
            });
        },
        addElementToAssignment: (state, action) => {
            const { assignmentId, newElement } = action.payload;
            state.data = {
                ...state.data,
                states : state.data.states = state.data.states.map((state) => {
                    state.assignments = state.assignments.map((assignment) => {
                        if (assignment.id === assignmentId) {
                            assignment.elements.push(newElement);
                        }
                        return assignment;
                    });
                    return state;
                })
            }
        },

    },
    extraReducers: (builder) => {
        builder.addCase(fetchPromptSet.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.error = false;
        });
        builder.addCase(fetchPromptSet.pending, (state, action) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(fetchPromptSet.rejected, (state, action) => {
            state.isLoading = false;
            state.error = true;
        });
    },
});

export const {setPromptSetData, updateInputElement, updateTouchMap, addElementToAssignment} = promptsetSlice.actions;