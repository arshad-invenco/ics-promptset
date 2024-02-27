import './prompt-image-control.scss'
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";
import {Elements} from "../../../../models/promptset.modal";
import {useState} from "react";

interface ElementsProp {
    elementData: Elements
}

export function ImageControl(props: ElementsProp) {
    const {elementData} = props;

    // STATES
    const [element, setElement] = useState(elementData);

    function onChangeInput(value: string, type: string) {

    }

    return (
        <div className="ics-prompt-builder-image-controls d-flex-row">
            <div className="col-md-1">
                <label>Image</label>
                <div className="image-preview">
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
                                   setElement({...element, left: (Number)(e.target.value)});
                                   onChangeInput(e.target.value, 'left');
                               }}
                               min={0} className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control">
                        <label>Y</label>
                        <input type="number"
                               value={element.top}
                               onChange={(e) => {
                                   setElement({...element, top: (Number)(e.target.value)});
                                   onChangeInput(e.target.value, 'top');
                               }}
                               min={0} className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control disabled-control">
                        <label>W</label>
                        <input type="number"
                               value={element.width}
                               onChange={(e) => {
                                   setElement({...element, width: (Number)(e.target.value)});
                                   onChangeInput(e.target.value, 'width');
                               }}
                               min={0} className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control disabled-control">
                        <label>H</label>
                        <input type="number"
                               value={element.height}
                               onChange={(e) => {
                                   setElement({...element, height: (Number)(e.target.value)});
                                   onChangeInput(e.target.value, 'height');
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