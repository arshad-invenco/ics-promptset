import React from "react";
import "./prompt-image-control.scss";
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";
import {
  Elements,
  PromptSetInterface,
} from "../../../../models/promptset.modal";
import { useContext, useEffect, useState } from "react";
import { AppDispatch } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { updateInputElement } from "../../../../redux/reducers/promptsetSlice";
import { getBaseUrl } from "../../../../constants/app";
import { PromptSetRootState } from "../../Tree/promptTree";
import { promptSetContext } from "../../../../hooks/promptsetContext";
import { useReadOnly } from "../../../../hooks/readOnly";
import { Modal } from "react-bootstrap";
import MediaModal from "../../modals/media-modal/mediaModal";
import { IMAGE } from "../../../../constants/promptSetConstants";
import { Asset } from "../../../../models/media.modal";

interface ElementsProp {
  elementData: Elements;
}

export function ImageControl(props: ElementsProp) {
  const { elementData } = props;

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  // STATES
  const [element, setElement] = useState(elementData);
  const [bgShow, setBgShow] = useState(false);
  const [value, setValue] = useState(elementData.value);

  // CONTEXT API
  const { activePromptEditorId } = useContext(promptSetContext);

  //   HOOKS
  const readOnly = useReadOnly();

  // SELECTORS
  const promptsetData: PromptSetInterface = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );

  const handleBgShow = () => {
    setBgShow(true);
  };

  const handleBgClose = () => {
    setBgShow(false);
  };

  useEffect(() => {
    setElement(elementData);
  }, [promptsetData]);

  function onChangeInput(element: Elements) {
    dispatch(
      updateInputElement({
        assignmentId: activePromptEditorId,
        newElement: element,
      })
    );
  }

  const handleAsset = (asset: Asset) => {
    setValue(asset.id);
    setBgShow(false);
  };

  const generateImgURL = () => {
    return `url(${getBaseUrl()}/media/assets/${value}/source)`;
  };

  return (
    <div className="ics-prompt-builder-image-controls d-flex-row">
      {!readOnly ? (
        <>
          <div className="col-md-1">
            <label>Image</label>
            <div
              className="image-preview"
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
                type={IMAGE}
              ></MediaModal>
            </Modal>
          </div>

          <div className="d-flex-col dimensions">
            <label>Dimensions</label>
            <div className="co-ordinates d-flex-row">
              <div className="d-flex-row dimension-control">
                <label>X</label>
                <input
                  type="number"
                  value={element.left}
                  onChange={(e) => {
                    const updatedElement = {
                      ...element,
                      left: Number(e.target.value),
                    };
                    setElement(updatedElement);
                    onChangeInput(updatedElement);
                  }}
                  min={0}
                  className="ics-input-react dimension-input"
                />
              </div>

              <div className="d-flex-row dimension-control">
                <label>Y</label>
                <input
                  type="number"
                  value={element.top}
                  onChange={(e) => {
                    const updatedElement = {
                      ...element,
                      top: Number(e.target.value),
                    };
                    setElement(updatedElement);
                    onChangeInput(updatedElement);
                  }}
                  min={0}
                  max={promptsetData.screenHeight - (element?.height || 0)}
                  className="ics-input-react dimension-input"
                />
              </div>

              <div className="d-flex-row dimension-control disabled-control">
                <label>W</label>
                <input
                  type="number"
                  value={element.width}
                  onChange={(e) => {
                    const updatedElement = {
                      ...element,
                      width: Number(e.target.value),
                    };
                    setElement(updatedElement);
                    onChangeInput(updatedElement);
                  }}
                  min={0}
                  className="ics-input-react dimension-input"
                />
              </div>

              <div className="d-flex-row dimension-control disabled-control">
                <label>H</label>
                <input
                  type="number"
                  value={element.height}
                  onChange={(e) => {
                    const updatedElement = {
                      ...element,
                      height: Number(e.target.value),
                    };
                    setElement(updatedElement);
                    onChangeInput(updatedElement);
                  }}
                  min={0}
                  className="ics-input-react dimension-input"
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

          {element.userclass && (
            <div className="ics-inline-200-block">
              <label>Classes</label>
              <input type="text" className="ics-input-react" />
            </div>
          )}
        </>
      ) : (
        <h4 className="controller-title">Image</h4>
      )}
    </div>
  );
}
