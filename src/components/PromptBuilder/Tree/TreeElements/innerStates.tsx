import React, {useEffect, useRef, useState} from 'react'
import {Accordion} from "react-bootstrap";
import {capitalizeFirstLetter, openDayPartModal, showAssetsDropdown} from "../../../../hooks/common";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import TreeElements from "./treeElements";
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import AssetsDropdown from "../../modals/assetsDropdown";

export default function InnerStates(props:any) {
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

    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event:MouseEvent) {
            if (dropdownRef.current && !(dropdownRef.current as Node).contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [showDropdown, setShowDropdown] = useState(false);

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
                        <div className="child-states-right-icons">
                            <MoreTimeIcon className="icons-right-child-states" onClick={(e) => {
                                e.stopPropagation();
                                openDayPartModal()
                            }} />
                            {
                                showDropdown ?
                                    <IndeterminateCheckBoxRoundedIcon onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDropdown(!showDropdown);
                                    }} className="icons-right-child-states" />
                                    :
                                    <AddBoxRoundedIcon className="icons-right-child-states" onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDropdown(!showDropdown);
                                        showAssetsDropdown();
                                    }}/>

                            }
                            {showDropdown &&
                                <div ref={dropdownRef} onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDropdown(!showDropdown)
                                }} className="assets-dropdown">
                                <AssetsDropdown assignment={child}/>
                            </div>
                            }
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                        <div key={index} className="elements-list">
                            {
                                elements.map((element:any, index:number) => {
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
