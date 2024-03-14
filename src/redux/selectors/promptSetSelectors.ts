import { createSelector } from "@reduxjs/toolkit";
import { PromptSetRootState } from "../../components/PromptBuilder/Tree/promptTree";
import {
  PromptSetInterface,
  State,
  TouchMapAreas,
} from "../../models/promptset.modal";

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

    for (const state of states) {
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

export const selectElementByIdInAssignment = createSelector(
  (state: PromptSetRootState) => state.promptset.data.states,
  (_: State[], assignmentId: string, elementId: string) => ({
    assignmentId,
    elementId,
  }),
  (states: State[], { assignmentId, elementId }) => {
    if (!Array.isArray(states)) {
      return null;
    }

    for (const state of states) {
      if (state.assignments) {
        const assignment = state.assignments.find(
          (assignment) => assignment.id === assignmentId
        );
        if (assignment && assignment.elements) {
          const element = assignment.elements.find(
            (element) => element.id === elementId
          );
          if (element) {
            return element;
          }
        }
      }
    }
    return null;
  }
);

export const selectAreaInTouchMap = createSelector(
  (state: PromptSetRootState) => state.promptset.data,
  (_: any, assignmentId: string, areaId: string) => ({ assignmentId, areaId }),
  (data: PromptSetInterface, { assignmentId, areaId }) => {
    if (!Array.isArray(data.states)) {
      return null;
    }

    for (const state of data.states) {
      for (const assignment of state.assignments) {
        if (
          assignment.id === assignmentId &&
          assignment.touchmap &&
          assignment.touchmap.areas
        ) {
          const area = assignment.touchmap.areas.find(
            (area: TouchMapAreas) => area.id === areaId
          );
          return area || null;
        }
      }
    }

    return null;
  }
);

export const selectPromptSetId = (state: PromptSetRootState) =>
  state.promptset.data.id;
