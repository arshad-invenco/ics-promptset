import React from "react";
import "./promptSet.scss";
import PromptTree from "../../components/PromptBuilder/Tree/promptTree";
import { promptSetContext } from "../../hooks/promptsetContext";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchPromptSet } from "../../redux/thunks/promptSetThunk";
import { PromptSetInterface } from "../../models/promptset.modal";
import { PromptSetEditor } from "../PromptEditor/promptSetEditor";
import { fetchDayPart } from "../../redux/thunks/daypartThunk";
import { fetchKeyCodes } from "../../redux/thunks/keycodeThunk";
import { fetchFonts } from "../../redux/thunks/fontThunk";
import { fetchTouchMasks } from "../../redux/thunks/touchMaskThunk";
import { LastModifiedInterface } from "../../models/lastModified.modal";
import ToastComponent from "../../components/common/toast/toast";
import { useParams } from "react-router-dom";
import { usePromptSetId } from "../../hooks/promptsetId";
import Loader from "../../components/common/loader/loader";

export function PromptSet() {
  // STATES -> CONTEXT_API
  const [promptSetData, setPromptSetData] = useState<PromptSetInterface>(
    {} as PromptSetInterface
  );
  const [activeStateId, setActiveStateId] = useState<string>("");
  const [activeControlType, setActiveControlType] = useState<string>("");
  const [activePromptEditorId, setActivePromptEditorId] = useState<string>("");
  const [activeElementId, setActiveElementId] = useState<string>("");
  const [gridViewState, setGridViewState] = useState<boolean>(false);
  const [showPlaylistState, setShowPlaylistState] = useState<boolean>(false);
  const [lastModified, setLastModified] = useState<LastModifiedInterface>(
    {} as LastModifiedInterface
  );

  // PARAMS
  const { id } = useParams<{ id: string }>();

  // HOOKs
  const promptsetId = usePromptSetId();

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
    gridViewState,
    setGridViewState,
    showPlaylistState,
    setShowPlaylistState,
    lastModified,
    setLastModified,
  };

  // DISPATCH
  const dispatch = useDispatch<AppDispatch>();

  // EFFECTS
  useEffect(() => {
    if (id) {
      dispatch(fetchPromptSet(id));
    }
    dispatch(fetchDayPart());
    dispatch(fetchKeyCodes());
    dispatch(fetchFonts());
    dispatch(fetchTouchMasks());
  }, []);

  const loading = () => {
    return <Loader global={true} />;
  };

  return (
    <div className={"layout"}>
      {promptsetId ? (
        <promptSetContext.Provider value={contextValues}>
          <ToastComponent />
          <PromptTree />
          <PromptSetEditor />
        </promptSetContext.Provider>
      ) : (
        loading()
      )}
    </div>
  );
}
