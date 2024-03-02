import {useContext, useEffect, useState} from "react";
import {promptSetContext} from "../../../hooks/promptsetContext";
import {useDispatch, useSelector} from "react-redux";
import {PromptSetRootState} from "../Tree/promptTree";
import {Elements, State} from "../../../models/promptset.modal";
import {selectPromptSetAssignmentById} from "../../../redux/selectors/promptSetSelectors";
import {AppDispatch} from "../../../redux/store";
import {BBox} from "snapsvg";

interface PromptBuilderProps {
    color: string;
    screenWidth: number;
    screenHeight: number;
}

export default function PromptBuilder(props: PromptBuilderProps) {
    const {color, screenHeight, screenWidth} = props;
    const [elements, setElements] = useState<Elements[]>([]);

    // CONTEXT API
    const {
        activePromptEditorId, activeElementId, setActiveElementId, setActiveControlType
    } = useContext(promptSetContext);

    // SELECTORS
    const childState = useSelector((state: PromptSetRootState & State[]) => selectPromptSetAssignmentById(state, activePromptEditorId));

    // REDUX
    const dispatch = useDispatch<AppDispatch>();

    var s: any = null;
    var g: any = null;

    function onClickSVGElement(elementId: string, type: string) {
        setActiveElementId(elementId);
        setActiveControlType(type);
    }

    function updateElement(newElement: Elements, x: number, y: number, width: number, height: number) {
        // dispatch(updateInputElement({...newElement, left:Math.ceil(x), top:Math.ceil(y)}));
    }

    function initElements(elements: Elements[]) {
        s = window.Snap("#svg");
        s.clear();
        g = s.group();
        const k = s.g();
        elements.forEach(element => {
            let svgElement;
            let newElement = {...element}; // Create a new object that copies all properties from the original object
            let x = Math.min(Math.max(10, newElement.left || 0), screenWidth);
            let y = Math.min(Math.max(10, newElement.top || 0), screenHeight);
            switch (newElement.type) {
                case 'bg':
                    svgElement = s.rect(0, 0, screenWidth, screenHeight).attr({
                        fill: `#${newElement.value}`, id: newElement.id
                    });
                    break;
                case 'text':
                    newElement.top = newElement.top === undefined ? 0 : newElement.top;
                    newElement.left = newElement.left === undefined ? 0 : newElement.left;
                    let textSvg = g.text(x, y, newElement.value).attr({
                        fill: `#${newElement.color}`,
                        id: newElement.id,
                        fontSize: newElement.size,
                        cursor: "pointer !important",
                        dy: '1em'
                    });
                    let bbox = textSvg.getBBox();
                    if (activeElementId === newElement.id) {
                        svgElement = createWrapperController(bbox, newElement, textSvg);
                    } else {
                        svgElement = textSvg;
                    }
                    break;
                case 'input':
                    newElement.top = newElement.top === undefined ? 0 : newElement.top;
                    newElement.left = newElement.left === undefined ? 0 : newElement.left;
                    let inputSvg = g.text(x, y, newElement.value).attr({
                        fill: `#${newElement.color}`,
                        id: newElement.id,
                        fontSize: newElement.size,
                        textAnchor: 'center',
                        textDecoration: 'underline'
                    });
                    let bboxInput = inputSvg.getBBox();
                    if (activeElementId === newElement.id) {
                        svgElement = createWrapperController(bboxInput, newElement, inputSvg);
                    } else {
                        svgElement = inputSvg;
                    }
                    break;
            }
            if (svgElement) {
                let start = function (this: Snap.Element) {
                    this.data('origTransform', this.transform().local);
                    this.data('origBBox', this.getBBox());
                }
                let move = function (this: Snap.Element, dx: number, dy: number) {
                    // Get the original bounding box
                    let origBBox = this.data('origBBox');

                    // Calculate the new position
                    let newX = origBBox.x + dx;
                    let newY = origBBox.y + dy;

                    // Check if the new position would be outside the boundaries of the SVG container
                    if (newX < 0) newX = 0;
                    if (newY < 0) newY = 0;
                    if (newX > screenWidth - origBBox.width) newX = screenWidth - origBBox.width;
                    if (newY > screenHeight - origBBox.height) newY = screenHeight - origBBox.height;

                    // Apply the new position
                    this.attr({
                        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [newX - origBBox.x, newY - origBBox.y]
                    });
                }
                let stop = function (this: Snap.Element) {
                    const ele = this.getBBox();
                    console.log('finished dragging', ele.x, ele.y, ele.width, ele.height);
                    updateElement(newElement, ele.x, ele.y, ele.width, ele.height);
                }
                if (newElement.type !== 'bg') svgElement.drag(move, start, stop);
                svgElement.click(() => {
                    onClickSVGElement(newElement.id, newElement.type);
                })
                g.add(svgElement);
            }
        });
    }

    function createWrapperController(bboxInput: BBox, element: Elements, ElementSvg: Snap.Element) {
        let controller = s.rect(bboxInput.x, bboxInput.y, element.width, element.height).attr({
            fill: '#ffffff', stroke: '#00ff00', fillOpacity: 0
        });
        let controllerBBox = controller.getBBox();
        return g.group(controller, g.group(s.rect(0, 0, 20, 10).attr({
            fill: '#32b447', transform: 'matrix(0,1,-1,0,15,-5)', fillOpacity: 0.9
        }), s.rect(0, 0, 10, 20).attr({fill: '#32b447', transform: 'matrix(0,1,-1,0,15,5)', fillOpacity: 0.9})).attr({
            id: 'control', cursor: 'se-resize', transform: `matrix(1,0,0,1,${controllerBBox.x2},${controllerBBox.y2})`
        }), g.group().add(ElementSvg));
    }

    useEffect(() => {
        if (childState?.elements) {
            setElements(childState.elements);
        }
        console.log("CALLED")
        initElements(elements);


    }, [elements, childState, activeElementId]);


    return (<svg id="svg" viewBox={`0 0 ${screenWidth} ${screenHeight}`}>

    </svg>);
}