import { Modal } from "react-bootstrap";
import { TouchMask } from "../../../../models/touchMask.modal";
import "./selectTouchMask.scss";
import { useSelector } from "react-redux";
import { selectTouchMasks } from "../../../../redux/selectors/touchMaskSelectors";
import { useState } from "react";

interface SelectTouchMaskProps {
  hide: () => void;
  onTouchMaskSelection: (touchMask: TouchMask | null) => void;
}

function SelectTouchMask({ hide, onTouchMaskSelection }: SelectTouchMaskProps) {
  const touchMasks: TouchMask[] = useSelector(selectTouchMasks).results;
  const [selectedTouchMask, setSelectedTouchMask] =
    useState<TouchMask | null>();
  return (
    <div className="touch-mask">
      <Modal.Header>
        <h4>Select a touch mask</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="touch-mask-list">
          {touchMasks.map((touchMask) => (
            <div
              key={touchMask.id}
              className={
                selectedTouchMask === touchMask
                  ? "selected-mask touch-mask-item"
                  : "touch-mask-item"
              }
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTouchMask(touchMask);
              }}
            >
              <span className="touch-mask-name">{touchMask.name}</span>
              <span className="touch-mask-dsc">{touchMask.description}</span>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="left-side">
          <button
            className="btn btn-link"
            onClick={(e) => {
              e.stopPropagation();
              hide();
            }}
          >
            CREATE NEW
          </button>
        </div>
        <div className="right-side">
          <button
            className="btn btn-link"
            onClick={(e) => {
              e.stopPropagation();
              hide();
            }}
          >
            CANCEL
          </button>

          <div className={!selectedTouchMask ? "no-selection" : ""}>
            <button
              disabled={!selectedTouchMask}
              className="btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedTouchMask) {
                  onTouchMaskSelection(selectedTouchMask);
                }
              }}
            >
              SELECT
            </button>
          </div>
        </div>
      </Modal.Footer>
    </div>
  );
}

export default SelectTouchMask;
