import {PromptSetInterface} from "../models/promptset.modal";
import {useSelector} from "react-redux";
import {PromptSetRootState} from "../components/PromptBuilder/Tree/promptTree";

export function usePromptSetId() {
    const promptsetData: PromptSetInterface = useSelector(
        (state: PromptSetRootState) => state.promptset.data
    );
    return promptsetData.id;
}