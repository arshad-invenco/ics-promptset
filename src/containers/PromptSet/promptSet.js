import React, {useEffect, useState} from 'react'
import './promptSet.scss'
import PromptTree from "../../components/PromptBuilder/Tree/promptTree";
import PromptSetEditor from "../../components/promptset-editor/promptset-editor";
import {promptSetContext} from "../../hooks/promptsetContext";
import {useDispatch, useSelector} from "react-redux";
import {setPromptSetData} from "../../redux/reducers/promptsetSlice";
import {useLocation, useParams} from "react-router-dom";

export default function PromptSet() {
    const toolbarData = {
        id: "a4dc9706-5f47-4181-b501-c1975e2017da",
        code: "data-01",
        description: "Enter 5 digit ZIP code",
        secure: true,
        sequence: "",
        numericInput: true,
        softKeys: true,
        dynamicText: false,
        promptType: "data",
        transactionState: null,
        assignments: [
            {
                id: "ba3e5e0a-f5a0-4f3c-b499-e0b743e74d8f",
                code: "data-01",
                elements: [
                    {
                        id: "0BbESXO98",
                        lock: false,
                        type: "bg",
                        value: "0000ff"
                    },
                    {
                        id: "DO7jH6eIRt",
                        top: 20,
                        face: "Liberation Sans",
                        left: 195,
                        size: 48,
                        type: "text",
                        color: "ffffff",
                        value: "Enter 5 digit ZIP code",
                        width: 250,
                        textAlign: "center"
                    },
                    {
                        id: "HL8DzeSiAV",
                        top: 260,
                        face: "Liberation Sans",
                        left: 195,
                        size: 48,
                        type: "input",
                        color: "ffffff",
                        value: "????",
                        width: 250,
                        textAlign: "center"
                    }
                ]
            }
        ]
    }

    const [activeList, setActiveList] = useState({element: null, type: ''});

    // const dispatch = useDispatch();
    // dispatch(setPromptSetData(input));

    const location = useLocation();

    useEffect(() => {
        console.log(location.pathname);
    }, [location]);

    return (
        <div className="layout">
            <promptSetContext.Provider value={{activeList, setActiveList, toolbarData} }>
                <PromptTree toolbar={toolbarData}/>
                {/*<PromptSetEditor prompsetValues={activeList} />*/}
            </promptSetContext.Provider>
        </div>
    )
}
