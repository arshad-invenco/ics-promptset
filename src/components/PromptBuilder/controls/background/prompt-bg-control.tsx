import './prompt-bg-control.scss'
import {Elements} from "../../../../models/promptset.modal";

interface ElementsProp{
    elementData: Elements
}

export function BackgroundControl(props:ElementsProp) {
    const {elementData} = props;

    console.log(elementData, 'props BG')
    return (
        <div className="ics-prompt-builder-bg-control">
            <div className="ics-inline-85-block">
                <label>Background</label>
                <button className="ics-btn-primary">Update</button>
            </div>
        </div>
    )
}