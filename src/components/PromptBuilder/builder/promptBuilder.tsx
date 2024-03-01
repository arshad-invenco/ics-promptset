import './promptBuilder.scss'
import {getDeviceType} from "../../../constants/deviceType";
import InputSVG from "./input";
import {useEffect} from "react";
import {PromptSetInterface} from "../../../models/promptset.modal";
import {useSelector} from "react-redux";
import {PromptSetRootState} from "../Tree/promptTree";

export default function PromptBuilder(){
    // SNAP
    let s = null;

    // HOOKS
    const deviceType = getDeviceType();

    // SELECTORS
    const promptsetData: PromptSetInterface = useSelector(
        (state: PromptSetRootState) => state.promptset.data
    );


    useEffect(() => {
    }, [promptsetData]);

    return(
        <div className="ics-prompt-builder-preview-wrapper prompt-builder-size">
            <div className={"soft-keys-left soft-keys"}>
            </div>

            <div className={`ics-prompt-builder-preview-container ${deviceType}`}>
                <div className="ics-prompt-builder">
                    <InputSVG color={promptsetData.bg} screenWidth={promptsetData.screenWidth}
                              screenHeight={promptsetData.screenHeight}/>
                </div>
            </div>

            <div className={"soft-keys-right soft-keys"}>

            </div>
        </div>
    )
}