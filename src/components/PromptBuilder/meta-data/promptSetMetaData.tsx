import './promptSetMetaData.scss';
import {useEffect, useState} from "react";
import {PromptSetInterface} from "../../../models/promptset.modal";
import {useSelector} from "react-redux";
import {PromptSetRootState} from "../Tree/promptTree";
import {getDateAndTime} from "../../../services/promptsetService";

export default function PromptSetMetaData() {
    const [acticeIcon, setActiceIcon] = useState(true);

    const promptsetData: PromptSetInterface = useSelector((state: PromptSetRootState) => state.promptset.data);



    useEffect(() => {

    }, []);

    return (<div className={"ics-prompt-builder-metadata"}>
            <div className="ics-prompt-builder-meta-container">
                <p className="meta-container-title">Created by</p>
                <p className="margin-0">{promptsetData.createdBy.name}</p>
                <p className="meta-container-small-text margin-0">{promptsetData.createdBy.email}</p>
            </div>

            <div className="ics-prompt-builder-meta-container">
                <p className="meta-container-title">Created at</p>
                <p className="margin-0">{getDateAndTime(promptsetData.created)}</p>
            </div>

            <div className="ics-prompt-builder-meta-container">
                <p className="meta-container-title">Last modified by</p>
                <p className="margin-0">{promptsetData.modifiedBy.name}</p>
                <p className="meta-container-small-text margin-0">{promptsetData.modifiedBy.email}</p>
            </div>

            <div className="ics-prompt-builder-meta-container">
                <p className="meta-container-title">Template</p>
                <p className="margin-0">{promptsetData.template.name}</p>
            </div>

            <div className="ics-prompt-builder-meta-container">
                <p className="meta-container-title">Version</p>
                <p className="margin-0">{promptsetData.version}</p>
            </div>

            <div className="ics-prompt-builder-meta-container">
                <p className="meta-container-title">Default colors</p>
                <div className="d-flex-row meta-buttons-container">
                    <button className="btn btn-primary meta-button">Font Color</button>
                    <button onClick={() => {
                        setActiceIcon(!acticeIcon);
                    }} className="btn btn-primary meta-button">
                        Background
                        {acticeIcon ? <i className="fas fa-chevron-circle-up"></i> :
                            <i className="fas fa-chevron-circle-down"></i>}
                    </button>
                </div>
            </div>

            <div className="ics-prompt-builder-meta-container">
                <p className="meta-container-title">Languages and default fonts</p>
                <button className="btn btn-primary meta-button">Edit</button>
            </div>

            <div className="ics-prompt-builder-meta-container">
                <div className="d-flex-row meta-buttons-container">
                    <button className="btn btn-primary">
                        <i className="fas fa-angle-double-right"></i>
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-expand-arrows-alt"></i>
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-code"></i>
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-th"></i>
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-play-circle"></i>
                    </button>
                </div>
            </div>
        </div>);
}