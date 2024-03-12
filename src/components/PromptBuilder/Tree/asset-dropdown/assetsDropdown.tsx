import { useContext, useEffect, useState } from "react";
import isSequoiaDevice, {
  find,
  generateRandomString,
  getAsset,
} from "../../../../services/promptsetService";
import {
  Assignment,
  Elements,
  TouchMapAreas,
} from "../../../../models/promptset.modal";
import {
  AREA,
  BG,
  ICON,
  IMAGE,
  INPUT,
  TEXT,
  TOUCH_MASK,
  TYPE,
  VIDEO,
} from "../../../../constants/promptSetConstants";
import { useDispatch, useSelector } from "react-redux";
import { PromptSetRootState } from "../promptTree";
import { AppDispatch } from "../../../../redux/store";
import {
  addElementToAssignment,
  addNewAreaToTouchMap,
  addNewTouchMap,
  updateInputElement,
} from "../../../../redux/reducers/promptsetSlice";
import { promptSetContext } from "../../../../hooks/promptsetContext";
import { Modal } from "react-bootstrap";
import MediaModal from "../../modals/media-modal/mediaModal";
import { Asset } from "../../../../models/media.modal";
import { setClickOutside } from "../../../../constants/clickOutside";
import SelectTouchMask from "../../modals/touch-mask-modal/selectTouchMask";
import { TouchMask } from "../../../../models/touchMask.modal";

interface AssetsDropdownProps {
  childState: Assignment;
}

interface NewElement {
  id: string;
  type: string;
  value: string;
  top: number;
  left: number;
  color: string;
  face: string;
  bold: boolean;
  italic: boolean;
  width: number;
  textAlign: string;
  size?: number;
}

export default function AssetsDropdown(props: AssetsDropdownProps) {
  const { childState } = props;

  // STATES
  const [assets, setAssets] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [showTouchMask, setShowTouchMask] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset>({} as Asset);

  // SELECTORS
  const { deviceType, screenWidth, fontColor } = useSelector(
    (state: PromptSetRootState) => state.promptset.data,
  );

  // CONTEXT API
  const { setActiveElementId, setActiveControlType, promptSetData } =
    useContext(promptSetContext);

  // EFFECTS
  useEffect(() => {
    fetchAssets();
  }, []);

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  const handleShow = () => {
    setClickOutside(true);
    setShow(true);
  };

  const handleClose = () => {
    setClickOutside(false);
    setShow(false);
  };

  const handleAsset = (asset: Asset) => {
    setShow(false);
    setSelectedAsset(asset);

    console.log(asset, "AAASSSSEEEETTTTT");

    const MediaElement: Elements = {
      id: generateRandomString(10),
      type: asset.type.toLowerCase(),
      value: asset.id,
      top: 100,
      left: 100,
      name: asset.name,
      width: asset.width || undefined,
      height: asset.height || undefined,
      size: asset.size,
    };
    dispatch(
      addElementToAssignment({
        assignmentId: childState.id,
        newElement: MediaElement,
      }),
    );
    setActiveElementId(MediaElement.id);
    setActiveControlType(asset.type);
  };

  const handleShowTouchMask = () => {
    setClickOutside(true);
    setShowTouchMask(true);
  };

  const handleCloseTouchMask = () => {
    setClickOutside(false);
    setShowTouchMask(false);
  };

  const handleTouchMask = (touchMask: TouchMask | null) => {
    setShowTouchMask(false);
    console.log(touchMask, "TTTOOOCCCHHHHH");
    if (touchMask) {
      dispatch(
        addNewTouchMap({ assignmentId: childState.id, newTouchMap: touchMask }),
      );
    } else {
      //Create new touch mask
    }
  };

  function fetchAssets() {
    setAssets(["text", "image", "video", "input"]);
    const touchMask = !!childState.touchmap;
    const bg = find(childState.elements, "bg");

    if (isSequoiaDevice("G7-100-8") && touchMask)
      setAssets((prevAssets) => [...prevAssets, "area"]);
    else if (isSequoiaDevice("G7-100") && !touchMask)
      setAssets((prevAssets) => [...prevAssets, "touchmask"]);
    if (!bg?.lock) setAssets((prevAssets) => ["bg", ...prevAssets]);
  }

  function handleAdd(childState: Assignment, type: string) {
    // TODO: Check from languages data
    // const isNoMultiLanguagePromptSet = companyLanguages.length === 0;
    const isMultiLanguagePromptSet = true;

    if (type === BG) {
      let element = childState.elements.find((element) => element.type === BG);
      if (element) {
        element = { ...element, lock: true };
        dispatch(
          updateInputElement({
            assignmentId: childState.id,
            newElement: element,
          }),
        );
        setActiveElementId(element.id);
        setActiveControlType(BG);
      }
    }
    if (type === TEXT) {
      const textElement: NewElement = {
        id: generateRandomString(10),
        type: "text",
        value: "Your text goes here",
        top: 100,
        left: screenWidth / 2,
        color: fontColor,
        face: "",
        bold: false,
        italic: false,
        width: 200,
        textAlign: isSequoiaDevice(deviceType) ? "center" : "",
      };
      if (isMultiLanguagePromptSet) {
        if (isSequoiaDevice(deviceType)) {
          textElement.size = 48;
          textElement.face = "Liberation Sans";
        } else if (deviceType === "G6-200") {
          textElement.size = 24;
          textElement.face = "FreeSans";
        }
      } else if (!isMultiLanguagePromptSet) {
        textElement.size = 48;
        textElement.face = "Liberation Sans";
      }
      dispatch(
        addElementToAssignment({
          assignmentId: childState.id,
          newElement: textElement,
        }),
      );
      setActiveElementId(textElement.id);
      setActiveControlType(TEXT);
    }
    if (type === INPUT) {
      const inputElement: NewElement = {
        id: generateRandomString(10),
        type: "input",
        value: "????",
        top: 100,
        left: screenWidth / 2,
        color: fontColor,
        face: "",
        bold: false,
        italic: false,
        width: 200,
        textAlign: isSequoiaDevice(deviceType) ? "center" : "",
      };
      if (isMultiLanguagePromptSet) {
        if (isSequoiaDevice(deviceType)) {
          inputElement.size = 48;
          inputElement.face = "Liberation Sans";
        } else if (deviceType === "G6-200") {
          inputElement.size = 24;
          inputElement.face = "FreeSans";
        }
      } else if (!isMultiLanguagePromptSet) {
        inputElement.size = 48;
        inputElement.face = "Liberation Sans";
      }
      dispatch(
        addElementToAssignment({
          assignmentId: childState.id,
          newElement: inputElement,
        }),
      );
      setActiveElementId(inputElement.id);
      setActiveControlType(INPUT);
    }
    if (type === IMAGE || type === VIDEO) {
      handleShow();
      setSelectedAssetType(type);
    }
    if (type === TOUCH_MASK) {
      handleShowTouchMask();
    }
    if (type === AREA) {
      const areaElement: TouchMapAreas = {
        id: generateRandomString(10),
        type: "area",
        shape: "rect",
        coords: "0,0,100,50",
        name: "map" + 1,
        alt: "map" + 1,
      };
      dispatch(
        addNewAreaToTouchMap({
          assignmentId: childState.id,
          newArea: areaElement,
        }),
      );
      setActiveElementId(areaElement.id);
      setActiveControlType(AREA);
    }
  }

  return (
    <>
      {assets.map((asset: string, index: number) => {
        return (
          <div
            key={index}
            className="asset-item"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd(childState, getAsset(asset, TYPE));
            }}
          >
            <div className="dropdown-icon">
              <i className={getAsset(asset, ICON)}></i>
            </div>
            <div className="dropdown-text">{getAsset(asset, TEXT)}</div>
          </div>
        );
      })}
      <Modal show={show} onHide={handleClose} className="media-modal" size="xl">
        <MediaModal
          hide={handleClose}
          onAssetSelection={handleAsset}
          type={selectedAssetType}
        ></MediaModal>
      </Modal>
      <Modal show={showTouchMask} onHide={handleCloseTouchMask} size="sm">
        <SelectTouchMask
          hide={handleCloseTouchMask}
          onTouchMaskSelection={handleTouchMask}
        ></SelectTouchMask>
      </Modal>
    </>
  );
}
