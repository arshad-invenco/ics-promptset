import React from 'react'
import './prompt-set-editor.css'
import EditorController from "./editor-controller";
import EditorBody from "./editor-body";

export default function PromptSetEditor() {

    return (
        <div className='editor'>
            <EditorController />
            <EditorBody/>
        </div>
    )
}
