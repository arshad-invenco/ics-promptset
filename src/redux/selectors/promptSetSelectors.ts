import {createSelector} from "@reduxjs/toolkit";
import {PromptSetRootState} from "../../components/PromptBuilder/Tree/promptTree";
import {State} from "../../services/promptset.interface";

export const selectPromptSetStateById = createSelector(
    (state : PromptSetRootState) => state.promptset.data.states,
    (_:State[], id:string) => id,
    (data:State[], id:string) => data ? data.find((item: { id: string; }) => item.id === id) : null
);

export const selectPromptSetAssignmentById = createSelector(
    (state : PromptSetRootState) => state.promptset.data.states,
    (_:State[], id:string) => id,
    (data:State[], id:string) => data ? data.some((item: { assignments: any; }) => item.assignments.find((item: { id: string; }) => item.id === id)) : null
);