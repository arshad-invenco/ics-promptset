import React, {useEffect, useState} from 'react';
import './prompt-set-editor.css';
import {promptSetContext} from "../../hooks/promptsetContext";
import {useDrag} from "react-use-gesture";

export default function EditorBody() {
    const {activeList} = React.useContext(promptSetContext);

    console.log(activeList, `EDITOR BODY`)

    const [pos, setPos] = useState({x: activeList?.element?.left, y: activeList?.element?.top})

    // const [pos, setPos] = React.useState({x: 0, y: 0});

    useEffect(() => {
        setPos({x: activeList?.element?.left, y: activeList?.element?.top})
        console.log('activeList')
    }, [activeList]);

    const dragComponents = useDrag((params) => {
        console.log(params, 'params')
        setPos((prevPos) => ({
            x: prevPos.x + params.delta[0],
            y: prevPos.y + params.delta[1]
        }));

        // updateActiveList();

    });
    // const updateActiveList = () => {
    //     setActiveList({
    //         element: {...activeList.element, top: pos.y},
    //         type: activeList.type
    //     })
    // }

    // const listElements = toolbarData?.assignments.map((item, index) => {
    //     return (
    //         item.elements?.map((element, index) => {
    //             return (
    //                 <div>
    //                     {
    //                         element.type === 'text' &&
    //                         <div style={{marginTop: element.right, marginLeft:element.left, width:element.width, cursor:"text", fontSize:element.size, position:'absolute'}}>
    //                             {element.value} {element.left}
    //                         </div>
    //                     }
    //                     {
    //                         element.type === 'input' &&
    //                         <div style={{marginTop: element.top, marginLeft:element.left, width:element.width, cursor:"default", fontSize:element.size, position:'absolute'}}>
    //                             {element.value}
    //                         </div>
    //                     }
    //                 </div>
    //             )
    //         })
    //     )
    // })


    // const body = toolbarData?.assignments.map((item, index) => {
    //     return (
    //         item.elements?.map((element, index) => {
    //             return (
    //                 <div>
    //                     {
    //                         element.type === 'bg' &&
    //                         <div style={{backgroundColor: `#${element.value}`, width: '100%', height: '100%', position:'absolute', top: '0', bottom:'0'}}>
    //                             {listElements}
    //                         </div>
    //                     }
    //
    //                 </div>
    //             )
    //         })
    //     )
    // })

    return (
        <svg fill='red' viewBox={'0 0 640 480'} style={{border: '1px solid red'}}>

            <g>
                <rect x="0" y="0" width="1280" height="800" fill="#0000ff"></rect>
            </g>

            <g {...dragComponents()} onDragStart={event => event.preventDefault()}
               transform={`matrix(1,0,0,1,${pos.x},${pos.y})`}>
                <text className="noselect" height={1000} style={{position: "absolute", cursor: 'text'}} fill="#ffffff"
                      dy="1em">Enter 5 digit ZIP code
                </text>
            </g>

            <g onDragStart={event => event.preventDefault()}
               transform={`matrix(1,0,0,1,100, 100)`}>
                <text className="noselect" height={1000} style={{position: "absolute", cursor: 'text'}} fill="#ffffff"
                      dy="1em">
                    AAAAA
                </text>
            </g>
            <g>
                <text style={{position: 'absolute'}}>{pos.x} {pos.y}</text>
            </g>
        </svg>
        // <>
        //     <animated.div {...dragComponents()} style={{x: pos.x, y: pos.y, width:'fit-content'}}>
        //         <img src={logo} alt="React" onDragStart={event => event.preventDefault()}/>
        //     </animated.div>
        //     {pos.x} {pos.y}
        // </>

    )
}
