import "./prompt-area-control.scss";
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";
import {PromptSetInterface, TouchMapAreas} from "../../../../models/promptset.modal";
import {useContext, useEffect, useState} from "react";
import SearchableDropdown from "../../../common/searchable-dropdown/searchableDropdown";
import {useDispatch, useSelector} from "react-redux";
import {Keycode} from "../../../../models/keycode.modal";

import {selectKeycodes} from "../../../../redux/selectors/keycodeSelectors";
import {selectSoftKeys} from "../../../../redux/selectors/softkeySelectors";
import {AppDispatch} from "../../../../redux/store";
import {updateTouchMap} from "../../../../redux/reducers/promptsetSlice";
import {promptSetContext} from "../../../../hooks/promptsetContext";
import {PromptSetRootState} from "../../Tree/promptTree";
import {useReadOnly} from "../../../../hooks/readOnly";

interface TouchMapAreaProp {
  areaData: TouchMapAreas;
}
interface GroupedCodeItems {
  label: string;
  options: Keycode[];
}

export function AreaControl(props: TouchMapAreaProp) {
  const { areaData } = props;
  // STATES
  const [area, setArea] = useState(areaData);
  const [selectedCode, setSelectedCode] = useState(
    area?.softkeyName || area?.keyCodeName
  );

  // CONTEXT API
    const { activePromptEditorId } = useContext(promptSetContext);

  //   HOOKS
  const readOnly = useReadOnly();

  //   SELECTORS
  const promptsetData: PromptSetInterface = useSelector((state: PromptSetRootState) => state.promptset.data);

  useEffect(() => {
    setArea(areaData);
  }, [promptsetData]);

  const keycodes = useSelector(selectKeycodes).map(({ code, name }) => ({
    id: code,
    code,
    name,
  }));
  const softkeys = useSelector(selectSoftKeys).map(
    ({ physicalCode: code, name }) => ({
      id: code,
      code,
      name,
    })
  );

  const groupedCodeItems: GroupedCodeItems[] = [
    { label: "Soft Keys", options: softkeys },
    { label: "Key Codes", options: keycodes },
  ];

  const handleSelect = (item: Keycode) => {
    setSelectedCode(item.name);
    const selectedKeyCode = keycodes.find(
      (keycode) => keycode.name === item.name
    );
    const selectedSoftKey = softkeys.find(
      (softkey) => softkey.name === item.name
    );
    if (selectedKeyCode) {
      const { softkeyId, softkeyName, ...rest } = area;
      setArea({
        ...rest,
        keyCode: selectedKeyCode.code,
        keyCodeName: selectedKeyCode.name,
      });
        onChangeInputArea({
        ...rest,
        keyCode: selectedKeyCode.code,
        keyCodeName: selectedKeyCode.name,
      });
    }
    if (selectedSoftKey) {
      const { keyCode, keyCodeName, ...rest } = area;
      setArea({
        ...rest,
        softkeyId: selectedSoftKey.id,
        softkeyName: selectedSoftKey.name,
      });
        onChangeInputArea({
        ...rest,
        softkeyId: selectedSoftKey.id,
        softkeyName: selectedSoftKey.name,
      });
    }
  };

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  function onChangeInputArea(area: TouchMapAreas) {
    dispatch(updateTouchMap({area, activePromptEditorId}));
  }



  return (
    <div className="ics-prompt-builder-area-controls d-flex-row">

      {!readOnly ?
          <>
        <div className="ics-inline-115-block">
          <label>Type</label>
          <div className="area-controls d-flex-row">
            <div
                onClick={() => {
                  setArea({...area, shape: "rect"});
                  onChangeInputArea({...area, shape: "rect"});
                }}
                className={`shape rectangle ${
                    area.shape === "rect" ? "selected" : ""
                } `}
            ></div>
            <div
                onClick={() => {
                  setArea({...area, shape: "circle"});
                  onChangeInputArea({...area, shape: "circle"});
                }}
                className={`shape circle ${
                    area.shape === "circle" ? "selected" : ""
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
                  value={(area.coords?.split(",") ?? [""])[0]}
                  onChange={(e) => {
                    const updatedArea = {
                      ...area,
                      coords: `${e.target.value},${area.coords
                          .split(",")
                          .slice(1)
                          .join(",")}`,
                    };
                    setArea(updatedArea);
                    onChangeInputArea(updatedArea);
                  }}
                  className="ics-input dimension-input"
              />
            </div>

            <div className="d-flex-row dimension-control">
              <label>Y</label>
              <input
                  type="number"
                  min={0}
                  value={(area.coords?.split(",") ?? [""])[1]}
                  onChange={(e) => {
                    const updatedArea = {
                      ...area,
                      coords: `${area.coords.split(",")[0]},${
                          e.target.value
                      },${area.coords.split(",").slice(2).join(",")}`,
                    };
                    setArea(updatedArea);
                    onChangeInputArea(updatedArea);
                  }}
                  className="ics-input dimension-input"
              />
            </div>

            <div className="d-flex-row dimension-control">
              <label>W</label>
              <input
                  type="number"
                  min={0}
                  value={(area.coords?.split(",") ?? [""])[2]}
                  onChange={(e) => {
                    const updatedArea = {
                      ...area,
                      coords: `${area.coords.split(",").slice(0, 2)},${
                          e.target.value
                      },${area.coords.split(",")[3]}`,
                    };
                    setArea(updatedArea);
                    onChangeInputArea(updatedArea);
                  }}
                  className="ics-input dimension-input"
              />
            </div>

            <div className="d-flex-row dimension-control">
              <label>H</label>
              <input
                  type="number"
                  min={0}
                  value={(area.coords?.split(",") ?? [""])[3]}
                  onChange={(e) => {
                    const updatedArea = {
                      ...area,
                      coords: `${area.coords.split(",").slice(0, 3)},${
                          e.target.value
                      }`,
                    };
                    setArea(updatedArea);
                    onChangeInputArea(updatedArea);
                  }}
                  className="ics-input dimension-input"
              />
            </div>
          </div>
        </div>

        <div className="ics-inline-150-block">
          <label>Center shift</label>
          <div className="d-flex-row center-shift">
            <label className="shift-btn">
              <VerticalAlignCenterRoundedIcon className="icon shift-icon-transform-horizontal"/>
            </label>
            <label className="shift-btn">
              <VerticalAlignCenterRoundedIcon className="icon"/>
            </label>
          </div>
        </div>

        <div className="ics-inline-200-block">
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
              selectedCode={selectedCode}
              placeholder="Soft Key or Key Code"
          ></SearchableDropdown>
        </div>
      </>
        : <h4 className="controller-title">Touch Area</h4>
      }


    </div>
  );
}
