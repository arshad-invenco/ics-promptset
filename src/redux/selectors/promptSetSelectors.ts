import { createSelector } from "@reduxjs/toolkit";
import { PromptSetRootState } from "../../components/PromptBuilder/Tree/promptTree";
import { State } from "../../models/promptset.modal";

export const selectPromptSetStateById = createSelector(
  (state: PromptSetRootState) => state.promptset.data.states,
  (_: State[], id: string) => id,
  (data: State[], id: string) =>
    data ? data.find((item: { id: string }) => item.id === id) : null
);

export const selectPromptSetAssignmentById = createSelector(
  (state: PromptSetRootState) => state.promptset.data.states,
  (_: State[], id: string) => id,
  (states: State[], id: string) => {
    if (!Array.isArray(states)) {
      return null;
    }

    for (let state of states) {
      if (state.assignments) {
        const assignment = state.assignments.find(
          (assignment) => assignment.id === id
        );
        if (assignment) {
          return assignment;
        }
      }
    }
    return null;
  }
);
