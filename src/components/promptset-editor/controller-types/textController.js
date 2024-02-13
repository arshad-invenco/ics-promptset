import React, {useState} from 'react'
import {promptSetContext} from "../../../hooks/promptsetContext";

export default function TextController() {


    const {activeList, setActiveList} = React.useContext(promptSetContext);

    console.log(activeList, `INPUT CONTROLLER`);

    const [name, setName] = useState(activeList?.element?.value);
    const [size, setSize] = useState(activeList?.element?.size);
    const [xAxis, setXAxis] = useState(activeList?.element?.left);
    const [yAxis, setYAxis] = useState(activeList?.element?.top);
    const [width, setWidth] = useState(activeList?.element?.width);

    function onChangeInput(value) {
        console.log(value, 'value')
        setActiveList({element: {...activeList.element, value: value}, type: activeList.type})
        console.log(activeList, 'active list INPUT')
    }

    return (
        <div className='controller-body'>

            <div className='d-flex-col'>
                <label htmlFor={"name"}>Name</label>
                <input id={"name"} value={name} onChange={(e) => {
                    setName(e.target.value);
                    onChangeInput(e.target.value)
                }} type={"text"} placeholder={'Name'}/>
            </div>

            <div className='d-flex-col'>
                <label htmlFor={"size"}>Size</label>
                <input id={"size"} value={size} onChange={(e) => setSize(e.target.value)} type={"number"}/>
            </div>

            <div className='d-flex-col'>
                <div className='d-flex-row'>
                    <label htmlFor={"x-axis"}>X</label>
                    <input id={"x-axis"} value={xAxis} onChange={(e) => setXAxis(e.target.value)} type={"number"}/>
                </div>

                <div className='d-flex-row'>
                    <label htmlFor={"y-axis"}>Y</label>
                    <input id={"y-axis"} value={yAxis} onChange={(e) => setYAxis(e.target.value)} type={"number"}/>
                </div>

                <div className='d-flex-row'>
                    <label htmlFor={"width"}>W</label>
                    <input id={"width"} value={width} onChange={(e) => setWidth(e.target.value)} type={"number"}/>
                </div>
            </div>


        </div>
    )
}
