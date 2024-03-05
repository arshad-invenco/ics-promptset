import Controllers from "../../components/PromptBuilder/controls/controllers";
import PromptPreviewArea from "../../components/PromptBuilder/builder/promptPreviewArea";
import PromptSetMetaData from "../../components/PromptBuilder/meta-data/promptSetMetaData";
import {getDeviceType} from "../../constants/deviceType";
import {createContext, useState} from "react";


export function PromptSetEditor() {
    const deviceType=getDeviceType();

    // STATES
    const [isGridView, setIsGridView] = useState(false);

    const promptBuilderContext = createContext({} as any);




    return (
        // Width ACC to DeviceType
        <div className={`right-container ${deviceType}`}>
            <Controllers />
            <div className="prompt-set-preview-area">
                <PromptPreviewArea />
                <PromptSetMetaData/>
            </div>
        </div>
    )
}