import { useState } from "react";
import "./backgroundPicker.scss";
import ColorPicker from "../../PromptBuilder/modals/color-picker/colorPicker";
import { getBaseUrl } from "../../../constants/app";
import { Modal } from "react-bootstrap";
import MediaModal from "../../PromptBuilder/modals/media-modal/mediaModal";

interface BackgroundPickerProps {
  value: string;
  setValue: (value: string) => void;
}

function BackgroundPicker({ value, setValue }: BackgroundPickerProps) {
  const [bgColor, setBgColor] = useState("000000");
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const generateImgURL = () => {
    return `url(${getBaseUrl()}/v1/media/assets/${value}/source)`;
  };

  const updateColor = (color: string) => {
    if (color === bgColor && value === color) return;
    setValue(color);
  };
  return (
    <div className="ics-bg-picker">
      <div className="selected-bg" onClick={(e) => e.stopPropagation()}>
        {value.length > 6 ? (
          <div
            className="image"
            style={{ backgroundImage: generateImgURL() }}
          ></div>
        ) : (
          <div className="color" style={{ backgroundColor: "#" + value }}></div>
        )}
      </div>
      <div className="select-bg">
        <div
          className="image"
          onClick={(e) => {
            handleShow();
            e.stopPropagation();
          }}
        >
          <Modal show={show} onHide={handleClose} className="media-modal" size="lg">
            <MediaModal hide={handleClose}></MediaModal>
          </Modal>
          <i className="fa fa-picture-o" aria-hidden="true"></i>
        </div>
        <div className="color" onClick={(e) => e.stopPropagation()}>
          <i className="fa fa-paint-brush" aria-hidden="true"></i>
          <ColorPicker value={bgColor} onChange={updateColor} />
        </div>
      </div>
    </div>
  );
}

export default BackgroundPicker;
