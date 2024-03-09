import "./promptBuilder.scss";
import { getDeviceType } from "../../../constants/deviceType";
import PromptBuilder from "./promptBuilder";
import { useEffect, useState } from "react";
import { PromptSetInterface } from "../../../models/promptset.modal";
import { useSelector } from "react-redux";
import { PromptSetRootState } from "../Tree/promptTree";
import {
  enableSoftKey,
  enableSoftKeysBottom,
} from "../../../services/promptsetService";
import { Modal } from "react-bootstrap";
import SaveSoftKey from "../modals/save-soft-key-modal/saveSoftKey";
import { Keycode } from "../../../models/keycode.modal";
import {useReadOnly} from "../../../hooks/readOnly";

export default function PromptPreviewArea() {
  const [showKeyCodeModal, setShowKeyCodeModal] = useState(false);

  // SNAP
  let s = null;

  // HOOKS
  const deviceType = getDeviceType();
  const readOnly = useReadOnly();

  // SELECTORS
  const promptsetData: PromptSetInterface = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );

  const handleKeyCodeModalShow = () => {
    setShowKeyCodeModal(true);
  };

  const handleKeyCodeModalClose = () => {
    setShowKeyCodeModal(false);
  };

  const handleKeyCode = (item: Keycode) => {};

  useEffect(() => {}, [promptsetData]);

  return (
    <div className="ics-prompt-builder-preview-wrapper prompt-builder-size">
      {enableSoftKey(getDeviceType()) && (
        <div className={"soft-keys-left soft-keys"}>
          <div className="softkey-btn">
            <button
              className="soft-key-button"
              onClick={handleKeyCodeModalShow}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
            <p className="soft-key-text">Text</p>
          </div>

          <div className="softkey-btn">
            <button className="soft-key-button">
              <i className="fa fa-chevron-right"></i>
            </button>
            <p className="soft-key-text">Text</p>
          </div>
          <div className="softkey-btn">
            <button className="soft-key-button">
              <i className="fa fa-chevron-right"></i>
            </button>
            <p className="soft-key-text">Text</p>
          </div>
          <div className="softkey-btn">
            <button className="soft-key-button">
              <i className="fa fa-chevron-right"></i>
            </button>
            <p className="soft-key-text">Text</p>
          </div>
        </div>
      )}

      <div className={`ics-prompt-builder-preview-container ${deviceType}`}>
        <div className={`ics-prompt-builder ${readOnly ? 'disable-preview' : ''}`}>
          <PromptBuilder
            color={promptsetData.bg}
            screenWidth={promptsetData.screenWidth}
            screenHeight={promptsetData.screenHeight}
          />
        </div>
        {enableSoftKeysBottom(getDeviceType()) && (
          <div className="soft-keys-bottom">
            <div className="soft-key-button-container">
              <button className="soft-key-button">
                <i className="fa fa-window-minimize fa-rotate-90"></i>
              </button>
              <p className="soft-key-text">Text</p>
            </div>

            <div className="soft-key-button-container">
              <button className="soft-key-button">
                <i className="fa fa-window-minimize fa-rotate-90"></i>
              </button>
              <p className="soft-key-text">Text</p>
            </div>
            <div className="soft-key-button-container">
              <button className="soft-key-button">
                <i className="fa fa-window-minimize fa-rotate-90"></i>
              </button>
              <p className="soft-key-text">Text</p>
            </div>
            <div className="soft-key-button-container">
              <button className="soft-key-button">
                <i className="fa fa-window-minimize fa-rotate-90"></i>
              </button>
              <p className="soft-key-text">Text</p>
            </div>
          </div>
        )}
      </div>

      {enableSoftKey(getDeviceType()) && (
        <div className={"soft-keys-right soft-keys"}>
          <div className="softkey-btn">
            <button className="soft-key-button">
              <i className="fa fa-chevron-left"></i>
            </button>
            <p className="soft-key-text">Text</p>
          </div>
          <div className="softkey-btn">
            <button className="soft-key-button">
              <i className="fa fa-chevron-left"></i>
            </button>
            <p className="soft-key-text">Text</p>
          </div>
          <div className="softkey-btn">
            <button className="soft-key-button">
              <i className="fa fa-chevron-left"></i>
            </button>
            <p className="soft-key-text">Text</p>
          </div>
          <div className="softkey-btn">
            <button className="soft-key-button">
              <i className="fa fa-chevron-left"></i>
            </button>
            <p className="soft-key-text">Text</p>
          </div>
        </div>
      )}
      <Modal show={showKeyCodeModal} onHide={handleKeyCodeModalClose} size="sm">
        <SaveSoftKey hide={handleKeyCodeModalClose} onChange={handleKeyCode} />
      </Modal>
    </div>
  );
}
