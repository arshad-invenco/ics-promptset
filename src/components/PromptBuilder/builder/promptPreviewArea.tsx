import React from "react";
import "./promptBuilder.scss";
import { getDeviceType } from "../../../constants/deviceType";
import PromptBuilder from "./promptBuilder";
import { useContext, useEffect, useState } from "react";
import {
  PromptSetInterface,
  SoftKeys,
  State,
} from "../../../models/promptset.modal";
import { useDispatch, useSelector } from "react-redux";
import { PromptSetRootState } from "../Tree/promptTree";
import {
  enableSoftKey,
  enableSoftKeysBottom,
} from "../../../services/promptsetService";
import { Modal } from "react-bootstrap";
import SaveSoftKey from "../modals/save-soft-key-modal/saveSoftKey";
import { Keycode } from "../../../models/keycode.modal";
import { useReadOnly } from "../../../hooks/readOnly";
import { BOTTOM, LEFT, RIGHT } from "../../../constants/promptSetConstants";
import { promptSetContext } from "../../../hooks/promptsetContext";
import { selectPromptSetAssignmentById } from "../../../redux/selectors/promptSetSelectors";
import { AppDispatch } from "../../../redux/store";
import { updateSoftKeyByAssignmentId } from "../../../redux/reducers/promptsetSlice";

export default function PromptPreviewArea() {
  // STATES
  const [showKeyCodeModal, setShowKeyCodeModal] = useState(false);
  const [softKeys, setSoftKeys] = useState<SoftKeys[]>([]);
  const [currentSoftKey, setCurrentSoftKey] = useState<string>("");
  const [currentKey, setCurrentKey] = useState<number>(-1);

  // CONTEXT API
  const { activePromptEditorId } = useContext(promptSetContext);

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  // HOOKS
  const deviceType = getDeviceType();
  const readOnly = useReadOnly();

  // SELECTORS
  const promptsetData: PromptSetInterface = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );
  const activeChild = useSelector((state: PromptSetRootState & State[]) =>
    selectPromptSetAssignmentById(state, activePromptEditorId)
  );

  const handleKeyCodeModalShow = (softKey: string) => {
    setShowKeyCodeModal(true);
    setCurrentSoftKey(softKey);
  };

  const handleKeyCodeModalClose = () => {
    setShowKeyCodeModal(false);
  };

  const handleKeyCode = (item: Keycode) => {
    setShowKeyCodeModal(false);
    let softKey = {
      softkey: currentKey,
      keycode: item.code,
      label: item.name,
    };
    
    dispatch(
      updateSoftKeyByAssignmentId({
        assignmentId: activePromptEditorId,
        newSoftKey: softKey,
      })
    );
  };

  useEffect(() => {
    if (activeChild?.softkeys) setSoftKeys(activeChild.softkeys);
  }, [promptsetData, activePromptEditorId]);

  const renderSoftKeys = (start: number, end: number, position: string) => {
    const keys = [];
    if (position === LEFT) {
      for (let id = start; id <= end; id++) {
        const softKey = softKeys.find((softKey) => softKey.softkey === id);
        keys.push(
          <div key={id} className="softkey-btn">
            <button
              className="soft-key-button"
              onClick={() => {
                setCurrentKey(id);
                handleKeyCodeModalShow(softKey?.label ?? "");
              }}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
            <p className="soft-key-text">{softKey?.label}</p>
          </div>
        );
      }
    } else if (position === RIGHT) {
      for (let id = start; id <= end; id++) {
        const softKey = softKeys.find((softKey) => softKey.softkey === id);
        keys.push(
          <div key={id} className="softkey-btn">
            <button
              onClick={() => {
                setCurrentKey(id);
                handleKeyCodeModalShow(softKey?.label ?? "");
              }}
              className="soft-key-button"
            >
              <i className="fa fa-chevron-left"></i>
            </button>
            <p className="soft-key-text">{softKey?.label}</p>
          </div>
        );
      }
    } else {
      for (let id = start; id <= end; id++) {
        const softKey = softKeys.find((softKey) => softKey.softkey === id);
        keys.push(
          <div key={id} className="soft-key-button-container">
            <button
              className="soft-key-button"
              onClick={() => {
                setCurrentKey(id);
                handleKeyCodeModalShow(softKey?.label ?? "");
              }}
            >
              <i className="fa fa-window-minimize fa-rotate-90"></i>
            </button>
            <p className="soft-key-text">{softKey?.label}</p>
          </div>
        );
      }
    }
    return keys;
  };

  return (
    <div className="ics-prompt-builder-preview-wrapper prompt-builder-size">
      {enableSoftKey(getDeviceType()) && (
        <div className={"soft-keys-left soft-keys"}>
          {renderSoftKeys(5, 8, LEFT)}
        </div>
      )}
      <div className={`ics-prompt-builder-preview-container ${deviceType}`}>
        <div
          className={`ics-prompt-builder ${readOnly ? "disable-preview" : ""}`}
        >
          <PromptBuilder
            color={promptsetData.bg}
            screenWidth={promptsetData.screenWidth}
            screenHeight={promptsetData.screenHeight}
          />
        </div>
        {enableSoftKeysBottom(getDeviceType()) && (
          <div className="soft-keys-bottom">{renderSoftKeys(1, 4, BOTTOM)}</div>
        )}
      </div>

      {enableSoftKey(getDeviceType()) && (
        <div className={"soft-keys-right soft-keys"}>
          {renderSoftKeys(9, 12, RIGHT)}
        </div>
      )}
      <Modal show={showKeyCodeModal} onHide={handleKeyCodeModalClose} size="sm">
        <SaveSoftKey
          hide={handleKeyCodeModalClose}
          onChange={handleKeyCode}
          currentSoftKey={currentSoftKey}
        />
      </Modal>
    </div>
  );
}
