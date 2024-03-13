import "./controllers.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAreaInTouchMap,
  selectElementByIdInAssignment,
  selectPromptSetAssignmentById,
  selectPromptSetStateById,
} from "../../../redux/selectors/promptSetSelectors";
import { useContext, useEffect, useState } from "react";
import { promptSetContext } from "../../../hooks/promptsetContext";
import {
  AREA,
  BG,
  CHILD_STATE,
  ELEMENTS_LIST,
  EXCEPTION,
  IMAGE,
  INPUT,
  TEXT,
  VIDEO,
} from "../../../constants/promptSetConstants";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import "../../../style.scss";
import { formatTime } from "../../../hooks/common";
import { BackgroundControl } from "./background/prompt-bg-control";
import { ImageControl } from "./image/prompt-image-control";
import { VideoControl } from "./video/prompt-video-control";
import { AreaControl } from "./area/prompt-area-control";
import TextControl from "./text/prompt-text-control";
import {
  Elements,
  State,
  TouchMapAreas,
} from "../../../models/promptset.modal";
import { PromptSetRootState } from "../Tree/promptTree";
import { AppDispatch } from "../../../redux/store";
import { updateStateById } from "../../../redux/reducers/promptsetSlice";

export default function Controllers() {
  // Context API
  const {
    activeStateId,
    activeControlType,
    activePromptEditorId,
    activeElementId,
  } = useContext(promptSetContext);

  // STATES
  const [state, setState] = useState<State>({} as State);

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  // SELECTORS
  const STATE = useSelector((state: PromptSetRootState & State[]) =>
    selectPromptSetStateById(state, activeStateId)
  );
  const childState = useSelector((state: PromptSetRootState & State[]) =>
    selectPromptSetAssignmentById(state, activePromptEditorId)
  );
  const elementData: Elements =
    useSelector((state: PromptSetRootState & State[]) =>
      selectElementByIdInAssignment(
        state,
        activePromptEditorId,
        activeElementId
      )
    ) || ({} as Elements);
  const areaData =
    useSelector((state: PromptSetRootState & State[]) =>
      selectAreaInTouchMap(state, activePromptEditorId, activeElementId)
    ) || ({} as TouchMapAreas);

  function handleTransactionStateChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const selectedValue = event.target.value;
    if (selectedValue !== "null") {
      dispatch(
        updateStateById({
          id: activeStateId,
          newTransactionState: selectedValue,
        })
      );
    } else {
      dispatch(
        updateStateById({
          id: activeStateId,
          newTransactionState: null,
        })
      );
    }
  }

  useEffect(() => {
    if (STATE) setState(STATE);
  }, [elementData, areaData, activeStateId]);

  function renderActiveControl() {
    switch (activeControlType) {
      case BG:
        return (
          <BackgroundControl key={activeElementId} elementData={elementData} />
        );
      case TEXT:
        return <TextControl key={activeElementId} elementData={elementData} />;
      case INPUT:
        return <TextControl key={activeElementId} elementData={elementData} />;
      case IMAGE:
        return <ImageControl key={activeElementId} elementData={elementData} />;
      case VIDEO:
        return <VideoControl key={activeElementId} elementData={elementData} />;
      case AREA:
        return <AreaControl key={activeElementId} areaData={areaData} />;
      default:
        return <div style={{ padding: ".5rem 1rem" }}></div>;
    }
  }

  return (
    <div className="ics-prompt-builder-controls">
      {activeControlType === "state" ? (
        <div className="state-controller">
          <p className="code">{state?.code}</p>
          <p className="description">{state?.description}</p>
          <div className="horizontal-border" />
          <select
            className="ics-input transaction-state-dropdown"
            value={state?.transactionState}
            onChange={handleTransactionStateChange}
          >
            <option value="null" selected>
              Select transaction state
            </option>
            <option value="Idle">Idle</option>
            <option value="Fueling">Fueling</option>
          </select>
        </div>
      ) : activeControlType === CHILD_STATE ? (
        <div className="child-state-controller">
          <p className="title">
            {childState?.type === EXCEPTION && (
              <AccessTimeRoundedIcon className="clock-icon" />
            )}
            <p className="code text-capitalize">
              {childState?.dayPart ? childState.dayPart.name : childState?.type}
            </p>
          </p>
          {childState?.type === EXCEPTION && (
            <span className="exception-time text-lowercase">
              ({formatTime(childState?.dayPart?.start || "")} -{" "}
              {formatTime(childState?.dayPart?.end || "")})
            </span>
          )}
        </div>
      ) : ELEMENTS_LIST.indexOf(activeControlType) > -1 ? (
        renderActiveControl()
      ) : null}
    </div>
  );
}
