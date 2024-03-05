import "./promptSetMetaData.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { PromptSetInterface } from "../../../models/promptset.modal";
import { useSelector } from "react-redux";
import { PromptSetRootState } from "../Tree/promptTree";
import { getDateAndTime } from "../../../services/promptsetService";
import {
  getClickOutside,
  setClickOutside,
} from "../../../constants/clickOutside";
import BackgroundPicker from "../../common/background-picker/backgroundPicker";
import { Modal } from "react-bootstrap";
import EditLanguageModal from "../modals/edit-language-modal/editLanguage";
import { promptSetContext } from "../../../hooks/promptsetContext";
import {
  createModalInfo,
  languageKeysSet,
  setLangModalViewItems,
} from "../../../constants/language";
import ColorPickerModal from "../modals/color-picker-modal/colorPicker";
import UpdateFontColor from "../modals/color-picker-modal/update-font-color-modal/updateFontColor";

export default function PromptSetMetaData() {
  // STATES
  const [open, setDropdownStatus] = useState(false);
  const [value, setValue] = useState("#000000");
  const [showEditLanguage, setShowEditLanguage] = useState(false);
  const [colorShow, setColorShow] = useState(false);
  const [showUpdateFontModal, setShowUpdateFontModal] = useState(false);
  const [newFontColor, setNewFontColor] = useState("");

  // REF
  const bgPickerRef = useRef<HTMLDivElement>(null);

  // SELECTORS
  const promptsetData: PromptSetInterface = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );

    // CONTEXT_API
    const {
        setGridViewState, gridViewState, setShowPlaylistState, showPlaylistState, lastModified
    } = useContext(promptSetContext);

  function handleDropdown() {
    setDropdownStatus(!open);
    if (open) setClickOutside(true);
    else setClickOutside(false);
  }

  const handleEditLanguageShow = () => {
    setLangModalViewItems([]);
    createModalInfo();
    setShowEditLanguage(true);
  };

  const handleEditLanguageClose = () => {
    setShowEditLanguage(false);
  };

  const handleColorShow = () => {
    setColorShow(true);
  };

  const handleColorClose = () => {
    setColorShow(false);
  };

  const updateColor = (color: string) => {
    setNewFontColor(color);
    setShowUpdateFontModal(true);
  };

  const handleUpdateFontModalClose = () => {
    setShowUpdateFontModal(false);
  };

  const handleNewFontColor = (update: boolean) => {
    setShowUpdateFontModal(false);
    if (newFontColor) {
      // promptsetData.fontColor = newFontColor;
    }
  };

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
    }, [lastModified]);

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
            <p className="margin-0">
                {lastModified?.modifiedBy?.name ? lastModified.modifiedBy.name : promptsetData?.modifiedBy?.name}
            </p>
            <p className="meta-container-small-text margin-0">
                {lastModified?.modifiedBy?.email ? lastModified.modifiedBy.email : promptsetData?.modifiedBy?.email}
            </p>
        </div>

        <div className="ics-prompt-builder-meta-container">
            <p className="meta-container-title">Modified at</p>
            <p className="margin-0">{
                lastModified?.modified ? getDateAndTime(lastModified.modified) : getDateAndTime(promptsetData?.modified)
            }</p>
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
          <button
            className="btn btn-primary meta-button"
            onClick={handleColorShow}
          >
            Font Color
          </button>
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
          <Modal
            show={colorShow}
            onHide={handleColorClose}
            className="color-modal"
            size="sm"
            centered
            backdrop="static"
          >
            <ColorPickerModal
              value={promptsetData?.fontColor || "#000000"}
              onChange={updateColor}
              hide={handleColorClose}
            />
          </Modal>
          <Modal
            show={showUpdateFontModal}
            onHide={handleUpdateFontModalClose}
            size="sm"
            backdrop="static"
          >
            <UpdateFontColor value={newFontColor} onUpdateFontColor={handleNewFontColor} />
          </Modal>
        </div>
      </div>

      <div className="ics-prompt-builder-meta-container">
        <p className="meta-container-title">Languages and default fonts</p>

            {languageKeysSet.map((isoCode: any, index: number) => {
                return (<div key={index} className="row small">
                    <div className="col-md-4">
                        {promptsetData?.lang[isoCode].language}
                        <span>
                  {promptsetData?.lang[isoCode].promptSetLanguageSupport.default ? " (default)" : ""}
                </span>
                    </div>
                    <div className="col-md-6">
                        {promptsetData.lang[isoCode].promptSetLanguageSupport.type || ""}
                    </div>
                    <div className="col-md-2">
                        {promptsetData.lang[isoCode].promptSetLanguageSupport.size || ""}
                    </div>
                </div>);
            })}
            <button
                className="btn btn-primary meta-button"
                onClick={handleEditLanguageShow}
            >
                Edit
            </button>
            <Modal
                show={showEditLanguage}
                onHide={handleEditLanguageClose}
                size="lg"
            >
                <EditLanguageModal hide={handleEditLanguageClose}/>
            </Modal>
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
                <button onClick={() => {
                    setGridViewState(!gridViewState);
                }} className={`btn btn-primary ${gridViewState ? 'isActive' : ''}`}>
                    <i className="fas fa-th"></i>
                </button>
                <button
                    onClick={() => {
                        setShowPlaylistState(!showPlaylistState);
                    }}
                    className={`btn btn-primary ${showPlaylistState ? 'isActive' : ''}`}>
                    <i className="fas fa-play-circle"></i>
                </button>
            </div>
        </div>
    </div>);
}
