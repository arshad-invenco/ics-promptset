import React, {useEffect, useRef, useState} from 'react'
import {Accordion} from "react-bootstrap";
import {capitalizeFirstLetter, openDayPartModal, showAssetsDropdown} from "../../../../hooks/common";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import TreeElements from "./treeElements";
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import AssetsDropdown from "../../modals/assetsDropdown";
import {Assignment, Elements} from "../../../../services/promptset.interface";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import PanToolAltOutlinedIcon from '@mui/icons-material/PanToolAltOutlined';

interface InnerStateProps{
    child: Assignment;
    index: number;
}

export default function InnerStates(props:InnerStateProps) {
    const {child, index} = props;

    // STATES
    const [elements, setElements] = useState(child.elements);
    const [showDropdown, setShowDropdown] = useState(false);

    // REFS
    const dragElement = useRef(0);
    const draggedOverElement = useRef(0);
    const dropdownRef = useRef(null);

    // EFFECTS
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
                                {
                                    child.promptSetLanguageId &&
                                    <span>EN: </span>
                                }
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
                                    console.log('clicked', child);
                                }} className="assets-dropdown">
                                <AssetsDropdown  childState={child}/>
                            </div>
                            }
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                        <div key={index} className="elements-list">
                            {
                                elements.map((element:Elements, index:number) => {
                                    return (
                                        element.lock !== false  ?
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
                            {
                                child.touchmap &&
                                <>
                                    <div className="inner-elements">
                                        <div className="element">
                                            <div className="element-left-container">
                                                <i className="far fa-hand-pointer"></i>
                                                Touch Mask
                                            </div>
                                            <i className="far fa-trash-alt trash-icon"></i>
                                        </div>
                                    </div>
                                    {/*for touch map*/}
                                    {
                                        child.touchmap.areas.map((area, index) => {
                                            return (
                                                <div className="inner-elements element-type-area">
                                                    <div className="element">
                                                        <div className="element-left-container">
                                                            <i className="fas fa-square"></i>
                                                            Touch Area
                                                        </div>
                                                        <i className="far fa-trash-alt trash-icon"></i>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                </>
                            }
                        </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}
