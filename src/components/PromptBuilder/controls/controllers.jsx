import './controllers.scss'
import {useSelector} from "react-redux";
import {selectPromptSetAssignmentById, selectPromptSetStateById} from "../../../redux/selectors/promptSetSelectors";
import {useContext} from "react";
import {promptSetContext} from "../../../hooks/promptsetContext";
import {CHILD_STATE, STATE} from "../../../constants/promptSetConstants";
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

export default function Controllers(){
    // Context API
    const {activeStateId, activeControlType, activePromptEditorId} = useContext(promptSetContext);

    // SELECTORS
    const state = useSelector((state) => selectPromptSetStateById(state, activeStateId));
    const childState = useSelector((state) => selectPromptSetAssignmentById(state, activePromptEditorId));
    console.log(state, 'data');
    console.log(childState, 'childState');

    function handleTransactionStateChange() {

    }

    return(
        <div className="ics-prompt-builder-controls">
            {
                activeControlType === STATE ?
                    <div className="state-controller">
                        <p className="code">{state.code}</p>
                        <p className="description">{state.description}</p>
                        <div className="horizontal-border"/>
                        <select className="transaction-state-dropdown"
                                value={state.transactionState}
                                onChange={handleTransactionStateChange}>
                            <option value="null" selected>Select transaction state</option>
                            <option value="idle" >Idle</option>
                            <option value="fueling">Fueling</option>
                        </select>
                    </div>
                : activeControlType === CHILD_STATE ?
                    <div className="child-state-controller">
                        {state.assignments[0].type === 'default' && <AccessTimeRoundedIcon /> }
                        <p className="code">{state.code}</p>
                    </div>
                    : null
            }
        </div>
    )
}