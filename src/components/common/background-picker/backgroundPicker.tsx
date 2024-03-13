import { useEffect, useState } from "react";
import "./backgroundPicker.scss";
import ColorPicker from "../../PromptBuilder/modals/color-picker-modal/colorPicker";
import { getBaseUrl } from "../../../constants/app";
import { Modal } from "react-bootstrap";
import MediaModal from "../../PromptBuilder/modals/media-modal/mediaModal";
import { Asset } from "../../../models/media.modal";
import { IMAGE } from "../../../constants/promptSetConstants";
import {
  getClickOutside,
  setClickOutside,
} from "../../../constants/clickOutside";
import ColorPickerModal from "../../PromptBuilder/modals/color-picker-modal/colorPicker";
import { updateBackground } from "../../../services/metaDataService";

interface BackgroundPickerProps {
  value: string;
  setValue: (value: string) => void;
  handleAssetBackground?: (asset: Asset) => void;
  handleBackgroundColor?: (color: string) => void;
  update?: boolean;
}

function BackgroundPicker({
  value,
  setValue,
  handleAssetBackground,
  handleBackgroundColor,
  update,
}: BackgroundPickerProps) {
  const [bgColor, setBgColor] = useState("#000000");
  const [bgShow, setBgShow] = useState(false);
  const [colorShow, setColorShow] = useState(false);

  const handleBgShow = () => {
    setBgShow(true);
    setClickOutside(true);
  };

  const handleBgClose = () => {
    setBgShow(false);
    setClickOutside(false);
  };

  const handleColorShow = () => {
    setClickOutside(true);
    setColorShow(true);
  };

  const handleColorClose = () => {
    setClickOutside(false);
    setColorShow(false);
  };

  const generateImgURL = () => {
    return `url(${getBaseUrl()}/media/assets/${value}/source)`;
  };

  const updateColor = (color: string) => {
    if (color === bgColor && value === color) return;
    setValue(color);
    setBgColor(color);
    if (handleBackgroundColor) handleBackgroundColor(color);
    if (update) {
      setClickOutside(false);
      updateBackground(color.replace("#", ""));
    }
  };

  const handleAsset = (asset: Asset) => {
    setValue(asset.id);
    setBgShow(false);
    if (handleAssetBackground) handleAssetBackground(asset);
    if (update) {
      setClickOutside(false);
      updateBackground(asset.id);
    }
  };

  return (
    <div className="ics-bg-picker">
      <div className="selected-bg">
        {value.length > 7 ? (
          <div
            className="image"
            style={{ backgroundImage: generateImgURL() }}
          ></div>
        ) : (
          <div className="color" style={{ backgroundColor: value }}></div>
        )}
      </div>
      <div className="select-bg">
        <div className="image" onClick={handleBgShow}>
          <i className="fa fa-picture-o" aria-hidden="true"></i>
        </div>
        <Modal show={bgShow} onHide={handleBgClose} size="xl">
          <MediaModal
            hide={handleBgClose}
            onAssetSelection={handleAsset}
            type={IMAGE}
          ></MediaModal>
        </Modal>
        <div className="color" onClick={handleColorShow}>
          <i className="fa fa-paint-brush" aria-hidden="true"></i>
        </div>
        <Modal
          show={colorShow}
          onHide={handleColorClose}
          className="color-modal"
          size="sm"
          centered
        >
          <ColorPickerModal
            value={bgColor}
            onChange={updateColor}
            hide={handleColorClose}
          />
        </Modal>
      </div>
    </div>
  );
}

export default BackgroundPicker;
