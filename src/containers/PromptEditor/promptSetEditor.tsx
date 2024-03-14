import React from "react";
import Controllers from "../../components/PromptBuilder/controls/controllers";
import PromptPreviewArea from "../../components/PromptBuilder/builder/promptPreviewArea";
import PromptSetMetaData from "../../components/PromptBuilder/meta-data/promptSetMetaData";
import {getDeviceType} from "../../constants/deviceType";


export function PromptSetEditor() {
    const deviceType=getDeviceType();




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