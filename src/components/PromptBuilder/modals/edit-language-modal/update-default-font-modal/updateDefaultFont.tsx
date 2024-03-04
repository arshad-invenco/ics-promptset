import { Modal } from "react-bootstrap";
import "./updateDefaultFont.scss";

interface UpdateDefaultFontProps {
  hide: () => void;
  onUpdateDefaultFont: () => void;
}

function UpdateDefaultFont({
  hide,
  onUpdateDefaultFont,
}: UpdateDefaultFontProps) {
  return (
    <div className="update-default-font">
      <Modal.Header>
        <h4>Prompt set languages</h4>
      </Modal.Header>
      <Modal.Body>
        <p>
          Disabling languages will remove all existing prompts under that
          language. Enabling languages will add new prompts to the prompt set.
        </p>
        <p>Are you sure you want to continue?</p>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-link" onClick={hide}>
          NO
        </button>
        <button className="btn btn-gray" onClick={onUpdateDefaultFont}>
          <span className="text-primary">YES</span>
        </button>
      </Modal.Footer>
    </div>
  );
}

export default UpdateDefaultFont;
