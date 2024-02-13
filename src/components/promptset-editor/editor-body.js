import React from 'react'
import './prompt-set-editor.css'
import {promptSetContext} from "../../hooks/promptsetContext";

export default function EditorBody() {
    const {activeList, toolbarData} = React.useContext(promptSetContext);

    const listElements = toolbarData?.assignments.map((item, index) => {
        return (
            item.elements?.map((element, index) => {
                return (
                    <div>
                        {
                            element.type === 'text' &&
                            <div style={{marginTop: element.right, marginLeft:element.left, width:element.width, cursor:"text", fontSize:element.size, position:'absolute'}}>
                                {element.value} {element.left}
                            </div>
                        }
                        {
                            element.type === 'input' &&
                            <div style={{marginTop: element.top, marginLeft:element.left, width:element.width, cursor:"default", fontSize:element.size, position:'absolute'}}>
                                {element.value}
                            </div>
                        }
                    </div>
                )
            })
        )
    })


    const body = toolbarData?.assignments.map((item, index) => {
        return (
            item.elements?.map((element, index) => {
                return (
                    <div>
                        {
                            element.type === 'bg' &&
                            <div style={{backgroundColor: `#${element.value}`, width: '100%', height: '100%', position:'absolute', top: '0', bottom:'0'}}>
                                {listElements}
                            </div>
                        }

                    </div>
                )
            })
        )
    })

    return (
        <div className='body' style={{}}>
            {activeList.type}
            {body}
        </div>
    )
}
