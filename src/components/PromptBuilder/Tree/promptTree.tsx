import {useEffect, useState} from 'react'
import './promptTree.scss'
import {Accordion} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {fetchPromptSet} from "../../../redux/thunks/promptSetThunk";
import InnerStates from "./TreeElements/innerStates";

interface RootState {
    promptset: {
        data: any;
        isLoading: boolean;
        error: any;
    };
}

type FetchPromptSetAction = ReturnType<any>;

export default function PromptTree() {
    const [isSaving, setIsSaving] = useState(false);


    const dispatch = useDispatch();
    const promptSetData = useSelector((state : RootState) => state.promptset.data);

    useEffect(() => {
        dispatch<FetchPromptSetAction>(fetchPromptSet());
        console.log(promptSetData)
    }, []);


    function handleSavePromptSet() {
        setIsSaving(!isSaving);
    }


    const promptSetTree = promptSetData?.states?.map((item:any, index:number) => {
        return (
            <div key={index} className="state-item">
                <Accordion alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                        <div className="prompt-set-status">
                            <div className="left-status">
                                <div className="status-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <div onClick={()=>dispatch<FetchPromptSetAction>(fetchPromptSet())} className="middle-text-status">
                                    {item.code.toUpperCase()}
                                </div>
                            </div>
                            <div className="unsaved-status">
                                <i className="fa fa-floppy-o "></i>
                            </div>
                        </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            {
                                item.assignments.map((child:any, index:number) => {
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
    })

    return (
        <div className="left-container">
            <div className="ics-prompt-tree-container">
                <div className="ics-prompt-set-heading">
                    <input className="prompt-heading-input" type="text" value={"njbh"}/>
                </div>
                <div className="ics-prompt-builder-state">
                    {promptSetTree}
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
