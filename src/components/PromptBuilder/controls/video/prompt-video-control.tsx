import './prompt-video-control.scss'
import {Elements} from "../../../../models/promptset.modal";
import {useState} from "react";
import {getBaseUrl} from "../../../../constants/app";
import {useReadOnly} from "../../../../hooks/readOnly";

interface ElementsProp {
    elementData: Elements
}

export function VideoControl(props: ElementsProp) {
    const {elementData} = props;

    // STATES
    const [element, setElement] = useState(elementData);

    //   HOOKS
    const readOnly = useReadOnly();

    const generateImgURL = (value: string) => {
        return `url(${getBaseUrl()}/media/assets/${value}/thumbnail)`;
    };

    return (<div className="ics-video-builder-video-controls">
        {!readOnly ? <>
            <div className="col-md-1">
                <label>Video</label>
                <div className="video-preview"
                     style={{
                         backgroundImage: generateImgURL(element.value),
                         backgroundPosition: 'center',
                         backgroundRepeat: 'no-repeat',
                         backgroundSize: 'contain'
                     }}
                >
                </div>
            </div>

            {element.userclass && <div className="ics-inline-200-block">
                <label>Classes</label>
                <input type="text" className="ics-input"/>
            </div>}
        </> : <h4 className="controller-title">Video</h4>}


    </div>)
}