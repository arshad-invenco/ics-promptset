import React from 'react'
import './prompt-set-editor.css'
import {promptSetContext} from "../../hooks/promptsetContext";
import TextController from "./controller-types/textController";
import ImageController from "./controller-types/imageController";
import InputController from "./controller-types/inputController";
import BackgroundController from "./controller-types/backgroundController";

export default function EditorController() {
    const {activeList } = React.useContext(promptSetContext);

    return (
        <div className='controller'>
            {
                activeList.type === 'text' &&
                <TextController/>
            }

            {
                activeList.type === 'image' &&
                <ImageController/>
            }

            {
                activeList.type === 'input' &&
                <InputController/>
            }

            {
                activeList.type === 'bg' &&
                <BackgroundController/>
            }

        </div>
    )
}
