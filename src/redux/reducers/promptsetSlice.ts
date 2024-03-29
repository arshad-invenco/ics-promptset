import { createSlice } from "@reduxjs/toolkit";
import { fetchPromptSet } from "../thunks/promptSetThunk";
import { PromptSetInterface } from "../../models/promptset.modal";

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
    updateStateById: (state, action) => {
      const { id, newTransactionState } = action.payload;
      state.data.states = state.data.states.map((state) => {
        if (state.id === id) {
          state.transactionState = newTransactionState;
          state.isStateChanged = true;
        }
        return state;
      });
    },
    updateInputElement: (state, action) => {
      const { assignmentId, newElement } = action.payload;
      state.data.states = state.data.states.map((state) => {
        state.assignments = state.assignments.map((assignment) => {
          if (assignment.id === assignmentId) {
            const elementIndex = assignment.elements.findIndex(
              (element) => element.id === newElement.id,
            );
            if (elementIndex !== -1) {
              assignment.elements[elementIndex] = newElement;
            } else {
              assignment.elements.push(newElement);
            }
            state.isStateChanged = true;
          }
          return assignment;
        });
        return state;
      });
    },
    updateTouchMap: (state, action) => {
      const { area, activePromptEditorId } = action.payload;
      state.data.states = state.data.states.map((state) => {
        state.assignments = state.assignments.map((assignment) => {
          if (assignment.touchmap && assignment.id === activePromptEditorId) {
            assignment.touchmap.isTouchMaskChanged = true;
            assignment.touchmap.areas = assignment.touchmap?.areas?.map(
              (touchMapArea) => {
                if (touchMapArea.id === area.id) {
                  assignment.isAssignmentChanged = true;
                  return area;
                }
                return touchMapArea;
              },
            );
            state.isStateChanged = true;
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
        states: (state.data.states = state.data.states.map((state) => {
          state.assignments = state.assignments.map((assignment) => {
            if (assignment.id === assignmentId) {
              assignment.elements.push(newElement);
              state.isStateChanged = true;
            }
            return assignment;
          });
          return state;
        })),
      };
    },
    deleteChildStateDayPartById: (state, action) => {
      // THIS THING HAPPENS THROUGH API CALL ITSELF, JUST PLACED IN CASE OF ANY NEED
      const { assignmentId, childStateId } = action.payload;
      state.data.states = state.data.states.map((state) => {
        if (state.id === assignmentId) {
          state.assignments = state.assignments.filter((assignment) => {
            return assignment.id !== childStateId;
          });
        }
        return state;
      });
    },
    deleteElementByID: (state, action) => {
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
    },
    deleteTouchMapOrAreaById: (state, action) => {
      state.data.states = state.data.states.map((state) => {
        state.assignments = state.assignments.map((assignment) => {
          assignment.elements = assignment.elements.filter((element) => {
            return element.id !== action.payload;
          });

          if (
            assignment.touchmap &&
            assignment.touchmap.id === action.payload
          ) {
            state.isStateChanged = true;
            assignment.isAssignmentChanged = true;
            assignment.touchmap = null;
          } else if (assignment.touchmap) {
            assignment.touchmap.areas = assignment.touchmap?.areas?.filter(
              (area) => {
                assignment.isAssignmentChanged = true;
                return area.id !== action.payload;
              },
            );
            state.isStateChanged = true;
            assignment.touchmap.isTouchMaskChanged = true;
          }

          return assignment;
        });
        return state;
      });
    },
    addNewTouchMap: (state, action) => {
      const { assignmentId, newTouchMap } = action.payload;
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
    },
    addNewAreaToTouchMap: (state, action) => {
      const { assignmentId, newArea } = action.payload;
      state.data.states = state.data.states.map((state) => {
        state.assignments = state.assignments.map((assignment) => {
          if (assignment.id === assignmentId && assignment.touchmap) {
            if (assignment.touchmap.areas) {
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
      const { assignmentId, newArea } = action.payload;
      state.data.states = state.data.states.map((state) => {
        state.assignments = state.assignments.map((assignment) => {
          if (assignment.id === assignmentId && assignment.touchmap) {
            assignment.touchmap.areas = assignment.touchmap.areas?.map(
              (area) => {
                if (area.id === newArea.id) {
                  return newArea;
                }
                return area;
              },
            );
            assignment.touchmap.isTouchMaskChanged = true;
            assignment.isAssignmentChanged = true;
          }
          return assignment;
        });
        return state;
      });
    },
    updateBackgroundElement: (state, action) => {
      const { assignmentId, newElement } = action.payload;
      state.data.states = state.data.states.map((state) => {
        state.assignments = state.assignments.map((assignment) => {
          if (assignment.id === assignmentId) {
            const bgElement = assignment.elements.find(
              (element) => element.type === "bg",
            );
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
    },
    removeIsStateChangedById: (state, action) => {
      state.data.states = state.data.states.map((state) => {
        if (state.id === action.payload) {
          state.isStateChanged = false;
        }
        return state;
      });
    },
    removeIsTouchMaskChangedById: (state, action) => {
      const assignmentId = action.payload;
      state.data.states = state.data.states.map((state) => {
        state.assignments = state.assignments.map((assignment) => {
          if (assignment.id === assignmentId && assignment.touchmap) {
            assignment.touchmap.isTouchMaskChanged = false;
            assignment.isAssignmentChanged = false;
          }
          return assignment;
        });
        return state;
      });
    },
    updateSoftKeyByAssignmentId: (state, action) => {
      const { assignmentId, newSoftKey } = action.payload;

      state.data.states = state.data.states.map((state) => {
        state.assignments = state.assignments.map((assignment) => {
          if (assignment.id === assignmentId) {
            const softKeyIndex = assignment.softkeys.findIndex(
              (softKey) => softKey.softkey === newSoftKey.softkey,
            );
            if (softKeyIndex !== -1 && newSoftKey.label) {
              assignment.softkeys[softKeyIndex] = {
                ...assignment.softkeys[softKeyIndex],
                ...newSoftKey,
              };
              state.isStateChanged = true;
            } else if (softKeyIndex !== -1 && !newSoftKey.label) {
              assignment.softkeys = assignment.softkeys.filter(
                (softKey) => softKey.softkey !== newSoftKey.softkey,
              );
              state.isStateChanged = true;
            } else if (newSoftKey.label) {
              assignment.softkeys.push(newSoftKey);
              state.isStateChanged = true;
            }
          }
          return assignment;
        });
        return state;
      });
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

export const {
  setPromptSetData,
  updateStateById,
  updateInputElement,
  updateTouchMap,
  addElementToAssignment,
  deleteElementByID,
  deleteTouchMapOrAreaById,
  addNewTouchMap,
  addNewAreaToTouchMap,
  deleteChildStateDayPartById,
  updateTouchMapArea,
  updateBackgroundElement,
  removeIsStateChangedById,
  removeIsTouchMaskChangedById,
  updateSoftKeyByAssignmentId,
} = promptsetSlice.actions;