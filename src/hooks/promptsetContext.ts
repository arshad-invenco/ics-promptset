import { createContext } from "react";
import { PromptSetInterface } from "../models/promptset.modal";
import { LastModifiedInterface } from "../models/lastModified.modal";
import { Notification, ToastAction } from "../models/toast.modal";

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
  gridViewState: boolean;
  setGridViewState: React.Dispatch<React.SetStateAction<boolean>>;
  showPlaylistState: boolean;
  setShowPlaylistState: React.Dispatch<React.SetStateAction<boolean>>;
  lastModified: LastModifiedInterface;
  setLastModified: React.Dispatch<React.SetStateAction<LastModifiedInterface>>;
  toasts: Notification[];
  toastDispatch: React.Dispatch<ToastAction>;
}

const initialContextValue = {
  promptSetData: {} as PromptSetInterface,
  setPromptSetData: () => {},
  // which state is active
  activeStateId: "",
  setActiveStateId: () => {},
  // To See which type of control is active
  activeControlType: "",
  setActiveControlType: () => {},
  // Active Assignment To display in PromptEditor (Non Null, always have an Assignment Id)
  activePromptEditorId: "",
  setActivePromptEditorId: () => {},
  // Active Element Id
  activeElementId: "",
  setActiveElementId: () => {},
  gridViewState: false,
  setGridViewState: () => {},
  showPlaylistState: false,
  setShowPlaylistState: () => {},
  lastModified: {} as LastModifiedInterface,
  setLastModified: () => {},
  toasts: [],
  toastDispatch: (_action: ToastAction) => {},
};

export const promptSetContext =
  createContext<PromptSetContextInterface>(initialContextValue);
