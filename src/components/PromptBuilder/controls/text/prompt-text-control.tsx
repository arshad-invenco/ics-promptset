import "./prompt-text-control.scss";
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";
import { Elements } from "../../../../models/promptset.modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { updateInputElement } from "../../../../redux/reducers/promptsetSlice";
import { debounce } from "@mui/material";
import FontDropdown from "../../../common/font-dropdown/fontDropdown";
import { selectFonts } from "../../../../redux/selectors/fontSelectors";
import { Font } from "../../../../models/fonts";
import { filterFonts } from "../../../../constants/fontConstant";

interface ElementsProp {
  elementData: Elements;
}

export default function TextControl(props: ElementsProp) {
  const { elementData } = props;
  const fonts: Font[] = useSelector(selectFonts);

  // STATES
  const [element, setElement] = useState(elementData);
  const [selectedFont, setSelectedFont] = useState(elementData.face || "Font");
  const [filteredFonts, setFilteredFonts] = useState<Font[]>([]);

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  // FUNCTIONS
  function onChangeInput(element: Elements) {
    dispatch(updateInputElement(element));
  }

  function handleFontSelection(item: string) {
    if (item !== "Font") {
      setSelectedFont(item);
      setElement({ ...element, face: item });
    }
  }

  // EFFECTS
  useEffect(() => {
    const updatedFonts = filterFonts(fonts, elementData);
    setFilteredFonts(updatedFonts);
  }, [fonts, elementData]);

  // DEBOUNCE
  const debouncedOnChangeInput = debounce(onChangeInput, 1000);

  return (
    <div className="ics-prompt-builder-text-controls">
      <div className="ics-inline-250-block">
        <label>Text</label>
        <input
          type="text"
          value={element.value}
          placeholder="Text"
          onChange={(e) => {
            setElement({ ...element, value: e.target.value });
            debouncedOnChangeInput({ ...element, value: e.target.value });
          }}
          className="ics-input"
        />
      </div>

      <div className="ics-inline-75-block">
        <label>Color</label>
        <button
          style={{ backgroundColor: `#${element.color}` }}
          className={"color-picker-button"}
        ></button>
      </div>

      <div className="ics-inline-90-block">
        <label>Size</label>
        <input
          type="number"
          value={element.size}
          onChange={(e) => {
            setElement({ ...element, size: Number(e.target.value) });
            debouncedOnChangeInput({
              ...element,
              size: Number(e.target.value),
            });
          }}
          className="ics-input"
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

      <div className="ics-inline-150-block">
        <label>Alignment</label>
        <div className="d-flex-row alignment-control">
          <button
            onClick={() => {
              setElement({ ...element, textAlign: "left" });
              debouncedOnChangeInput({ ...element, textAlign: "left" });
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
              debouncedOnChangeInput({ ...element, textAlign: "center" });
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
              debouncedOnChangeInput({ ...element, textAlign: "right" });
            }}
            className={`button-white align ${
              element.textAlign === "right" ? "align-btn-active" : ""
            }`}
          >
            <i className="fas fa-align-right"></i>
          </button>
        </div>
      </div>

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
                debouncedOnChangeInput({
                  ...element,
                  left: Number(e.target.value),
                });
              }}
              min={0}
              className="ics-input dimension-input"
            />
          </div>

          <div className="d-flex-row dimension-control">
            <label>Y</label>
            <input
              type="number"
              value={element.top}
              onChange={(e) => {
                setElement({ ...element, top: Number(e.target.value) });
                debouncedOnChangeInput({
                  ...element,
                  top: Number(e.target.value),
                });
              }}
              min={0}
              className="ics-input dimension-input"
            />
          </div>

          <div className="d-flex-row dimension-control">
            <label>W</label>
            <input
              type="number"
              value={element.width}
              onChange={(e) => {
                setElement({ ...element, width: Number(e.target.value) });
                debouncedOnChangeInput({
                  ...element,
                  width: Number(e.target.value),
                });
              }}
              min={0}
              className="ics-input dimension-input"
            />
          </div>

          <div className="d-flex-row dimension-control disabled-control">
            <label>H</label>
            <input
              type="number"
              value={element.height}
              onChange={(e) => {
                setElement({ ...element, height: Number(e.target.value) });
                debouncedOnChangeInput({
                  ...element,
                  height: Number(e.target.value),
                });
              }}
              min={0}
              className="ics-input dimension-input"
              readOnly={true}
            />
          </div>
        </div>
      </div>

      <div className="ics-inline-150-block">
        <label>Center shift</label>
        <div className="d-flex-row center-shift">
          <label className="shift-btn">
            <VerticalAlignCenterRoundedIcon className="icon shift-icon-transform-horizontal" />
          </label>
          <label className="shift-btn">
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
              debouncedOnChangeInput({ ...element, userclass: e.target.value });
            }}
            className="ics-input"
          />
        </div>
      )}
    </div>
  );
}
