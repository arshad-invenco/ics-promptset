import React, {useRef, useState} from 'react'
import {Accordion} from "react-bootstrap";
import {capitalizeFirstLetter} from "../../../../hooks/common";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import TreeElements from "./treeElements";

export default function InnerStates(props) {
    const {child, index} = props;
    const [elements, setElements] = useState(child.elements);

    const dragElement = useRef(0);
    const draggedOverElement = useRef(0);

    function handleElementSort() {
        const elementsClone = [...child.elements];
        const temp = elementsClone[dragElement.current];
        elementsClone[dragElement.current] = elementsClone[draggedOverElement.current];
        elementsClone[draggedOverElement.current] = temp;
        setElements(elementsClone);

    }

    return (
        <Accordion alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <div className="prompt-set-child-status">
                        <div className="child-status-left-container">
                            <div className="child-status-icon">
                                <i className="fa fa-clone"></i>
                            </div>
                            <div className="child-status-middle-text">
                                {capitalizeFirstLetter(child.type)}
                            </div>
                        </div>
                        <div className="child-status-right-icons">
                            <MoreTimeIcon className="icons-child-status" />
                            <AddBoxRoundedIcon className="icons-child-status"/>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                        <div key={index} className="elements-list">
                            {
                                elements.map((element, index) => {
                                    return (
                                        element.lock !== false ?
                                            <div draggable
                                                 onDragStart={()=>(dragElement.current = index)}
                                                 onDragEnter={()=>(draggedOverElement.current = index)}
                                                 onDragEnd={handleElementSort}
                                                 onDragOver={(e)=>e.preventDefault()}
                                                 key={index}
                                                 className="inner-elements">
                                                <TreeElements element={element}/>
                                            </div>
                                        : null
                                    )
                                })
                            }
                        </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}
