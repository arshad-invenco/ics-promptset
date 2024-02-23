import Controllers from "../../components/PromptBuilder/controls/controllers";
import PromptBuilder from "../../components/PromptBuilder/builder/promptBuilder";


export function PromptSetEditor() {

    return (
        <div className="ics-prompt-set-right-container">
            <Controllers />
            <PromptBuilder />
        </div>
    )
}