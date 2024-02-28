import "./prompt-bg-control.scss";
import { Elements } from "../../../../models/promptset.modal";
import { useState } from "react";
import BackgroundPicker from "../../../common/background-picker/backgroundPicker";

interface ElementsProp {
  elementData: Elements;
}

export function BackgroundControl(props: ElementsProp) {
  const { elementData } = props;
  const [open, setDropdownStatus] = useState(false);
  const [value, setValue] = useState(elementData.value);

  function handleDropdown() {
    setDropdownStatus(!open);
  }

  return (
    <div className="ics-prompt-builder-bg-control">
      <div className="ics-inline-85-block">
        <label>Background</label>
        <button className="btn btn-primary" onClick={handleDropdown}>
          Update
        </button>
        {open && <BackgroundPicker value={value} setValue={setValue} />}
      </div>
    </div>
  );
}
