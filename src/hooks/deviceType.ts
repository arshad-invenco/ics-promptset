import { useSelector } from "react-redux";
import { PromptSetInterface } from "../models/promptset.modal";
import { PromptSetRootState } from "../components/PromptBuilder/Tree/promptTree";

export function useGetDeviceType() {
  const promptsetData: PromptSetInterface = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );
  return promptsetData.deviceType;
}


