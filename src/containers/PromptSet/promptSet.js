import React, {useEffect, useState} from 'react'
import './promptSet.scss'
import PromptTree from "../../components/PromptBuilder/Tree/promptTree";
import {promptSetContext} from "../../hooks/promptsetContext";
import {useLocation} from "react-router-dom";

export default function PromptSet() {
    const [activeList, setActiveList] = useState({element: null, type: ''});

    // const dispatch = useDispatch();
    // dispatch(setPromptSetData(input));

    const location = useLocation();

    useEffect(() => {
        console.log(location.pathname);
    }, [location]);

    return (
        <div className="layout">
            <promptSetContext.Provider value={{activeList, setActiveList} }>
                <PromptTree />
                {/*<PromptSetEditor prompsetValues={activeList} />*/}
            </promptSetContext.Provider>
        </div>
    )
}
