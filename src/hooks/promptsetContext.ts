import {createContext} from "react";
import {PromptSetInterface} from "../services/promptset.interface";

interface PromptSetContextInterface {
    promptData: PromptSetInterface;
    setPromptData: React.Dispatch<React.SetStateAction<PromptSetInterface>>;
}

const initialContextValue = {
    promptData: {} as PromptSetInterface,
    setPromptData: () => {}
}

export const promptSetContext = createContext<PromptSetContextInterface>(initialContextValue);