import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import {capitalizeFirstLetter} from "../../../../hooks/common";
import {Elements} from "../../../../services/promptset.interface";

interface TreeElementsProps{
    element: Elements;
}

export default function TreeElements(props:TreeElementsProps) {

    const {element} = props;
    // parent class    ->   inner-element
    return (
        <>
            {
                element.type === "text" ?
                    <div className="element text-element-value">
                        <div className="element-left-container">
                            <DragIndicatorRoundedIcon className="grab-icon"/>
                            <i className="fas fa-font"></i>
                            {capitalizeFirstLetter(element.type)}
                        </div>
                        <i className="far fa-trash-alt trash-icon"></i>
                    </div>
                : element.type === "input" ?
                        <div className="element input-element-value">
                            <div className="element-left-container">
                                <DragIndicatorRoundedIcon className="grab-icon"/>
                                <i className="fas fa-i-cursor"></i>
                                {capitalizeFirstLetter(element.type)}
                            </div>
                            <i className="far fa-trash-alt trash-icon"></i>
                        </div>
                : element.type === "bg" ?
                    <div className="bg-element-value">
                        <CropSquareRoundedIcon/>
                        {capitalizeFirstLetter(element.type)}
                    </div>
                : element.type === "image" ?
                    <div className="element input-element-value">
                        <div className="element-left-container">
                            <DragIndicatorRoundedIcon className="grab-icon"/>
                            <i className="far fa-image"></i>
                            {capitalizeFirstLetter(element.type)}
                        </div>
                        <i className="far fa-trash-alt trash-icon"></i>
                    </div>
                                : null
            }
        </>
    )
}
