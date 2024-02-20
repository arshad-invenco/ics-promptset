import React, {useEffect} from 'react'
import './promptTree.scss'
import {Accordion} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {fetchPromptSet} from "../../../redux/thunks/promptSetThunk";
import InnerStates from "./TreeElements/innerStates";

export default function PromptTree(props) {
    console.log(props.toolbar, "INSIDE TREE");

    const dispatch = useDispatch();
    const promptSetData = useSelector(state => state.promptset.data);
    console.log('useEffect', promptSetData);

    useEffect(() => {
        dispatch(fetchPromptSet());
    }, []);

    const promptSetTree = promptSetData?.states?.map((item, index) => {
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
                                <div onClick={()=>dispatch(fetchPromptSet())} className="middle-text-status">
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
                                item.assignments.map((child, index) => {
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


            </div>
        </div>

    )
}
