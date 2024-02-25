import React, {useContext, useEffect, useRef, useState} from 'react'
import {Accordion} from "react-bootstrap";
import {openDayPartModal, showAssetsDropdown} from "../../../../hooks/common";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import TreeElements from "./treeElements";
import AssetsDropdown from "../../modals/assetsDropdown";
import {Assignment, Elements, Lang} from "../../../../services/promptset.interface";
import {getLanguage} from "../../../../services/promptsetService";
import {useSelector} from "react-redux";
import {PromptSetRootState} from "../promptTree";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import {promptSetContext} from "../../../../hooks/promptsetContext";
import {AREA, BG, CHILD_STATE, TOUCH_MASK, VIDEO} from "../../../../constants/promptSetConstants";

interface InnerStateProps{
    child: Assignment;
    index: number;
}

export default function InnerStates(props:InnerStateProps) {
    const {child, index} = props;

    // SELECTOR
    const lang : Lang = useSelector((state : PromptSetRootState) => state.promptset.data.lang);


    // STATES
    const [elements, setElements] = useState(child.elements);
    const [showDropdown, setShowDropdown] = useState(false);

    // Context API
    const {setActiveControlType, setActivePromptEditorId, setActiveStateId, setActiveElementId} = useContext(promptSetContext);

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

    function onClickChildState(child_state_id:string, state_id:string) {
        setActiveControlType(CHILD_STATE);
        setActivePromptEditorId(child.id);
        setActiveStateId(child.parentId);

    }

    function onClickElement(touch_mask_id:string, type:string) {
        setActiveControlType(type);
        setActivePromptEditorId(child.id);
        setActiveStateId(child.parentId);
        setActiveElementId(touch_mask_id);
    }

    return (
        <Accordion alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header onClick={()=>{
                    onClickChildState(child.id, child.parentId);
                }}>
                    <div className="prompt-set-child-status">
                        <div className="child-status-left-container">
                            <div className="child-status-icon">
                                <i className="fa fa-clone"></i>
                            </div>
                            <div className="child-status-middle-text text-capitalize">
                                {
                                    child.promptSetLanguageId &&
                                    <span className="text-uppercase">{getLanguage(child.promptSetLanguageId, lang)}: </span>
                                }
                                {child.type}
                            </div>
                        </div>
                        <div className="child-states-right-icons">
                            <MoreTimeIcon className="icons-right-child-states" onClick={(e) => {
                                e.stopPropagation();
                                openDayPartModal()
                            }} />
                            {
                                showDropdown ?
                                    <IndeterminateCheckBoxOutlinedIcon onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDropdown(!showDropdown);
                                    }} className="icons-right-child-states" />
                                    :
                                    <AddBoxOutlinedIcon className="icons-right-child-states" onClick={(e) => {
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
                                        element.lock !== false && [BG, TOUCH_MASK, AREA, VIDEO].indexOf(element.type) < 0  ?
                                            <div draggable
                                                 onDragStart={()=>(dragElement.current = index)}
                                                 onDragEnter={()=>(draggedOverElement.current = index)}
                                                 onDragEnd={handleElementSort}
                                                 onDragOver={(e)=>e.preventDefault()}
                                                 key={index}
                                                 className="inner-elements">
                                                <TreeElements element={element} childStateId={child.id} stateId={child.parentId}/>
                                            </div>
                                        :
                                            <div className="inner-elements">
                                                <TreeElements element={element} childStateId={child.id} stateId={child.parentId}/>
                                            </div>
                                    )
                                })
                            }
                            {
                                child.touchmap &&
                                <>
                                    <div onClick={()=>{
                                        onClickElement(child.touchmap.id, TOUCH_MASK);
                                    }} className="inner-elements">
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
                                                <div onClick={()=>{
                                                    onClickElement(area.id, AREA);
                                                }} className="inner-elements element-type-area">
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
