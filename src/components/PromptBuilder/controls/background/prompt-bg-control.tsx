import "./prompt-bg-control.scss";
import {Elements, State} from "../../../../models/promptset.modal";
import React, {useContext, useEffect, useRef, useState} from "react";
import BackgroundPicker from "../../../common/background-picker/backgroundPicker";
import { getClickOutside, setClickOutside } from "../../../../constants/clickOutside";
import {Asset} from "../../../../models/media.modal";
import {useDispatch, useSelector} from "react-redux";
import {PromptSetRootState} from "../../Tree/promptTree";
import {selectPromptSetAssignmentById} from "../../../../redux/selectors/promptSetSelectors";
import {promptSetContext} from "../../../../hooks/promptsetContext";
import {AppDispatch} from "../../../../redux/store";
import {updateBackgroundElement} from "../../../../redux/reducers/promptsetSlice";

interface ElementsProp {
  elementData: Elements;
}

export function BackgroundControl(props: ElementsProp) {
  const { elementData } = props;
  const [open, setDropdownStatus] = useState(false);
  const [value, setValue] = useState(elementData.value);

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  // CONTEXT API
  const {activePromptEditorId} = useContext(promptSetContext);

  // SELECTORS
  const childState = useSelector((state: PromptSetRootState & State[]) => selectPromptSetAssignmentById(state, activePromptEditorId));


  function handleAsset(asset:Asset){
    console.log(asset, "ASSET")
    let newElement = {...elementData, value: asset.id, filename: asset.name, name:asset.name};
    dispatch(updateBackgroundElement({assignmentId:childState?.id, newElement:newElement}));

  }


  function handleColor(color:string) {
    let newElement = {...elementData, value: color.slice(1, color.length)};
    dispatch(updateBackgroundElement({assignmentId:childState?.id, newElement:newElement}));
  }

  function handleDropdown() {
    setDropdownStatus(!open);
    if (open) setClickOutside(true);
    else setClickOutside(false);
  }

  const bgPickerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    
    if (
      bgPickerRef.current &&
      !bgPickerRef.current.contains(event.target as Node)
      && !getClickOutside()
    ) {
      setDropdownStatus(false);
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="ics-prompt-builder-bg-control">
      <div className="ics-inline-85-block" ref={bgPickerRef}>
        <label>Background</label>
        <button disabled={!elementData.lock} className="btn btn-primary" onClick={handleDropdown}>
          Update
        </button>
        {open && <BackgroundPicker handleAssetBackground={handleAsset} value={value} setValue={setValue} handleBackgroundColor={handleColor} />}
      </div>
    </div>
  );
}
