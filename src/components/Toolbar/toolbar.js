import React, {useContext} from 'react'
import './toolbar.css'
import {promptSetContext} from "../../hooks/promptsetContext";

export default function Toolbar(props) {
    console.log(props.toolbar);

    const {activeList, setActiveList } = useContext(promptSetContext);

    const toolbarHeading = props.toolbar.assignments.map((item, index) => {
        return (
            <div key={index}>
                {item.code}
            </div>
        )
    })

    const listClickToolbar = (element) => {
        setActiveList({element:element, type: element.type});
    }

    const toolbarList  = props.toolbar?.assignments?.map((item, index) => {
        return (
            item.elements?.map((element, index) => {
                return (
                    <div key={index} className= {`list-item-toolbar ${ element?.id === activeList?.element?.id ? 'activeList' : ''}`} onClick={event => listClickToolbar(element)}>
                        {element?.type}
                    </div>
                )
            })
        )
    })

    return (
        <div className='toolbar'>
            <div className='toolbar-heading'>
                {toolbarHeading}
            </div>
            <div className='toolbar-list'>
                {toolbarList}
            </div>
        </div>
    )
}
