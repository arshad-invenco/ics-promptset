import Controllers from "../../components/PromptBuilder/controls/controllers";
import PromptBuilder from "../../components/PromptBuilder/builder/promptBuilder";
import PromptSetMetaData from "../../components/PromptBuilder/meta-data/promptSetMetaData";
import {getDeviceType} from "../../constants/deviceType";


export function PromptSetEditor() {
    const deviceType=getDeviceType();
    return (
        // Width ACC to DeviceType
        <div className={`right-container ${deviceType}`}>
            <Controllers />
            <div className="prompt-set-preview-area">
                <PromptBuilder />
                <PromptSetMetaData/>
            </div>
        </div>
    )
}