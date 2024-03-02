import "./prompt-bg-control.scss";
import { Elements } from "../../../../models/promptset.modal";
import React, { useEffect, useRef, useState } from "react";
import BackgroundPicker from "../../../common/background-picker/backgroundPicker";
import { getClickOutside, setClickOutside } from "../../../../constants/clickOutside";

interface ElementsProp {
  elementData: Elements;
}

export function BackgroundControl(props: ElementsProp) {
  const { elementData } = props;
  const [open, setDropdownStatus] = useState(false);
  const [value, setValue] = useState(elementData.value);

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
        <button className="btn btn-primary" onClick={handleDropdown}>
          Update
        </button>
        {open && <BackgroundPicker value={value} setValue={setValue} />}
      </div>
    </div>
  );
}
