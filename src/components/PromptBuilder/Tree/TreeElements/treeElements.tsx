import React from "react";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { Elements } from "../../../../models/promptset.modal";
import { AppDispatch } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import {
  deleteElementByID,
  updateInputElement,
} from "../../../../redux/reducers/promptsetSlice";
import { useReadOnly } from "../../../../hooks/readOnly";

interface TreeElementsProps {
  element: Elements;
  childState: string;
}

export default function TreeElements(props: TreeElementsProps) {
  // PROPS
  const { element, childState } = props;

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  // HOOKS
  const readOnly = useReadOnly();

  function deleteElement(element: Elements) {
    dispatch(deleteElementByID(element.id));
  }

  function updateBackground(element: Elements) {
    const updatedElement = { ...element, lock: !element.lock };
    dispatch(
      updateInputElement({
        assignmentId: childState,
        newElement: updatedElement,
      }),
    );
  }

  // parent class    ->   inner-element
  return (
    <>
      {element.type === "text" ? (
        <div className="element text-element-value">
          <div className="element-left-container text-capitalize">
            <DragIndicatorRoundedIcon className="grab-icon" />
            <i className="fas fa-font"></i>
            {element.type}
          </div>
          {!readOnly && (
            <i
              onClick={() => {
                deleteElement(element);
              }}
              className="far fa-trash-alt trash-icon"
            ></i>
          )}
        </div>
      ) : element.type === "input" ? (
        <div className="element input-element-value">
          <div className="element-left-container text-capitalize">
            <DragIndicatorRoundedIcon className="grab-icon" />
            <i className="fas fa-i-cursor"></i>
            {element.type}
          </div>
          {!readOnly && (
            <i
              onClick={() => {
                deleteElement(element);
              }}
              className="far fa-trash-alt trash-icon"
            ></i>
          )}
        </div>
      ) : element.type === "bg" ? (
        <div className="element input-element-value">
          <div className="element-left-container text-capitalize">
            <i className="far fa-square"></i>
            Background
          </div>
          {!readOnly && (
            <i
              onClick={() => {
                updateBackground(element);
              }}
              className="far fa-trash-alt trash-icon"
            ></i>
          )}
        </div>
      ) : element.type === "image" ? (
        <div className="element input-element-value">
          <div className="element-left-container text-capitalize">
            <DragIndicatorRoundedIcon className="grab-icon" />
            <i className="far fa-image"></i>
            {element.type}
          </div>
          {!readOnly && (
            <i
              onClick={() => {
                deleteElement(element);
              }}
              className="far fa-trash-alt trash-icon"
            ></i>
          )}
        </div>
      ) : element.type === "video" ? (
        <div className="element input-element-value">
          <div className="element-left-container text-capitalize">
            <i className="fas fa-video"></i>
            {element.type}
          </div>
          {!readOnly && (
            <i
              onClick={() => {
                deleteElement(element);
              }}
              className="far fa-trash-alt trash-icon"
            ></i>
          )}
        </div>
      ) : null}
    </>
  );
}
