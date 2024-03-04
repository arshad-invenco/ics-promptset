import './prompt-image-control.scss'
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";
import {Elements} from "../../../../models/promptset.modal";
import {useState} from "react";
import {debounce} from "@mui/material";
import {AppDispatch} from "../../../../redux/store";
import {useDispatch} from "react-redux";
import {updateInputElement} from "../../../../redux/reducers/promptsetSlice";
import {getBaseUrl} from "../../../../constants/app";

interface ElementsProp {
    elementData: Elements
}

export function ImageControl(props: ElementsProp) {
    const {elementData} = props;

    // REDUX
    const dispatch = useDispatch<AppDispatch>();

    // STATES
    const [element, setElement] = useState(elementData);

    function onChangeInput(element: Elements) {
        dispatch(updateInputElement(element));
    }

    const generateImgURL = (value:string) => {
        return `url(${getBaseUrl()}/media/assets/${value}/source)`;
    };

    // DEBOUNCE
    const debouncedOnChangeInput = debounce(onChangeInput, 1000);

    return (
        <div className="ics-prompt-builder-image-controls d-flex-row">
            <div className="col-md-1">
                <label>Image</label>
                <div className="image-preview"
                     style={{backgroundImage: generateImgURL(element.value),
                         backgroundPosition: 'center',
                         backgroundRepeat: 'no-repeat',
                         backgroundSize: 'contain'}}
                >
                </div>
            </div>

            <div className="d-flex-col dimensions">
                <label>Dimensions</label>
                <div className="co-ordinates d-flex-row">
                    <div className="d-flex-row dimension-control">
                        <label>X</label>
                        <input type="number"
                               value={element.left}
                               onChange={(e) => {
                                   const updatedElement = {...element, left: (Number)(e.target.value)};
                                   setElement(updatedElement);
                                   debouncedOnChangeInput(updatedElement);
                               }}
                               min={0} className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control">
                        <label>Y</label>
                        <input type="number"
                               value={element.top}
                               onChange={(e) => {
                                   const updatedElement = {...element, top: (Number)(e.target.value)};
                                   setElement(updatedElement);
                                   onChangeInput(updatedElement);
                               }}
                               min={0} className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control disabled-control">
                        <label>W</label>
                        <input type="number"
                               value={element.width}
                               onChange={(e) => {
                                   const updatedElement = {...element, width: (Number)(e.target.value)};
                                   setElement(updatedElement);
                                   onChangeInput(updatedElement);
                               }}
                               min={0} className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control disabled-control">
                        <label>H</label>
                        <input type="number"
                               value={element.height}
                               onChange={(e) => {
                                   const updatedElement = {...element, height: (Number)(e.target.value)};
                                   setElement(updatedElement);
                                   onChangeInput(updatedElement);
                               }}
                               min={0} className="ics-input dimension-input"/>
                    </div>
                </div>
            </div>


            <div className="ics-inline-150-block">
                <label>Center shift</label>
                <div className="d-flex-row center-shift">
                    <label className="shift-btn">
                        <VerticalAlignCenterRoundedIcon className="icon shift-icon-transform-horizontal"/>
                    </label>
                    <label className="shift-btn">
                        <VerticalAlignCenterRoundedIcon className="icon"/>
                    </label>
                </div>
            </div>

            {element.userclass &&
                <div className="ics-inline-200-block">
                    <label>Classes</label>
                    <input type="text" className="ics-input"/>
                </div>
            }
        </div>
    )
}