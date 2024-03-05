import './promptBuilder.scss'
import {getDeviceType} from "../../../constants/deviceType";
import PromptBuilder from "./promptBuilder";
import {useEffect} from "react";
import {PromptSetInterface} from "../../../models/promptset.modal";
import {useSelector} from "react-redux";
import {PromptSetRootState} from "../Tree/promptTree";
import {enableSoftKey, enableSoftKeysBottom} from "../../../services/promptsetService";

export default function PromptPreviewArea() {
    // SNAP
    let s = null;

    // HOOKS
    const deviceType = getDeviceType();

    // SELECTORS
    const promptsetData: PromptSetInterface = useSelector((state: PromptSetRootState) => state.promptset.data);


    useEffect(() => {
    }, [promptsetData]);

    return (<div className="ics-prompt-builder-preview-wrapper prompt-builder-size">

        { enableSoftKey(getDeviceType()) &&
            <div className={"soft-keys-left soft-keys"}>
                <div className="softkey-btn">
                    <button className="soft-key-button">
                        <i className="fa fa-chevron-right"></i>
                    </button>
                    <p className="soft-key-text">Text</p>
                </div>

                <div className="softkey-btn">
                    <button className="soft-key-button">
                        <i className="fa fa-chevron-right"></i>
                    </button>
                    <p className="soft-key-text">Text</p>
                </div>
                <div className="softkey-btn">
                    <button className="soft-key-button">
                        <i className="fa fa-chevron-right"></i>
                    </button>
                    <p className="soft-key-text">Text</p>
                </div>
                <div className="softkey-btn">
                    <button className="soft-key-button">
                        <i className="fa fa-chevron-right"></i>
                    </button>
                    <p className="soft-key-text">Text</p>
                </div>
            </div>
        }

        <div className={`ics-prompt-builder-preview-container ${deviceType}`}>
            <div className="ics-prompt-builder">
                <PromptBuilder color={promptsetData.bg} screenWidth={promptsetData.screenWidth}
                               screenHeight={promptsetData.screenHeight}/>
            </div>
            {enableSoftKeysBottom(getDeviceType()) &&
                <div className="soft-keys-bottom">
                    <div className="soft-key-button-container">
                        <button className="soft-key-button">
                            <i className="fa fa-window-minimize fa-rotate-90"></i>
                        </button>
                        <p className="soft-key-text">Text</p>
                    </div>


                    <div className="soft-key-button-container">
                        <button className="soft-key-button">
                            <i className="fa fa-window-minimize fa-rotate-90"></i>
                        </button>
                        <p className="soft-key-text">Text</p>
                    </div>
                    <div className="soft-key-button-container">
                        <button className="soft-key-button">
                            <i className="fa fa-window-minimize fa-rotate-90"></i>
                        </button>
                        <p className="soft-key-text">Text</p>
                    </div>
                    <div className="soft-key-button-container">
                        <button className="soft-key-button">
                            <i className="fa fa-window-minimize fa-rotate-90"></i>
                        </button>
                        <p className="soft-key-text">Text</p>
                    </div>
                </div>
            }

        </div>

        { enableSoftKey(getDeviceType()) &&
            <div className={"soft-keys-right soft-keys"}>
                <div className="softkey-btn">
                    <button className="soft-key-button">
                        <i className="fa fa-chevron-left"></i>
                    </button>
                    <p className="soft-key-text">Text</p>
                </div>
                <div className="softkey-btn">
                    <button className="soft-key-button">
                        <i className="fa fa-chevron-left"></i>
                    </button>
                    <p className="soft-key-text">Text</p>
                </div>
                <div className="softkey-btn">
                    <button className="soft-key-button">
                        <i className="fa fa-chevron-left"></i>
                    </button>
                    <p className="soft-key-text">Text</p>
                </div>
                <div className="softkey-btn">
                    <button className="soft-key-button">
                        <i className="fa fa-chevron-left"></i>
                    </button>
                    <p className="soft-key-text">Text</p>
                </div>
            </div>
        }

    </div>)
}