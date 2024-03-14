import React from "react";
import "./prompt-video-control.scss";
import { Elements } from "../../../../models/promptset.modal";
import { useState } from "react";
import { getBaseUrl } from "../../../../constants/app";
import { useReadOnly } from "../../../../hooks/readOnly";
import { Modal } from "react-bootstrap";
import MediaModal from "../../modals/media-modal/mediaModal";
import { Asset } from "../../../../models/media.modal";
import { VIDEO } from "../../../../constants/promptSetConstants";
import { set } from "snapsvg";

interface ElementsProp {
  elementData: Elements;
}

export function VideoControl(props: ElementsProp) {
  const { elementData } = props;

  // STATES
  const [element, setElement] = useState(elementData);
  const [bgShow, setBgShow] = useState(false);
  const [value, setValue] = useState(elementData.value);

  //   HOOKS
  const readOnly = useReadOnly();

  const handleBgShow = () => {
    setBgShow(true);
  };

  const handleBgClose = () => {
    setBgShow(false);
  };

  const handleAsset = (asset: Asset) => {
    setValue(asset.id);
    setBgShow(false);
  };

  const generateImgURL = () => {
    return `url(${getBaseUrl()}/media/assets/${value}/thumbnail)`;
  };

  return (
    <div className="ics-video-builder-video-controls">
      {!readOnly ? (
        <>
          <div className="col-md-1">
            <label>Video</label>
            <div
              className="video-preview"
              style={{
                backgroundImage: generateImgURL(),
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
              onClick={handleBgShow}
            ></div>
            <Modal show={bgShow} onHide={handleBgClose} size="xl">
              <MediaModal
                hide={handleBgClose}
                onAssetSelection={handleAsset}
                type={VIDEO}
              ></MediaModal>
            </Modal>
          </div>

          {element.userclass && (
            <div className="ics-inline-200-block">
              <label>Classes</label>
              <input type="text" className="ics-input-react" />
            </div>
          )}
        </>
      ) : (
        <h4 className="controller-title">Video</h4>
      )}
    </div>
  );
}
