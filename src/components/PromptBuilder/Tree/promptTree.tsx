import {useContext, useEffect, useState} from 'react'
import './promptTree.scss'
import {Accordion} from "react-bootstrap";
import {useSelector} from "react-redux";
import InnerStates from "./TreeElements/innerStates";
import {Assignment, PromptSetInterface, State} from "../../../models/promptset.modal";
import isSequoiaDevice from "../../../services/promptsetService";
import {promptSetContext} from "../../../hooks/promptsetContext";
import {STATE} from "../../../constants/promptSetConstants";

export interface PromptSetRootState {
    promptset: {
        data: PromptSetInterface;
        isLoading: boolean;
        error: any;
    };
}

export default function PromptTree() {
    // STATES
    const [isSaving, setIsSaving] = useState(false);   //for save button

    // SELECTOR
    const promptsetData : PromptSetInterface = useSelector((state : PromptSetRootState) => state.promptset.data);

    // CONTEXT API
    const {promptSetData, setPromptSetData, setActiveStateId, setActiveControlType, setActivePromptEditorId} = useContext(promptSetContext);

    // EFFECTS
    useEffect(() => {
        setPromptSetData(promptSetData);
    }, []);

    function handleSavePromptSet() {
        setIsSaving(!isSaving);
    }

    function onClickState(state_id: string, child_id:string) {
        setActiveStateId(state_id);
        setActiveControlType(STATE);
        setActivePromptEditorId(child_id);
    }

    return (
        <div className="left-container">
            <div className="ics-prompt-tree-container">
                <div className="ics-prompt-set-heading">
                    <input className="prompt-heading-input" type="text" value={"njbh"}/>
                </div>
                <div className="ics-prompt-builder-state">
                    {promptsetData?.states?.map((item:State, index:number) => {
                        return (
                            <div key={index} className="state-item">
                                <Accordion alwaysOpen>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header onClick={()=>{
                                            onClickState(item.id, item.assignments[0].id)
                                        }}>
                                            <div className="prompt-set-status" >
                                                <div className="left-status">
                                                    <div className="status-icon">
                                                        {
                                                            ( item.secure && isSequoiaDevice("G7-100-8") ) &&
                                                            <i className="fas fa-shield-alt"></i>
                                                        }
                                                    </div>
                                                    <div onClick={()=>{}} className="middle-text-status">
                                                        {item.code.toUpperCase()}
                                                    </div>
                                                    {
                                                        item.transactionState &&
                                                        <span className="state-label">{item.transactionState}</span>
                                                    }
                                                </div>
                                                <div className="unsaved-status">
                                                    <i className="fa fa-floppy-o "></i>
                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {
                                                item.assignments.map((child:Assignment, index:number) => {
                                                    return (
                                                        <div key={index} className="inner-accordion">
                                                            <InnerStates child={child} index={index} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        )
                    })}
                </div>
                <div className="prompt-tree-footer">
                    <button className="btn btn-primary text-uppercase"  onClick={handleSavePromptSet}>
                        {isSaving && <i className="fa fa-spinner fa-pulse fa-fw ics-packages-loader"></i> }
                        Save
                    </button>
                    <button className="btn btn-secondary text-uppercase">
                        New Prompt
                        <i className="fas fa-plus"></i>
                    </button>
                </div>


            </div>
        </div>

    )
}
