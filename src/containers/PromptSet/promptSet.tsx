import './promptSet.scss'
import PromptTree from "../../components/PromptBuilder/Tree/promptTree";
import {promptSetContext} from "../../hooks/promptsetContext";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store";
import {fetchPromptSet} from "../../redux/thunks/promptSetThunk";
import {PromptSetInterface} from "../../services/promptset.interface";
import {PromptSetEditor} from "../PromptEditor/promptSetEditor";

export function PromptSet() {
    const location = useLocation();

    // STATES -> CONTEXT_API
    const [promptSetData, setPromptSetData] = useState<PromptSetInterface>({} as PromptSetInterface);
    const [activeStateId, setActiveStateId] = useState<string>('');
    const [activeControlType, setActiveControlType] = useState<string>('');
    const [activePromptEditorId, setActivePromptEditorId] = useState<string>('');
    const [activeElementId, setActiveElementId] = useState<string>('');

    // CONTEXT_API
    const contextValues = {
        promptSetData, setPromptSetData,
        activeStateId, setActiveStateId,
        activeControlType, setActiveControlType,
        activePromptEditorId, setActivePromptEditorId,
        activeElementId, setActiveElementId
    }

    // DISPATCH
    const dispatch = useDispatch<AppDispatch>();

    // EFFECTS
    useEffect(() => {
        dispatch(fetchPromptSet());
        console.log(location.pathname);
    }, []);

    return (
        <div className="layout">
            <promptSetContext.Provider value={contextValues}>
                <PromptTree />
                <PromptSetEditor />
            </promptSetContext.Provider>
        </div>
    )
}
