import "./promptSet.scss";
import PromptTree from "../../components/PromptBuilder/Tree/promptTree";
import { promptSetContext } from "../../hooks/promptsetContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchPromptSet } from "../../redux/thunks/promptSetThunk";
import { PromptSetInterface } from "../../models/promptset.modal";
import { PromptSetEditor } from "../PromptEditor/promptSetEditor";
import { fetchDayPart } from "../../redux/thunks/daypartThunk";
import { fetchKeyCodes } from "../../redux/thunks/keycodeThunk";
import { fetchFonts } from "../../redux/thunks/fontThunk";

export function PromptSet() {
  // STATES -> CONTEXT_API
  const [promptSetData, setPromptSetData] = useState<PromptSetInterface>(
    {} as PromptSetInterface
  );
  const [activeStateId, setActiveStateId] = useState<string>("");
  const [activeControlType, setActiveControlType] = useState<string>("");
  const [activePromptEditorId, setActivePromptEditorId] = useState<string>("");
  const [activeElementId, setActiveElementId] = useState<string>("");

  // CONTEXT_API
  const contextValues = {
    promptSetData,
    setPromptSetData,
    activeStateId,
    setActiveStateId,
    activeControlType,
    setActiveControlType,
    activePromptEditorId,
    setActivePromptEditorId,
    activeElementId,
    setActiveElementId,
  };

  // DISPATCH
  const dispatch = useDispatch<AppDispatch>();

  // EFFECTS
  useEffect(() => {
    dispatch(fetchPromptSet());
    dispatch(fetchDayPart());
    dispatch(fetchKeyCodes());
    dispatch(fetchFonts());
  }, []);

  return (
    <div className="layout">
      <promptSetContext.Provider value={contextValues}>
        <PromptTree />
        <PromptSetEditor />
      </promptSetContext.Provider>
    </div>
  );
}
