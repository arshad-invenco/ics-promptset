import React from "react";
import { Modal } from "react-bootstrap";
import "./odml.scss";
import { getIsSaving } from "../../../../services/metaDataService";

interface OdmlModalProps {
  hide: () => void;
  value: string;
}

function OdmlModal({ hide, value }: OdmlModalProps) {
  return (
    <div className="odml">
      <Modal.Header>
        <h4>View as ODML</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="ics-html-wrapper">
          <pre className="ics-html-preview">
            {value.length <= 0 && (
              <>
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                {getIsSaving() && <span>Saving changes to current prompt</span>}
                {!getIsSaving() && <span> Generating ODML</span>}
              </>
            )}
            {value}
          </pre>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={hide}>
          CLOSE
        </button>
      </Modal.Footer>
    </div>
  );
}

export default OdmlModal;
