import React from "react";
import { Modal } from "react-bootstrap";
import "./newTouchMask.scss";
import { useEffect, useState } from "react";
import { TouchMaskPromptSets } from "../../../../../models/touchMask.modal";
import { getBaseUrl, getPromptSetUrl } from "../../../../../constants/app";
import {
  getPromptSetStatus,
  getPromptSetStatusColor,
} from "../../../../../services/promptsetService";

interface NewTouchMaskProps {
  hide: () => void;
  onChange: (update: boolean) => void;
  touchMaskId: string;
}

function NewTouchMask({ hide, onChange, touchMaskId }: NewTouchMaskProps) {
  const [promptsets, setPromptsets] = useState<TouchMaskPromptSets[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPromptSets();
      setPromptsets(data);
    };

    fetchData();
  }, []);

  async function getPromptSets() {
    try {
      const response = await fetch(
        `${getBaseUrl()}/media/touchmaps/${touchMaskId}/promptsets`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      return data as TouchMaskPromptSets[];
    } catch (error) {
      return [];
    }
  }

  return (
    <div className="new-touch-mask">
      <Modal.Header>
        <h4>Override or save as new?</h4>
      </Modal.Header>
      <Modal.Body>
        {promptsets.length > 0 && (
          <p>
            Overriding will affect the following prompt sets that use this touch
            mask
          </p>
        )}
        {promptsets.length === 0 && (
          <p>Do you want to override this touch mask or save as a new one?</p>
        )}
        {promptsets.length > 0 && (
          <div className="ics-touch-mask-prompt-sets-list">
            <ul>
              {promptsets.map((promptset) => (
                <li key={promptset.id}>
                  <a
                    className="fw-bold"
                    href={`${getPromptSetUrl(promptset.id, {
                      readOnly: "true",
                    })}`}
                    target="_blank" rel="noreferrer"
                  >
                    <p>
                      {promptset.name} : {promptset.code}
                    </p>
                    <span className="version">{promptset.version}</span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: getPromptSetStatusColor(
                          promptset.status
                        ),
                      }}
                    >
                      {getPromptSetStatus(promptset.status)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="left-side">
          <button className="btn btn-link" onClick={hide}>
            CANCEL
          </button>
        </div>
        <div className="right-side">
          <button className="btn btn-primary" onClick={() => onChange(true)}>
            SAVE AS
          </button>
          <button className="btn btn-primary" onClick={() => onChange(false)}>
            OVERRIDE
          </button>
        </div>
      </Modal.Footer>
    </div>
  );
}

export default NewTouchMask;
