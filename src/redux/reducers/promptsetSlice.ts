import {createSlice} from "@reduxjs/toolkit";
import {fetchPromptSet} from "../thunks/promptSetThunk";
import {PromptSetInterface} from "../../models/promptset.modal";

export interface PromptSetState {
    data: PromptSetInterface;
    isLoading: boolean;
    error: boolean;
}

const initialState: PromptSetState = {
    data: {} as PromptSetInterface, isLoading: true, error: false,
};

export const promptsetSlice = createSlice({
    name: "promptSet", initialState, reducers: {
        setPromptSetData: (state, action) => {
            state.data = action.payload;
            state.isLoading = false;
            state.error = false;
        }, updateInputElement: (state, action) => {
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    assignment.elements = assignment.elements.map((element) => {
                        if (element.id === action.payload.id) {
                            state.isStateChanged = true;
                            return action.payload;
                        }
                        return element;
                    });
                    return assignment;
                });
                return state;
            });
        }, updateTouchMap: (state, action) => {
            const {area, activePromptEditorId} = action.payload;
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    if (assignment.touchmap && assignment.id === activePromptEditorId) {
                        assignment.touchmap.isTouchMaskChanged = true;
                        assignment.touchmap.areas = assignment.touchmap?.areas?.map((touchMapArea) => {
                            if (touchMapArea.id === area.id) {
                                assignment.isAssignmentChanged = true;
                                return area;
                            }
                            return touchMapArea;
                        });
                        state.isStateChanged = true;
                    }
                    return assignment;
                });
                return state;
            });
        }, addElementToAssignment: (state, action) => {
            const {assignmentId, newElement} = action.payload;
            state.data = {
                ...state.data, states: state.data.states = state.data.states.map((state) => {
                    state.assignments = state.assignments.map((assignment) => {
                        if (assignment.id === assignmentId) {
                            assignment.elements.push(newElement);
                            state.isStateChanged = true;
                        }
                        return assignment;
                    });
                    return state;
                })
            }
        }, deleteChildStateDayPartById: (state, action) => {
            // THIS THING HAPPENS THROUGH API CALL ITSELF, JUST PLACED IN CASE OF ANY NEED
            const {assignmentId, childStateId} = action.payload;
            state.data.states = state.data.states.map((state) => {
                if (state.id === assignmentId) {
                    state.assignments = state.assignments.filter((assignment) => {
                        return assignment.id !== childStateId;
                    });
                }
                return state;
            });
        }, deleteElementByID: (state, action) => {
            const elementId = action.payload;
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    const initialLength = assignment.elements.length;
                    assignment.elements = assignment.elements.filter((element) => {
                        return element.id !== elementId;
                    });
                    if (initialLength > assignment.elements.length) {
                        state.isStateChanged = true;
                    }
                    return assignment;
                });
                return state;
            });
        }, deleteTouchMapOrAreaById: (state, action) => {
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    assignment.elements = assignment.elements.filter((element) => {
                        return element.id !== action.payload;
                    });

                    if (assignment.touchmap && assignment.touchmap.id === action.payload) {
                        state.isStateChanged = true;
                        assignment.isAssignmentChanged = true;
                        assignment.touchmap = null;
                    } else if (assignment.touchmap) {
                        assignment.touchmap.areas = assignment.touchmap?.areas?.filter((area) => {
                            assignment.isAssignmentChanged = true;
                            return area.id !== action.payload;
                        });
                        state.isStateChanged = true;
                        assignment.touchmap.isTouchMaskChanged = true;
                    }

                    return assignment;
                });
                return state;
            });
        }, addNewTouchMap: (state, action) => {
            const {assignmentId, newTouchMap} = action.payload;
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    if (assignment.id === assignmentId) {
                        assignment.touchmap = newTouchMap;
                        state.isStateChanged = true;
                    }
                    return assignment;
                });
                return state;
            });
        }, addNewAreaToTouchMap: (state, action) => {
            const {assignmentId, newArea} = action.payload;
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    if (assignment.id === assignmentId && assignment.touchmap) {
                        if (assignment.touchmap.areas) {
                            console.log(newArea, "ADDDIIINNNNGGGGG")
                            assignment.touchmap.areas.push(newArea);
                        } else {
                            assignment.touchmap.areas = [newArea];
                        }
                        state.isStateChanged = true;
                    }
                    return assignment;
                });
                return state;
            });
        },
        updateTouchMapArea: (state, action) => {
            const {assignmentId, newArea} = action.payload;
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    if (assignment.id === assignmentId && assignment.touchmap) {
                        assignment.touchmap.areas = assignment.touchmap.areas?.map((area) => {
                            if (area.id === newArea.id) {
                                return newArea;
                            }
                            return area;
                        });
                        state.isStateChanged = true;
                    }
                    return assignment;
                });
                return state;
            });
        },
        updateBackgroundElement: (state, action) => {
            const {assignmentId, newElement} = action.payload;
            state.data.states = state.data.states.map((state) => {
                state.assignments = state.assignments.map((assignment) => {
                    if (assignment.id === assignmentId) {
                        const bgElement = assignment.elements.find((element) => element.type === "bg");
                        if (bgElement) {
                            bgElement.value = newElement.value;
                            bgElement.filename = newElement.filename;
                            bgElement.name = newElement.name;
                            state.isStateChanged = true;
                        }
                    }
                    return assignment;
                });
                return state;
            });

        }
    }, extraReducers: (builder) => {
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

export const {
    setPromptSetData,
    updateInputElement,
    updateTouchMap,
    addElementToAssignment,
    deleteElementByID,
    deleteTouchMapOrAreaById,
    addNewTouchMap,
    addNewAreaToTouchMap,
    deleteChildStateDayPartById,
    updateTouchMapArea,
    updateBackgroundElement
} = promptsetSlice.actions;