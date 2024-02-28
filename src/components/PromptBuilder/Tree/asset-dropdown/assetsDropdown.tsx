import { useEffect, useState } from "react";
import isSequoiaDevice, {
  find,
  generateRandomString,
  getAsset,
} from "../../../../services/promptsetService";
import { Assignment, State } from "../../../../models/promptset.modal";
import { ICON, TEXT, TYPE } from "../../../../constants/promptSetConstants";
import { useDispatch, useSelector } from "react-redux";
import { PromptSetRootState } from "../promptTree";
import { selectPromptSetAssignmentById } from "../../../../redux/selectors/promptSetSelectors";
import { AppDispatch } from "../../../../redux/store";
import { addElementToAssignment } from "../../../../redux/reducers/promptsetSlice";

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
  // if condition
  size?: number;
}

export default function AssetsDropdown(props: AssetsDropdownProps) {
  const { childState } = props;
  // STATES
  const [assets, setAssets] = useState<string[]>([]);

  // SELECTORS
  const { deviceType, screenWidth, fontColor } = useSelector(
    (state: PromptSetRootState) => state.promptset.data
  );

  // EFFECTS
  useEffect(() => {
    fetchAssets();
  }, []);

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

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

    if (type === TEXT) {
      let textElement: NewElement = {
        id: generateRandomString(9),
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
        })
      );
    }
    console.log(childState, "handleAdd", type);
  }

  return (
    <>
      {assets.map((asset: string, index: number) => {
        return (
          <div
            key={index}
            className="asset-item"
            onClick={() => {
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
    </>
  );
}
