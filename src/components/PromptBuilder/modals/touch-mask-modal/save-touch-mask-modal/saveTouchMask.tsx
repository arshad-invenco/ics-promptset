import React from "react";
import { Modal } from "react-bootstrap";
import "./saveTouchMask.scss";
import { useState } from "react";

interface SaveTouchMaskProps {
  hide: () => void;
  newTouchMask: (arg: string) => void;
}

function SaveTouchMask({ hide, newTouchMask }: SaveTouchMaskProps) {
  const [touchMaskName, setTouchMaskName] = useState("TouchMask");

  return (
    <div className="save-touch-mask">
      <Modal.Header>
        <h4>Save Touch Mask</h4>
      </Modal.Header>
      <Modal.Body>
        <p>Enter a name for the touch mask</p>
        <input
          className="ics-input"
          value={touchMaskName}
          onChange={(e) => {
            setTouchMaskName(e.target.value);
          }}
          placeholder="Touch Mask Name"
          autoFocus
        ></input>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-link"
          onClick={(e) => {
            e.stopPropagation();
            hide();
          }}
        >
          CANCEL
        </button>
        <div className={!touchMaskName ? "no-selection" : ""}>
          <button
            disabled={!touchMaskName}
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              newTouchMask(touchMaskName);
              hide();
            }}
          >
            SAVE
          </button>
        </div>
      </Modal.Footer>
    </div>
  );
}
export default SaveTouchMask;
