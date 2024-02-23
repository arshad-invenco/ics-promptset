import './promptSet.scss'
import PromptTree from "../../components/PromptBuilder/Tree/promptTree";
import {promptSetContext} from "../../hooks/promptsetContext";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store";
import {fetchPromptSet} from "../../redux/thunks/promptSetThunk";
import {PromptSetInterface} from "../../services/promptset.interface";

export function PromptSet() {
    const location = useLocation();

    // STATES -> CONTEXT_API
    const [promptData, setPromptData] = useState<PromptSetInterface>({} as PromptSetInterface);

    // DISPATCH
    const dispatch = useDispatch<AppDispatch>();

    // EFFECTS
    useEffect(() => {
        dispatch(fetchPromptSet());
        console.log(location.pathname);
    }, []);

    return (
        <div className="layout">
            <promptSetContext.Provider value={{promptData, setPromptData}}>
                <PromptTree />
                {/*<PromptSetEditor prompsetValues={activeList} />*/}
            </promptSetContext.Provider>
        </div>
    )
}
