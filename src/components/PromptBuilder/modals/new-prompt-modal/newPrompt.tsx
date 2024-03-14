import React from "react";
import { Modal } from "react-bootstrap";
import "./newPrompt.scss";
import { useEffect, useState } from "react";
import {
  NewPromptPayload,
  PromptType,
} from "../../../../models/promptset.modal";
import SearchableDropdown from "../../../common/searchable-dropdown/searchableDropdown";
import { PROMPT_TYPES } from "../../../../constants/promptSetConstants";

interface NewPromptProps {
  hide: () => void;
  newPrompt: (arg: NewPromptPayload) => void;
}

function NewPrompt({ hide, newPrompt }: NewPromptProps) {
  const [newPromptData, setNewPromptData] = useState<NewPromptPayload>({
    code: "",
    promptType: "",
    description: "",
  });

  const [invalid, setInvalid] = useState(true);

  const handlePromptTypeSelect = (promptType: PromptType) => {
    setNewPromptData({ ...newPromptData, promptType: promptType.name });
  };

  useEffect(() => {
    if (
      newPromptData.code &&
      newPromptData.promptType &&
      newPromptData.description
    ) {
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  }, [newPromptData]);

  return (
    <div className="new-prompt-set-modal">
      <Modal.Header>
        <h4>Create new prompt</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label>Prompt name (Case Sensitive)</label>
          <input
            type="text"
            placeholder="Prompt name (Case Sensitive)"
            value={newPromptData.code}
            onChange={(e) =>
              setNewPromptData({ ...newPromptData, code: e.target.value })
            }
            className="ics-input-react"
          />
        </div>
        <div className="form-group">
          <SearchableDropdown
            label="Prompt type"
            items={PROMPT_TYPES}
            placeholder="Prompt type"
            itemRenderer={(promptType: PromptType) => (
              <>
                <div>{promptType.name}</div>
              </>
            )}
            onSelect={handlePromptTypeSelect}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="Description"
            value={newPromptData.description}
            onChange={(e) =>
              setNewPromptData({
                ...newPromptData,
                description: e.target.value,
              })
            }
            className="ics-input-react"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-link"
          onClick={(e) => {
            e.stopPropagation();
            hide();
          }}
        >
          CANCEL
        </button>
        <div className={invalid ? "no-selection" : ""}>
          <button
            disabled={invalid}
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              newPrompt(newPromptData);
              hide();
            }}
          >
            CREATE
          </button>
        </div>
      </Modal.Footer>
    </div>
  );
}

export default NewPrompt;
