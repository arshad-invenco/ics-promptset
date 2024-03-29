import React from "react";
import "./prompt-text-control.scss";
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";
import {
  Elements,
  PromptSetInterface,
} from "../../../../models/promptset.modal";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { updateInputElement } from "../../../../redux/reducers/promptsetSlice";
import FontDropdown from "../../../common/font-dropdown/fontDropdown";
import { selectFonts } from "../../../../redux/selectors/fontSelectors";
import { Font } from "../../../../models/fonts.modal";
import { filterFonts } from "../../../../constants/fontConstant";
import { PromptSetRootState } from "../../Tree/promptTree";
import { getDeviceType } from "../../../../constants/deviceType";
import isSequoiaDevice from "../../../../services/promptsetService";
import { promptSetContext } from "../../../../hooks/promptsetContext";
import { useReadOnly } from "../../../../hooks/readOnly";
import { Modal } from "react-bootstrap";
import ColorPickerModal from "../../modals/color-picker-modal/colorPicker";

interface ElementsProp {
  elementData: Elements;
}

export default function TextControl(props: ElementsProp) {
  const { elementData } = props;
  const fonts: Font[] = useSelector(selectFonts);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const initialFont = fonts.find((font) => font.fontId === elementData.face);

  // CONTEXT API
  const { activePromptEditorId } = useContext(promptSetContext);

  // STATES
  const [element, setElement] = useState(elementData);
  const [selectedFont, setSelectedFont] = useState<Font>(
    initialFont ?? ({} as Font)
  );
  const [filteredFonts, setFilteredFonts] = useState<Font[]>([]);

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  // SELECTORS
  const promptsetData: PromptSetInterface = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );

  //   HOOKS
  const readOnly = useReadOnly();

  useEffect(() => {
    setElement(elementData);
  }, [promptsetData]);

  // FUNCTIONS
  function onChangeInput(element: Elements) {
    dispatch(
      updateInputElement({
        assignmentId: activePromptEditorId,
        newElement: element,
      })
    );
  }

  function handleFontSelection(item: Font) {
    setSelectedFont(item);
    setElement({ ...elementData, face: item.fontId });
    onChangeInput({ ...elementData, face: item.fontId });
  }

  const handleColorClose = () => {
    setShowColorPicker(false);
  };

  const updateColor = (color: string) => {
    setElement({ ...element, color: color.replace("#", "") });
    onChangeInput({ ...element, color: color.replace("#", "") });
  };

  // EFFECTS
  useEffect(() => {
    const updatedFonts = filterFonts(fonts, elementData);
    setFilteredFonts(updatedFonts);
  }, [fonts, elementData]);

  return (
    <div className="ics-prompt-builder-text-controls">
      {!readOnly ? (
        <>
          <div className="ics-inline-250-block">
            <label>Text</label>
            <input
              type="text"
              value={element.value}
              placeholder="Text"
              onChange={(e) => {
                setElement({ ...element, value: e.target.value });
                onChangeInput({ ...element, value: e.target.value });
              }}
              className="ics-input-react"
            />
          </div>

          <div className="ics-inline-75-block">
            <label>Color</label>
            <button
              style={{ backgroundColor: `#${element.color}` }}
              className={"color-picker-button"}
              onClick={() => setShowColorPicker(true)}
            ></button>
          </div>
          <Modal
            show={showColorPicker}
            onHide={handleColorClose}
            className="color-modal"
            size="sm"
            centered
          >
            <ColorPickerModal
              value={"#" + element.color ?? ""}
              onChange={updateColor}
              hide={handleColorClose}
            />
          </Modal>

          <div className="ics-inline-90-block">
            <label>Size</label>
            <input
              type="number"
              value={element.size}
              onChange={(e) => {
                setElement({ ...element, size: Number(e.target.value) });
                onChangeInput({
                  ...element,
                  size: Number(e.target.value),
                  height: (elementData?.height || 0) + 1,
                });
              }}
              className="ics-input-react"
              min="1"
              max="380"
            />
          </div>

          <div className="ics-inline-250-block">
            <label>Font</label>
            <FontDropdown
              fonts={filteredFonts}
              onSelect={handleFontSelection}
              selectedFont={selectedFont}
            ></FontDropdown>
          </div>

          {isSequoiaDevice(getDeviceType()) && (
            <div className="ics-inline-150-block">
              <label>Alignment</label>
              <div className="d-flex-row alignment-control">
                <button
                  onClick={() => {
                    setElement({ ...element, textAlign: "left" });
                    onChangeInput({ ...element, textAlign: "left" });
                  }}
                  className={`button-white align ${
                    element.textAlign === "left" ? "align-btn-active" : ""
                  }`}
                >
                  <i className="fas fa-align-left"></i>
                </button>
                <button
                  onClick={() => {
                    setElement({ ...element, textAlign: "center" });
                    onChangeInput({ ...element, textAlign: "center" });
                  }}
                  className={`button-white align ${
                    element.textAlign === "center" ? "align-btn-active" : ""
                  }`}
                >
                  <i className="fas fa-align-center"></i>
                </button>
                <button
                  onClick={() => {
                    setElement({ ...element, textAlign: "right" });
                    onChangeInput({ ...element, textAlign: "right" });
                  }}
                  className={`button-white align ${
                    element.textAlign === "right" ? "align-btn-active" : ""
                  }`}
                >
                  <i className="fas fa-align-right"></i>
                </button>
              </div>
            </div>
          )}

          <div className="d-flex-col dimensions">
            <label>Dimensions</label>
            <div className="co-ordinates d-flex-row">
              <div className="d-flex-row dimension-control">
                <label>X</label>
                <input
                  type="number"
                  value={element.left}
                  onChange={(e) => {
                    setElement({ ...element, left: Number(e.target.value) });
                    onChangeInput({
                      ...element,
                      left: Number(e.target.value),
                    });
                  }}
                  min={0}
                  className="ics-input-react dimension-input"
                />
              </div>

              <div className="d-flex-row dimension-control">
                <label>Y</label>
                <input
                  type="number"
                  value={element.top}
                  onChange={(e) => {
                    setElement({ ...element, top: Number(e.target.value) });
                    onChangeInput({
                      ...element,
                      top: Number(e.target.value),
                    });
                  }}
                  min={0}
                  className="ics-input-react dimension-input"
                />
              </div>

              <div className="d-flex-row dimension-control">
                <label>W</label>
                <input
                  type="number"
                  value={element.width}
                  onChange={(e) => {
                    setElement({ ...element, width: Number(e.target.value) });
                    onChangeInput({
                      ...element,
                      width: Number(e.target.value),
                    });
                  }}
                  min={0}
                  className="ics-input-react dimension-input"
                />
              </div>

              <div className="d-flex-row dimension-control disabled-control">
                <label>H</label>
                <input
                  type="number"
                  value={element.height}
                  onChange={(e) => {
                    setElement({ ...element, height: Number(e.target.value) });
                    onChangeInput({
                      ...element,
                      height: Number(e.target.value),
                    });
                  }}
                  min={0}
                  className="ics-input-react dimension-input"
                  readOnly={true}
                />
              </div>
            </div>
          </div>

          <div className="ics-inline-150-block">
            <label>Center shift</label>
            <div className="d-flex-row center-shift">
              <label
                onClick={() => {
                  setElement({
                    ...element,
                    left:
                      promptsetData.screenWidth / 2 - (element?.width || 0) / 2,
                  });
                  onChangeInput({
                    ...element,
                    left:
                      promptsetData.screenWidth / 2 - (element?.width || 0) / 2,
                  });
                }}
                className="shift-btn"
              >
                <VerticalAlignCenterRoundedIcon className="icon shift-icon-transform-horizontal" />
              </label>
              <label
                onClick={() => {
                  setElement({
                    ...element,
                    top:
                      promptsetData.screenHeight / 2 -
                      (element?.height || 0) / 2,
                  });
                  onChangeInput({
                    ...element,
                    top:
                      promptsetData.screenHeight / 2 -
                      (element?.height || 0) / 2,
                  });
                }}
                className="shift-btn"
              >
                <VerticalAlignCenterRoundedIcon className="icon" />
              </label>
            </div>
          </div>

          {element.userclass && (
            <div className="ics-inline-200-block">
              <label>Classes</label>
              <input
                type="text"
                value={element.userclass}
                onChange={(e) => {
                  setElement({ ...element, userclass: e.target.value });
                  onChangeInput({ ...element, userclass: e.target.value });
                }}
                className="ics-input-react"
              />
            </div>
          )}
        </>
      ) : (
        <h4 className="controller-title">Text</h4>
      )}
    </div>
  );
}
