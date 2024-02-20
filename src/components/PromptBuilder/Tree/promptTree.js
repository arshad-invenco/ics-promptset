import React, {useEffect, useState} from 'react'
import './promptTree.scss'
import {Accordion} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {fetchPromptSet} from "../../../redux/thunks/promptSetThunk";

export default function PromptTree(props) {
    console.log(props.toolbar, "INSIDE TREE");

    const dispatch = useDispatch();
    const promptSetData = useSelector(state => state.promptset.data);
    console.log('useEffect', promptSetData);

    useEffect(() => {
        dispatch(fetchPromptSet());
    }, []);





    return (
        <div className="left-container">
            <div className="ics-prompt-tree-container">
                <div className="ics-prompt-set-heading">
                    <input className="prompt-heading-input" type="text" value={"njbh"}/>
                </div>

                <div className="ics-prompt-builder-state">

                    <Accordion alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <div className="prompt-set-status">
                                    <div className="left-status">
                                        <div className="status-icon">
                                            <i className="fas fa-shield-alt"></i>
                                        </div>
                                        <div onClick={()=>dispatch(fetchPromptSet())} className="middle-text-status">
                                            DATA-02 (*)
                                        </div>
                                    </div>
                                    <div className="unsaved-status">
                                        <i className="fa fa-floppy-o "></i>
                                    </div>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                            {/*Inner accordion*/}
                                Hii
                                <Accordion alwaysOpen>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Accordion Item #1</Accordion.Header>
                                        <Accordion.Body>
                                            HIIII
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>

                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                </div>


            </div>
        </div>

    )
}
