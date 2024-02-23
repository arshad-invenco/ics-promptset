import {createContext} from "react";
import {PromptSetInterface} from "../services/promptset.interface";

interface PromptSetContextInterface {
    promptSetData: PromptSetInterface;
    setPromptSetData: React.Dispatch<React.SetStateAction<PromptSetInterface>>;
    activeStateId: string;
    setActiveStateId: React.Dispatch<React.SetStateAction<string>>;
}

const initialContextValue = {
    promptSetData: {} as PromptSetInterface,
    setPromptSetData: () => {},
    activeStateId: '',
    setActiveStateId: () => {}
}

export const promptSetContext = createContext<PromptSetContextInterface>(initialContextValue);