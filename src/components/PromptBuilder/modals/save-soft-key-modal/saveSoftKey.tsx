import { Modal } from "react-bootstrap";
import "./saveSoftKey.scss";
import SearchableDropdown from "../../../common/searchable-dropdown/searchableDropdown";
import { useSelector } from "react-redux";
import { Keycode } from "../../../../models/keycode.modal";
import { selectKeycodes } from "../../../../redux/selectors/keycodeSelectors";
import {  useState } from "react";

interface SaveSoftKeyProps {
  hide: () => void;
  onChange: (keycode: Keycode) => void;
}

function SaveSoftKey({ hide, onChange }: SaveSoftKeyProps) {
  const [selectedCode, setSelectedCode] = useState<Keycode>();

  const keycodes = useSelector(selectKeycodes).map(({ code, name }) => ({
    id: code,
    code,
    name,
  }));

  const handleSelect = (keycode: Keycode) => {
    setSelectedCode(keycode);
  };

  return (
    <div>
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
        />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-link" onClick={hide}>
          CANCEL
        </button>
        <button
          className="btn btn-primary"
          onClick={() => onChange(selectedCode || ({} as Keycode))}
        >
          SAVE
        </button>
      </Modal.Footer>
    </div>
  );
}
export default SaveSoftKey;