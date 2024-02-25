import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import {Elements} from "../../../../services/promptset.interface";
import {useContext} from "react";
import {promptSetContext} from "../../../../hooks/promptsetContext";
import {BG, IMAGE, INPUT, TEXT, VIDEO} from "../../../../constants/promptSetConstants";

interface TreeElementsProps{
    element: Elements;
    childStateId:string;
    stateId:string;
}

export default function TreeElements(props:TreeElementsProps) {
    // PROPS
    const {element, stateId, childStateId} = props;

    // Context API
    const {setActiveControlType, setActiveElementId, setActivePromptEditorId, setActiveStateId} = useContext(promptSetContext);


    function onClickElement(element_id:string, type:string) {
        setActiveElementId(element_id);
        setActiveControlType(type);
        setActivePromptEditorId(childStateId);
        setActiveStateId(stateId);
    }

    // parent class    ->   inner-element
    return (
        <>
            {
                element.type === "text" ?
                    <div onClick={()=>{
                        onClickElement(element.id, TEXT)
                    }} className="element text-element-value">
                        <div className="element-left-container text-capitalize">
                            <DragIndicatorRoundedIcon className="grab-icon"/>
                            <i className="fas fa-font"></i>
                            {element.type}
                        </div>
                        <i className="far fa-trash-alt trash-icon"></i>
                    </div>
                : element.type === "input" ?
                    <div onClick={()=>{
                        onClickElement(element.id, INPUT);
                    }} className="element input-element-value">
                        <div className="element-left-container text-capitalize">
                            <DragIndicatorRoundedIcon className="grab-icon"/>
                            <i className="fas fa-i-cursor"></i>
                            {element.type}
                        </div>
                        <i className="far fa-trash-alt trash-icon"></i>
                    </div>
                : element.type === "bg" ?
                    <div onClick={()=>{
                        onClickElement(element.id, BG);
                    }} className="element input-element-value">
                        <div className="element-left-container text-capitalize">
                            <i className="far fa-square"></i>
                            Background
                        </div>
                        <i className="far fa-trash-alt trash-icon"></i>
                    </div>
                : element.type === "image" ?
                    <div onClick={()=>{
                        onClickElement(element.id, IMAGE);
                    }} className="element input-element-value">
                        <div className="element-left-container text-capitalize">
                            <DragIndicatorRoundedIcon className="grab-icon"/>
                            <i className="far fa-image"></i>
                            {element.type}
                        </div>
                        <i className="far fa-trash-alt trash-icon"></i>
                    </div>
                : element.type === "video" ?
                    <div onClick={() => {
                        onClickElement(element.id, VIDEO);
                    }} className="element input-element-value">
                        <div className="element-left-container text-capitalize">
                            <i className="fas fa-video"></i>
                            {element.type}
                        </div>
                        <i className="far fa-trash-alt trash-icon"></i>
                    </div>
                : null
            }
        </>
    )
}
