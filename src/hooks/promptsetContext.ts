import {createContext} from "react";
import {PromptSetInterface} from "../services/promptset.interface";

interface PromptSetContextInterface {
    promptSetData: PromptSetInterface;
    setPromptSetData: React.Dispatch<React.SetStateAction<PromptSetInterface>>;
    activeStateId: string;
    setActiveStateId: React.Dispatch<React.SetStateAction<string>>;
    activeControlType: string;
    setActiveControlType: React.Dispatch<React.SetStateAction<string>>;
    activePromptEditorId: string;
    setActivePromptEditorId: React.Dispatch<React.SetStateAction<string>>;
    activeElementId: string;
    setActiveElementId: React.Dispatch<React.SetStateAction<string>>;
}

const initialContextValue = {
    promptSetData: {} as PromptSetInterface,
    setPromptSetData: () => {},
    // which state is active
    activeStateId: '',
    setActiveStateId: () => {},
    // To See which type of control is active
    activeControlType: '',
    setActiveControlType: () => {},
    // Active Assignment To display in PromptEditor (Non Null, always have an Assignment Id)
    activePromptEditorId: '',
    setActivePromptEditorId: () => {},
    // Active Element Id
    activeElementId: '',
    setActiveElementId: () => {}
}

export const promptSetContext = createContext<PromptSetContextInterface>(initialContextValue);