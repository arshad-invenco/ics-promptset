import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
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
                        <div className="element-left-container text-capitalize">
                            <DragIndicatorRoundedIcon className="grab-icon"/>
                            <i className="fas fa-font"></i>
                            {element.type}
                        </div>
                        <i className="far fa-trash-alt trash-icon"></i>
                    </div>
                : element.type === "input" ?
                        <div className="element input-element-value">
                            <div className="element-left-container text-capitalize">
                                <DragIndicatorRoundedIcon className="grab-icon"/>
                                <i className="fas fa-i-cursor"></i>
                                {element.type}
                            </div>
                            <i className="far fa-trash-alt trash-icon"></i>
                        </div>
                : element.type === "bg" ?
                    <div className="bg-element-value text-capitalize">
                        <CropSquareRoundedIcon/>
                        {element.type}
                    </div>
                : element.type === "image" ?
                    <div className="element input-element-value">
                        <div className="element-left-container text-capitalize">
                            <DragIndicatorRoundedIcon className="grab-icon"/>
                            <i className="far fa-image"></i>
                            {element.type}
                        </div>
                        <i className="far fa-trash-alt trash-icon"></i>
                    </div>
                : null
            }
        </>
    )
}
