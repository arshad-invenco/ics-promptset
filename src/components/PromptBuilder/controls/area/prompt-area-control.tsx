import "./prompt-area-control.scss";
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";
import { TouchMapAreas } from "../../../../models/promptset.modal";
import { useEffect, useState } from "react";
import SearchableDropdown from "../../../common/searchable-dropdown/searchableDropdown";
import { useDispatch, useSelector } from "react-redux";
import { Keycode, KeycodeRootState } from "../../../../models/keycode";
import { SoftkeyRootState } from "../../../../models/softkey";
import { fetchSoftKeys } from "../../../../redux/thunks/softkeyThunk";
import {
  selectKeycodeError,
  selectKeycodes,
} from "../../../../redux/selectors/keycodeSelectors";
import { selectSoftKeys } from "../../../../redux/selectors/softkeySelectors";

interface TouchMapAreaProp {
  areaData: TouchMapAreas;
}

interface GroupedCodeItems {
  label: string;
  options: Keycode[];
}

export function AreaControl(props: TouchMapAreaProp) {
  const { areaData } = props;
  const [selectedCode, setSelectedkey] = useState("Daypart");
  const [error, setError] = useState("");

  const keycodes = useSelector(selectKeycodes);
  const softkeys = useSelector(selectSoftKeys);

  const formattedKeycodes =
    keycodes && keycodes.length > 0
      ? keycodes.map(({ code, name }) => ({ id: code, code, name }))
      : [];
  const formattedSoftkeys =
    softkeys && softkeys.length > 0
      ? softkeys.map(({ physicalCode: code, name }) => ({
          id: code,
          code,
          name,
        }))
      : [];

  const groupedCodeItems: GroupedCodeItems[] = [
    { label: "Soft Keys", options: formattedSoftkeys },
    { label: "Key Codes", options: formattedKeycodes },
  ];

  const handleSelect = (item: Keycode) => {
    setSelectedkey(item.name);
  };
  // STATES
  const [element, setElement] = useState(areaData);

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
        {groupedCodeItems.every(
          (group) => group && group.options.every((option) => option)
        ) && (
          <SearchableDropdown
            label="Key or Code"
            items={groupedCodeItems}
            itemRenderer={(codeItem: Keycode) => (
              <>
                <div>{codeItem.name}</div>
              </>
            )}
            onSelect={handleSelect}
            isGroup={true}
            placeholder="Soft Key or Key Code"
          ></SearchableDropdown>
        )}
      </div>
    </div>
  );
}
