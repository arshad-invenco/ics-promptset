import "./prompt-area-control.scss";
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";
import { TouchMapAreas } from "../../../../models/promptset.modal";
import { useState } from "react";

interface TouchMapAreaProp {
  areaData: TouchMapAreas;
}

export function AreaControl(props: TouchMapAreaProp) {
  const { areaData } = props;

  // STATES
  const [element, setElement] = useState(areaData);
  console.log(element, "AREA");

  return (
    <div className="ics-prompt-builder-area-controls d-flex-row">
      <div className="ics-inline-115-block">
        <label>Type</label>
        <div className="area-controls d-flex-row">
          <div
            onClick={() => setElement({ ...element, shape: "rect" })}
            className={`shape rectangle ${
              element.shape === "rect" ? "selected" : ""
            } `}
          ></div>
          <div
            onClick={() => setElement({ ...element, shape: "circle" })}
            className={`shape circle ${
              element.shape === "circle" ? "selected" : ""
            }`}
          ></div>
        </div>
      </div>

      <div className="d-flex-col dimensions">
        <label>Dimensions</label>
        <div className="co-ordinates d-flex-row">
          <div className="d-flex-row dimension-control">
            <label>X</label>
            <input
              type="number"
              min={0}
              className="ics-input dimension-input"
            />
          </div>

          <div className="d-flex-row dimension-control">
            <label>Y</label>
            <input
              type="number"
              min={0}
              className="ics-input dimension-input"
            />
          </div>

          <div className="d-flex-row dimension-control">
            <label>W</label>
            <input
              type="number"
              min={0}
              className="ics-input dimension-input"
            />
          </div>

          <div className="d-flex-row dimension-control">
            <label>H</label>
            <input
              type="number"
              min={0}
              value={45}
              className="ics-input dimension-input"
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

      <div className="ics-inline-200-block">
        <label>Key or Code</label>
        <input type="text" className="ics-input" />
      </div>
    </div>
  );
}
