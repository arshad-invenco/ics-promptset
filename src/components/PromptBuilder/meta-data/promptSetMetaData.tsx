import "./promptSetMetaData.scss";
import { useEffect, useRef, useState } from "react";
import { PromptSetInterface } from "../../../models/promptset.modal";
import { useSelector } from "react-redux";
import { PromptSetRootState } from "../Tree/promptTree";
import { getDateAndTime } from "../../../services/promptsetService";
import {
  getClickOutside,
  setClickOutside,
} from "../../../constants/clickOutside";
import BackgroundPicker from "../../common/background-picker/backgroundPicker";

export default function PromptSetMetaData() {
  const [open, setDropdownStatus] = useState(false);
  const [value, setValue] = useState("#000000");
  const bgPickerRef = useRef<HTMLDivElement>(null);

  const promptsetData: PromptSetInterface = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );

  function handleDropdown() {
    setDropdownStatus(!open);
    if (open) setClickOutside(true);
    else setClickOutside(false);
  }


  const handleClickOutside = (event: MouseEvent) => {
    if (
      bgPickerRef.current &&
      !bgPickerRef.current.contains(event.target as Node) &&
      !getClickOutside()
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
    <div className={"ics-prompt-builder-metadata"}>
      <div className="ics-prompt-builder-meta-container">
        <p className="meta-container-title">Created by</p>
        <p className="margin-0">{promptsetData?.createdBy?.name}</p>
        <p className="meta-container-small-text margin-0">
          {promptsetData?.createdBy?.email}
        </p>
      </div>

      <div className="ics-prompt-builder-meta-container">
        <p className="meta-container-title">Created at</p>
        <p className="margin-0">{getDateAndTime(promptsetData?.created)}</p>
      </div>

      <div className="ics-prompt-builder-meta-container">
        <p className="meta-container-title">Last modified by</p>
        <p className="margin-0">{promptsetData?.modifiedBy?.name}</p>
        <p className="meta-container-small-text margin-0">
          {promptsetData?.modifiedBy?.email}
        </p>
      </div>

      <div className="ics-prompt-builder-meta-container">
        <p className="meta-container-title">Template</p>
        <p className="margin-0">{promptsetData?.template?.name}</p>
      </div>

      <div className="ics-prompt-builder-meta-container">
        <p className="meta-container-title">Version</p>
        <p className="margin-0">{promptsetData?.version}</p>
      </div>

      <div className="ics-prompt-builder-meta-container">
        <p className="meta-container-title">Default colors</p>
        <div className="d-flex-row meta-buttons-container">
          <button className="btn btn-primary meta-button">Font Color</button>
          <div ref={bgPickerRef}>
            <button
              onClick={handleDropdown}
              className="btn btn-primary meta-button"
            >
              Background
              {open ? (
                <i className="fas fa-chevron-circle-up"></i>
              ) : (
                <i className="fas fa-chevron-circle-down"></i>
              )}
            </button>
            {open && <BackgroundPicker value={value} setValue={setValue} />}
          </div>
        </div>
      </div>

      <div className="ics-prompt-builder-meta-container">
        <p className="meta-container-title">Languages and default fonts</p>
        <button className="btn btn-primary meta-button">Edit</button>
      </div>

      <div className="ics-prompt-builder-meta-container">
        <div className="d-flex-row meta-buttons-container">
          <button className="btn btn-primary">
            <i className="fas fa-angle-double-right"></i>
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-expand-arrows-alt"></i>
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-code"></i>
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-th"></i>
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-play-circle"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
