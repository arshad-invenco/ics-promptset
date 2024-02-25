import './controllers.scss'
import {useSelector} from "react-redux";
import {selectPromptSetStateById} from "../../../redux/selectors/promptSetSelectors";
import {useContext} from "react";
import {promptSetContext} from "../../../hooks/promptsetContext";

export default function Controllers(){
    // Context API
    const {activeStateId, activeControlType, activePromptEditorId} = useContext(promptSetContext);

    // SELECTORS
    const data = useSelector((state) => selectPromptSetStateById(state, activeStateId));
    console.log(data, 'data');



    return(
        <div className="ics-prompt-set-controls-container">
            <p>Controllers</p>
            {activeStateId} <br/>
            {activeControlType} <br/>
            {activePromptEditorId}
        </div>
    )
}