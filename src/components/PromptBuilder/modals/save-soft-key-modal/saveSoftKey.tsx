import { Modal } from "react-bootstrap";
import "./saveSoftKey.scss";
import SearchableDropdown from "../../../common/searchable-dropdown/searchableDropdown";
import { useSelector } from "react-redux";
import { Keycode } from "../../../../models/keycode.modal";
import { selectKeycodes } from "../../../../redux/selectors/keycodeSelectors";
import { useState } from "react";
import { get } from "http";

interface SaveSoftKeyProps {
  hide: () => void;
  onChange: (keycode: Keycode) => void;
  currentSoftKey: string;
}

function SaveSoftKey({ hide, onChange, currentSoftKey }: SaveSoftKeyProps) {
  const keycodes = useSelector(selectKeycodes).map(({ code, name }) => ({
    id: code,
    code,
    name,
  }));

  const getSelectedCode = () => {
    return keycodes.find((keycode) => keycode.name === currentSoftKey);
  };

  const [selectedCode, setSelectedCode] = useState<Keycode>(
    getSelectedCode() || ({} as Keycode)
  );

  const handleSelect = (keycode: Keycode) => {
    setSelectedCode(keycode);
  };

  return (
    <div className="save-soft-key">
      <Modal.Header>
        <h4>Soft Key Code</h4>
      </Modal.Header>
      <Modal.Body>
        <SearchableDropdown
          label="Key Code"
          items={keycodes}
          placeholder="Key Code"
          itemRenderer={(softKey: Keycode) => (
            <>
              <div className="">{softKey.name}</div>
            </>
          )}
          onSelect={handleSelect}
          selectedCode={selectedCode?.name}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="left-side">
          {selectedCode.name && (
            <button className="btn btn-gray text-danger" onClick={hide}>
              RESET
            </button>
          )}
        </div>
        <div className="right-side">
          <button className="btn btn-link" onClick={hide}>
            CANCEL
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onChange(selectedCode || ({} as Keycode))}
          >
            SAVE
          </button>
        </div>
      </Modal.Footer>
    </div>
  );
}
export default SaveSoftKey;
