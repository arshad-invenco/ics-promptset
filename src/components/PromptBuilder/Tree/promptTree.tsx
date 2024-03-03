import { useContext, useEffect, useState } from "react";
import "./promptTree.scss";
import { Accordion, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import InnerStates from "./TreeElements/innerStates";
import {
  Assignment,
  NewPromptPayload,
  PromptSetInterface,
  State,
} from "../../../models/promptset.modal";
import isSequoiaDevice from "../../../services/promptsetService";
import { promptSetContext } from "../../../hooks/promptsetContext";
import { STATE } from "../../../constants/promptSetConstants";
import { getDeviceType, setDeviceType } from "../../../constants/deviceType";
import { AppDispatch } from "../../../redux/store";
import { fetchSoftKeys } from "../../../redux/thunks/softkeyThunk";
import NewPrompt from "../modals/new-prompt-modal/newPrompt";
import { fetchPromptSet } from "../../../redux/thunks/promptSetThunk";
import { getBaseUrl } from "../../../constants/app";

export interface PromptSetRootState {
  promptset: {
    data: PromptSetInterface;
    isLoading: boolean;
    error: any;
  };
}

export default function PromptTree() {
  const dispatch = useDispatch<AppDispatch>();

  // STATES
  const [isSaving, setIsSaving] = useState(false); //for save button
  const [showNewPromptModal, setShowNewPromptModal] = useState(false);

  // SELECTOR
  const promptsetData: PromptSetInterface = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );

  // CONTEXT API
  const {
    promptSetData,
    setPromptSetData,
    setActiveStateId,
    setActiveControlType,
    setActivePromptEditorId,
  } = useContext(promptSetContext);

  // EFFECTS
  useEffect(() => {
    setPromptSetData(promptSetData);
  }, []);

  useEffect(() => {
    if (promptsetData) {
      setDeviceType(promptsetData.deviceType);
      if (getDeviceType()) {
        dispatch(fetchSoftKeys());
      }
    }
  }, [promptsetData]);

  const handleNewPromptShow = () => {
    setShowNewPromptModal(true);
  };

  const handleNewPromptClose = () => {
    setShowNewPromptModal(false);
  };

  const createNewPrompt = (newPrompt: NewPromptPayload) => {
    newPrompt = {
      ...newPrompt,
      promptSetId: promptsetData.id,
      promptType: newPrompt.promptType.toLowerCase(),
    };
    fetch(`${getBaseUrl()}/media/prompts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(newPrompt),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          dispatch(fetchPromptSet);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function handleSavePromptSet() {
    setIsSaving(!isSaving);
  }

  function onClickState(state_id: string, child_id: string) {
    setActiveStateId(state_id);
    setActiveControlType(STATE);
    setActivePromptEditorId(child_id);
  }

  function saveState() {
    console.log("state saved");
  }

  return (
    <div className="left-container">
      <div className="ics-prompt-tree-container">
        <div className="ics-prompt-set-heading">
          <input className="prompt-heading-input" type="text" value={"njbh"} />
        </div>
        <div className="ics-prompt-builder-state">
          {promptsetData?.states?.map((item: State, index: number) => {
            return (
              <div key={index} className="state-item">
                <Accordion alwaysOpen>
                  <Accordion.Item eventKey="0">
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
                        {item.isStateChanged && (
                          <div className="unsaved-status">
                            <i
                              onClick={(e) => {
                                e.stopPropagation();
                                saveState();
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
        <div className="prompt-tree-footer">
          <button
            className="btn btn-primary text-uppercase"
            onClick={handleSavePromptSet}
          >
            {isSaving && (
              <i className="fa fa-spinner fa-pulse fa-fw ics-packages-loader"></i>
            )}
            Save
          </button>
          <button
            className="btn btn-secondary text-uppercase"
            onClick={handleNewPromptShow}
          >
            New Prompt
            <i className="fas fa-plus"></i>
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
        </div>
      </div>
    </div>
  );
}
