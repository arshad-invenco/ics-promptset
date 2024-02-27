import './prompt-video-control.scss'
import {Elements} from "../../../../models/promptset.modal";
import {useState} from "react";

interface ElementsProp{
    elementData: Elements
}

export function VideoControl(props:ElementsProp){
    const {elementData} = props;

    // STATES
    const [element, setElement] = useState(elementData);

    return(
        <div className="ics-video-builder-video-controls">
            <div className="col-md-1">
                <label>Video</label>
                <div className="video-preview">
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