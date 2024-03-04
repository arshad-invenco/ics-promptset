import {useContext, useEffect, useState} from "react";
import {promptSetContext} from "../../../hooks/promptsetContext";
import {useDispatch, useSelector} from "react-redux";
import {PromptSetRootState} from "../Tree/promptTree";
import {Elements, State, TouchMapAreas} from "../../../models/promptset.modal";
import {selectPromptSetAssignmentById} from "../../../redux/selectors/promptSetSelectors";
import {AppDispatch} from "../../../redux/store";
import {BBox} from "snapsvg";
import {updateInputElement} from "../../../redux/reducers/promptsetSlice";
import {getBaseUrl} from "../../../constants/app";

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
        console.log('clicked', elementId, type, 'CLICCKKKKEEEDDDDD');
        setActiveElementId(elementId);
        setActiveControlType(type);
    }

    useEffect(() => {
        console.log(activeElementId)
    }, [activeElementId]);

    function updateElement(newElement: Elements, x: number, y: number, width: number, height: number) {
        dispatch(updateInputElement({...newElement, left: Math.ceil(x), top: Math.ceil(y)}));
    }

    function onclickFunction(id: string, type: string, event: any) {
        console.log(id, type, 'clicked');
        event.stopPropagation();
    }

    function initElements(elements: Elements[], areas: TouchMapAreas[]) {
        s = window.Snap("#svg");
        s.clear();
        g = s.group();
        elements.forEach(element => {
            let svgElement;
            let newElement = {...element};
            let elementUrl = 'media url';
            let x = Math.min(Math.max(10, newElement.left || 0), screenWidth);
            let y = Math.min(Math.max(10, newElement.top || 0), screenHeight);
            switch (newElement.type) {
                case "text":
                    newElement.top = newElement.top === undefined ? 0 : newElement.top;
                    newElement.left = newElement.left === undefined ? 0 : newElement.left;
                    let textSvg = g.text(x, y, newElement.value).attr({
                        fill: `#${newElement.color}`,
                        id: newElement.id,
                        fontSize: newElement.size,
                        cursor: "pointer !important",
                        dy: '1em',
                    });

                    let bbox = textSvg.getBBox();
                    if (activeElementId === newElement.id) {
                        svgElement = createWrapperController(bbox, newElement, textSvg);
                    } else {
                        svgElement = textSvg;
                    }
                    break;
                case "bg":
                    svgElement = s.rect(0, 0, screenWidth, screenHeight).attr({
                        fill: `#${newElement.value}`, id: newElement.id
                    });
                    break;
                case "input":
                    newElement.top = newElement.top === undefined ? 0 : newElement.top;
                    newElement.left = newElement.left === undefined ? 0 : newElement.left;
                    let inputSvg = g.text(x, y, newElement.value).attr({
                        fill: `#${newElement.color}`,
                        id: newElement.id,
                        fontSize: newElement.size,
                        textAnchor: 'center',
                        textDecoration: 'underline',
                        dy: '1em'
                    });
                    let bboxInput = inputSvg.getBBox();
                    if (activeElementId === newElement.id) {
                        svgElement = createWrapperController(bboxInput, newElement, inputSvg, newElement.type, undefined);
                    } else {
                        svgElement = inputSvg;
                    }
                    break;
                case "image":
                    let imageGroup = g.group();
                    elementUrl = `${getBaseUrl()}/media/assets/${newElement.value}/source`;
                    imageGroup.transform(`t${x},${y}`);
                    svgElement = s.image(elementUrl, 0, 0).attr({
                        id: newElement.id, preserveAspectRatio: 'none'
                    });
                    imageGroup.add(svgElement);
                    svgElement = imageGroup;
                    break;
                case "video":
                    let videoGroup = g.group();
                    elementUrl = `${getBaseUrl()}/media/assets/${newElement.value}/thumbnail`;
                    svgElement = s.image(elementUrl, 0, 0, newElement.width, newElement.height).attr({
                        id: newElement.id, preserveAspectRatio: 'none'
                    });
                    videoGroup.add(svgElement);
                    svgElement = videoGroup;
                    break;
                default:
                    console.log('default No Element Present');
                    return;
            }

            if (svgElement) {
                console.log('svgElement', svgElement, newElement.id, newElement.type);
                let start = function (this: Snap.Element) {
                    this.data('origTransform', this.transform().local);
                    this.data('origBBox', this.getBBox());
                }
                let move = function (this: Snap.Element, dx: number, dy: number) {
                    // Getting the original bounding box
                    let origBBox = this.data('origBBox');

                    // Calculating the new position
                    let newX = origBBox.x + dx;
                    let newY = origBBox.y + dy;

                    // Checking if the new position would be outside the boundaries of the SVG container
                    if (newX < 0) newX = 0;
                    if (newY < 0) newY = 0;
                    if (newX > screenWidth - origBBox.width) newX = screenWidth - origBBox.width;
                    if (newY > screenHeight - origBBox.height) newY = screenHeight - origBBox.height;

                    // Applying the new position
                    this.attr({
                        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [newX - origBBox.x, newY - origBBox.y]
                    });
                }
                let stop = function (this: Snap.Element) {
                    const ele = this.getBBox();
                    updateElement(newElement, ele.x, ele.y, ele.width, ele.height);
                }
                svgElement.click(() => {
                    // console.log("svgElement clicked");
                    onClickSVGElement(newElement.id, newElement.type);
                });
                if (newElement.type !== 'bg' && newElement.type !== 'video'){
                    svgElement.drag(move, start, stop);
                }

                g.add(svgElement);
            }
        });
        areas.forEach(area => {
            let areaElement;
            let coords = area.coords.split(',');
            switch (area.shape) {
                case 'circle':
                    let circleGroup = g.group(s.circle(coords[0], coords[1], coords[3]).attr({
                        id: area.id, fill: '#006400', fillOpacity: 0.5
                    }), s.text(coords[0], coords[1], area.softkeyName).attr({
                        fill: `white`,
                        id: area.id,
                        fontStyle: 'italic',
                        fontSize: 20,
                        opacity: 0.8,
                        textAnchor: 'middle',
                        dy: '.5em'
                    }));
                    let circleBBox = circleGroup.getBBox();
                    if (activeElementId === area.id) {
                        areaElement = createWrapperController(circleBBox, undefined, circleGroup, area.type, area);
                    } else {
                        areaElement = circleGroup;
                    }
                    break;
                case 'rect':
                    let rectGroup = g.group(s.rect(coords[0], coords[1], coords[2], coords[3]).attr({
                        id: area.id, fill: '#006400', fillOpacity: 0.5
                    }), s.text(coords[0], coords[1], area.softkeyName || area.keyCodeName).attr({
                        fill: `white`,
                        id: area.id,
                        fontStyle: 'italic',
                        fontSize: 20,
                        opacity: 0.8,
                        textAnchor: 'start',
                        dy: '1em',
                    }));
                    let rectBBox = rectGroup.getBBox();
                    if (activeElementId === area.id) {
                        areaElement = createWrapperController(rectBBox, undefined, rectGroup, area.type, area);
                    } else {
                        areaElement = rectGroup;
                    }
                    break;
            }
            if (areaElement) {
                let start = function (this: Snap.Element) {
                    this.data('origTransform', this.transform().local);
                    this.data('origBBox', this.getBBox());
                }
                let move = function (this: Snap.Element, dx: number, dy: number) {
                    // Getting the original bounding box
                    let origBBox = this.data('origBBox');

                    // Calculating the new position
                    let newX = origBBox.x + dx;
                    let newY = origBBox.y + dy;

                    // Checking if the new position would be outside the boundaries of the SVG container
                    if (newX < 0) newX = 0;
                    if (newY < 0) newY = 0;
                    if (newX > screenWidth - origBBox.width) newX = screenWidth - origBBox.width;
                    if (newY > screenHeight - origBBox.height) newY = screenHeight - origBBox.height;

                    // Applying the new position
                    this.attr({
                        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [newX - origBBox.x, newY - origBBox.y]
                    });
                }
                let stop = function (this: Snap.Element) {
                    const ele = this.getBBox();
                }
                areaElement.drag(move, start, stop);

                areaElement.click(() => {
                    onClickSVGElement(area.id, area.type);
                });
                g.add(areaElement);
            }
        });
    }

    function createWrapperController(bboxInput: BBox, element?: Elements, ElementSvg?: Snap.Element, type?: string, area?: TouchMapAreas) {
        let elementBBox = ElementSvg?.getBBox();
        console.log(elementBBox, 'elementBBox', type);
        let coords: number[] = area?.coords.split(',').map(Number) || [0, 0, 0, 0];
        let controller: any;
        let NewElementSVG;
        if (type === 'area') {
            if (area?.shape === 'circle') {
                controller = s.rect(bboxInput.x, bboxInput.y, coords[3] * 2, coords[3] * 2).attr({
                    fill: '#ffffff', stroke: '#00ff00', fillOpacity: 0
                });
            } else {
                controller = s.rect(bboxInput.x, bboxInput.y, coords[2], coords[3]).attr({
                    fill: '#ffffff', stroke: '#00ff00', fillOpacity: 0
                });
            }
        } else {
            controller = s.rect(bboxInput.x, bboxInput.y, element?.width || bboxInput.width, element?.height || bboxInput.height).attr({
                fill: '#ffffff', stroke: '#00ff00', fillOpacity: 0
            });
        }
        let controllerBBox = controller.getBBox();
        let controllerResize = g.group(s.rect(0, 0, 20, 10).attr({
            fill: '#32b447', transform: 'matrix(0,1,-1,0,15,-5)', fillOpacity: 0.9
        }), s.rect(0, 0, 10, 20).attr({fill: '#32b447', transform: 'matrix(0,1,-1,0,15,5)', fillOpacity: 0.9})).attr({
            id: 'controllerResize',
            cursor: 'se-resize',
            transform: `matrix(1,0,0,1,${controllerBBox.x2},${controllerBBox.y2})`
        })

        let controllerRect = g.group(controller, controllerResize);

        // Define the start function
        let start = function (this: Snap.Element) {
            this.data('origTransform', this.transform().local);
            this.data('origBBox', this.getBBox());
        }


        // Define the move function
        let move = function (this: Snap.Element, dx: number, dy: number) {
            let origBBox = this.data('origBBox');

            let newSize = Math.max(origBBox.width + dx, origBBox.height + dy);
            // Check if the new size would be outside the boundaries of the SVG container
            if (newSize > screenWidth) newSize = screenWidth;
            if (newSize > screenHeight) newSize = screenHeight;

            // Apply the new size
            controller.attr({
                width: controllerBBox.width+ newSize,
                height: controllerBBox.height+ newSize
            });
            controllerResize.attr({
                transform: `matrix(1,0,0,1,${controllerBBox.x2 + newSize},${controllerBBox.y2 + newSize})`
            });
            controllerResize.mousedown(() => {
                console.log('Mouse Down');
            })
            let children = ElementSvg?.children();
            if (children && children.length > 0) {
                NewElementSVG = children[0];
                NewElementSVG.attr({
                    width: controllerBBox.width+ newSize,
                    height: controllerBBox.height+ newSize,
                    id: 'NewElementSVG'
                });
            }
        }
        // Define the stop function
        let stop = function (this: Snap.Element) {
            const ele = this.getBBox();
            console.log('finished dragging', ele);


        }

        // Call the drag function on the controllerRectResize
        controllerResize.drag(move, start, stop);

        if (type === 'area') {

        }
        if (NewElementSVG)
            return g.group(ElementSvg, NewElementSVG);
        else
            return g.group(ElementSvg, controllerRect);
    }

    useEffect(() => {
        if (childState?.elements) {
            setElements(childState.elements);
        }
        console.log("CALLED")
        initElements(elements, childState?.touchmap?.areas || []);
    }, [elements, childState, activeElementId]);


    return (<svg id="svg" viewBox={`0 0 ${screenWidth} ${screenHeight}`}>

    </svg>);
}