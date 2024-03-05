import { Modal } from "react-bootstrap";
import "./updateFontColor.scss";
import { getBaseUrl } from "../../../../../constants/app";
import { getPromptSetId } from "../../../../../constants/promptSetConstants";

interface UpdateFontColorProps {
  value: string;
  onUpdateFontColor: (update: boolean) => void;
}

function UpdateFontColor({ value, onUpdateFontColor }: UpdateFontColorProps) {
  const handleUpdateFontColor = (update: boolean) => {
    value = value.replace("#", "");
    onUpdateFontColor(update);
    fetch(
      `${getBaseUrl()}/media/promptsets/${getPromptSetId()}/font?all=${update}&fontColor=${value}`,
      {
        method: "PUT",

        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },

        body: JSON.stringify({}),
      }
    );
  };

  return (
    <div className="update-font-color">
      <Modal.Header>
        <h4>Default font color</h4>
      </Modal.Header>
      <Modal.Body>
        Do you also want to update the color of <strong>all existing </strong>
        text and input assets?
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-link"
          onClick={() => handleUpdateFontColor(false)}
        >
          NO
        </button>
        <button
          className="btn btn-gray"
          onClick={() => handleUpdateFontColor(true)}
        >
          <span className="text-primary">YES</span>
        </button>
      </Modal.Footer>
    </div>
  );
}

export default UpdateFontColor;