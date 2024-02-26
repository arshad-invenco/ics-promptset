import './controllers.scss'
import {useSelector} from "react-redux";
import {selectPromptSetAssignmentById, selectPromptSetStateById} from "../../../redux/selectors/promptSetSelectors";
import {useContext} from "react";
import {promptSetContext} from "../../../hooks/promptsetContext";
import {
    AREA,
    BG,
    CHILD_STATE,
    ELEMENTS_LIST,
    EXCEPTION,
    IMAGE,
    INPUT,
    STATE,
    TEXT, VIDEO
} from "../../../constants/promptSetConstants";
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import '../../../style.scss'
import {formatTime} from "../../../hooks/common";
import {TextControl} from "./text/prompt-text-control";
import {BackgroundControl} from "./background/prompt-bg-control";
import {ImageControl} from "./image/prompt-image-control";
import {VideoControl} from "./video/prompt-video-control";
import {AreaControl} from "./area/prompt-area-control";

export default function Controllers(){
    // Context API
    const {activeStateId, activeControlType, activePromptEditorId} = useContext(promptSetContext);

    // SELECTORS
    const state = useSelector((state) => selectPromptSetStateById(state, activeStateId));
    const childState = useSelector((state) => selectPromptSetAssignmentById(state, activePromptEditorId));

    // LOGS
    console.log(state, 'data');
    console.log(activePromptEditorId, 'activeControlType');
    console.log(childState, 'childState');

    function handleTransactionStateChange() {

    }

    function renderActiveControl() {
        switch (activeControlType){
            case BG:
                return <BackgroundControl/>;
            case TEXT:
            case INPUT:
                return <TextControl/>;
            case IMAGE:
                return <ImageControl/>;
            case VIDEO:
                return <VideoControl/>;
            case AREA:
                return <AreaControl/>;
            default :
                return <div>DEFAULT</div>;
        }
    }

    return(
        <div className="ics-prompt-builder-controls">
            {
                activeControlType === STATE ?
                    <div className="state-controller">
                        <p className="code">{state.code}</p>
                        <p className="description">{state.description}</p>
                        <div className="horizontal-border"/>
                        <select className="ics-input transaction-state-dropdown"
                                value={state.transactionState}
                                onChange={handleTransactionStateChange}>
                            <option value="null" selected>Select transaction state</option>
                            <option value="idle" >Idle</option>
                            <option value="fueling">Fueling</option>
                        </select>
                    </div>
                : activeControlType === CHILD_STATE ?
                    <div className="child-state-controller">
                        <p className="title">
                            {childState.type === EXCEPTION && <AccessTimeRoundedIcon className="clock-icon" /> }
                            <p className="code text-capitalize">
                                {childState.dayPart ? childState.dayPart.name : childState.type}
                            </p>
                        </p>
                        {childState.type === EXCEPTION &&
                            <span className="exception-time text-lowercase">
                                ({formatTime(childState.dayPart.start)} - {formatTime(childState.dayPart.end)})
                            </span>
                        }
                    </div>
                : ELEMENTS_LIST.indexOf(activeControlType) > -1 ?
                    renderActiveControl()
                : null
            }
        </div>
    )
}