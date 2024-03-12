import { useContext, useEffect, useState } from "react";
import "./promptTree.scss";
import { Accordion, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import InnerStates from "./TreeElements/innerStates";
import {
  Assignment,
  Elements,
  NewPromptPayload,
  PromptSetInterface,
  State,
} from "../../../models/promptset.modal";
import isSequoiaDevice from "../../../services/promptsetService";
import { promptSetContext } from "../../../hooks/promptsetContext";
import { setPromptSetId, STATE } from "../../../constants/promptSetConstants";
import { getDeviceType, setDeviceType } from "../../../constants/deviceType";
import { AppDispatch } from "../../../redux/store";
import { fetchSoftKeys } from "../../../redux/thunks/softkeyThunk";
import NewPrompt from "../modals/new-prompt-modal/newPrompt";
import { fetchPromptSet } from "../../../redux/thunks/promptSetThunk";
import { getBaseUrl } from "../../../constants/app";
import {
  getCompanyId,
  getPromptsetLanguages,
  setCompanyId,
  setCompanyLanguages,
  setPromptSet,
} from "../../../constants/language";
import { fetchLanguages } from "../../../redux/thunks/languageThunk";
import { Font } from "../../../models/fonts.modal";
import { selectFonts } from "../../../redux/selectors/fontSelectors";
import { filterFonts } from "../../../constants/fontConstant";
import { selectElementByIdInAssignment } from "../../../redux/selectors/promptSetSelectors";
import { selectLanguages } from "../../../redux/selectors/languageSelectors";
import request from "../../../services/interceptor";
import { usePromptSetId } from "../../../hooks/promptsetId";
import { removeIsStateChangedById } from "../../../redux/reducers/promptsetSlice";
import { useReadOnly } from "../../../hooks/readOnly";
import AddIcon from "@mui/icons-material/Add";

export interface PromptSetRootState {
  promptset: {
    data: PromptSetInterface;
    isLoading: boolean;
    error: any;
  };
}

export default function PromptTree() {
  // REDUX
  const dispatch = useDispatch<AppDispatch>();
  const languages = useSelector(selectLanguages);
  const { activePromptEditorId, activeElementId } =
    useContext(promptSetContext);

  // STATES
  const [isSaving, setIsSaving] = useState(false);
  const [showNewPromptModal, setShowNewPromptModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialState, setInitialState] = useState(true);

  // SELECTOR
  const promptsetData: PromptSetInterface = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );
  const fonts: Font[] = useSelector(selectFonts);
  const elementData: Elements =
    useSelector((state: PromptSetRootState & State[]) =>
      selectElementByIdInAssignment(
        state,
        activePromptEditorId,
        activeElementId
      )
    ) || ({} as Elements);

  // CONTEXT API
  const {
    promptSetData,
    setPromptSetData,
    setActiveStateId,
    setActiveControlType,
    setActivePromptEditorId,
    toastDispatch,
    setLastModified,
  } = useContext(promptSetContext);

  // HOOKS
  const promptSetId = usePromptSetId();
  const readOnly = useReadOnly();

  // EFFECTS
  useEffect(() => {
    setPromptSetData(promptSetData);
  }, []);

  useEffect(() => {
    if (promptsetData && !isLoaded) {
      setDeviceType(promptsetData.deviceType);
      setCompanyId(promptsetData.company);
      setPromptSet(promptsetData);
      setPromptSetId(promptsetData.id);
      if (elementData) {
        filterFonts(fonts, elementData);
      }
      if (getDeviceType()) {
        dispatch(fetchSoftKeys());
      }
      if (getCompanyId()) {
        dispatch(fetchLanguages());
        getPromptsetLanguages();
      }
      if (
        initialState &&
        promptsetData.states &&
        promptsetData.states.length > 0 &&
        promptsetData.states[0].assignments &&
        promptsetData.states[0].assignments.length > 0
      ) {
        setInitialState(false);
        onClickState(
          promptsetData.states[0].id,
          promptsetData.states[0].assignments[0].id
        );
      }
    }
  }, [promptsetData]);

  useEffect(() => {
    if (
      promptsetData &&
      promptsetData.states &&
      promptsetData.states.length > 0 &&
      !isLoaded
    ) {
      setActiveStateId(promptsetData.states[0].id);
      setIsLoaded(true);
      if (promptsetData.states[0].assignments.length > 0) {
        setActivePromptEditorId(promptsetData.states[0].assignments[0].id);
      }
      setPromptSetData(promptsetData);
    }
  }, [promptsetData, fonts, elementData]);

  useEffect(() => {
    setCompanyLanguages(languages);
  }, [languages]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleNewPromptShow = () => {
    setShowNewPromptModal(true);
  };

  const handleNewPromptClose = () => {
    setShowNewPromptModal(false);
  };

  const createNewPrompt = async (newPrompt: NewPromptPayload) => {
    newPrompt = {
      ...newPrompt,
      promptSetId: promptsetData.id,
      promptType: newPrompt.promptType.toLowerCase(),
    };

    const response = await request().post(
      `${getBaseUrl()}/media/prompts`,
      newPrompt
    );

    if (response) {
      dispatch(fetchPromptSet(promptSetId));
    }
  };

  function handleSavePromptSet() {
    let payload: Assignment[] = [];

    promptsetData.states.map((state) => {
      if (state.isStateChanged) {
        state.assignments.map((assignment) => {
          payload.push({
            ...assignment,
            promptId: assignment.id,
            softkeys: assignment.softkeys.length > 0 ? assignment.softkeys : [],
          });
        });
      }
    });

    if (payload.length > 0) {
      setIsSaving(!isSaving);
      request()
        .put(`${getBaseUrl()}/media/promptsets/${promptSetId}/prompts`, payload)
        .then((res) => {
          setLastModified(res.data);
          toastDispatch({
            type: "ADD_TOAST",
            payload: {
              message: `Saved ${payload.length} state${payload.length > 1 ? "s" : ""}`,
            },
          });
          dispatch(fetchPromptSet(promptSetId));
          setIsSaving(false);
        });
    } else {
      toastDispatch({
        type: "ADD_TOAST",
        payload: { message: "You do not have any unsaved changes." },
      });
    }
  }

  function onClickState(state_id: string, child_id: string) {
    setActiveStateId(state_id);
    setActiveControlType(STATE);
    setActivePromptEditorId(child_id);
  }

  function saveState(item: State) {
    const updatedAssignments = item.assignments.map((assignment) => ({
      ...assignment,
      softkeys: assignment.softkeys.length > 0 ? assignment.softkeys : [],
      promptId: assignment.id,
    }));
    request()
      .put(
        `${getBaseUrl()}/media/promptsets/${promptSetId}/prompts`,
        updatedAssignments
      )
      .then((res) => {
        dispatch(removeIsStateChangedById(item.id));
        setLastModified(res.data);
        toastDispatch({
          type: "ADD_TOAST",
          payload: { message: "Saved 1 state" },
        });
      })
      .catch((err) => {
        console.log(err);
        toastDispatch({
          type: "ADD_TOAST",
          payload: { message: err.response.data.message },
        });
      });
  }

  const handlePromptNameChange = () => {
    if (!readOnly) {
      request()
        .put(`${getBaseUrl()}/media/promptsets/${promptSetId}`, {
          name: promptSetData.name,
          fontColor: promptSetData.fontColor,
        })
        .then(() => {
          dispatch(fetchPromptSet(promptSetId));
          toastDispatch({
            type: "ADD_TOAST",
            payload: { message: "Prompt Set name updated" },
          });
        });
    }
  };

  return (
    <div className={`left-container ${getDeviceType()}`}>
      <div className="ics-prompt-tree-container">
        <div className="ics-prompt-set-heading">
          <input
            className={`prompt-heading-input ${
              readOnly ? "disabled-input" : ""
            }`}
            type="text"
            value={promptSetData.name}
            onChange={(e) => {
              setPromptSetData({ ...promptSetData, name: e.target.value });
            }}
            readOnly={readOnly}
            onBlur={handlePromptNameChange}
          />
        </div>
        <div className="ics-prompt-builder-state">
          {promptsetData?.states?.map((item: State, index: number) => {
            return (
              <div key={index} className="state-item">
                <Accordion alwaysOpen defaultActiveKey="0">
                  <Accordion.Item eventKey={index.toString()}>
                    <Accordion.Header
                      onClick={() => {
                        onClickState(item.id, item.assignments[0].id);
                      }}
                    >
                      <div className="prompt-set-status">
                        <div className="left-status">
                          <div className="status-icon">
                            {item.secure && isSequoiaDevice("G7-100-8") && (
                              <i className="fas fa-shield-alt"></i>
                            )}
                          </div>
                          <div
                            onClick={() => {}}
                            className="middle-text-status"
                          >
                            {item.code.toUpperCase()}
                          </div>
                          {item.transactionState && (
                            <span className="state-label">
                              {item.transactionState}
                            </span>
                          )}
                        </div>
                        {item.isStateChanged && !readOnly && (
                          <div className="unsaved-status">
                            <i
                              onClick={(e) => {
                                e.stopPropagation();
                                saveState(item);
                              }}
                              className="fa fa-floppy-o "
                            ></i>
                          </div>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {item.assignments.map(
                        (child: Assignment, index: number) => {
                          return (
                            <div key={index} className="inner-accordion">
                              <InnerStates child={child} index={index} />
                            </div>
                          );
                        }
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            );
          })}
        </div>
        <div className={`prompt-tree-footer ${readOnly ? "p-0" : ""}`}>
          {!readOnly && (
            <>
              <button className="btn btn-primary" onClick={handleSavePromptSet}>
                {isSaving && (
                  <i className="fa fa-spinner fa-pulse fa-fw ics-packages-loader"></i>
                )}
                SAVE
              </button>
              <button
                className="btn btn-default new-prompt-btn"
                onClick={handleNewPromptShow}
              >
                NEW PROMPT
                <AddIcon  />
              </button>
              <Modal
                show={showNewPromptModal}
                onHide={handleNewPromptClose}
                size="sm"
              >
                <NewPrompt
                  hide={handleNewPromptClose}
                  newPrompt={createNewPrompt}
                />
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
