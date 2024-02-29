import { Dropdown, Modal } from "react-bootstrap";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import SortIcon from "@mui/icons-material/Sort";

import "./mediaModal.scss";

interface ModalProps {
  hide: () => void;
}

function MediaModal({ hide }: ModalProps) {
  return (
    <div className="media">
      <Modal.Header>
        <div className="navbar-header">
          <div className="name">Recent Media</div>
          <div className="total">761 items</div>
        </div>
        <div className="navbar-body">
          <Dropdown>
            <Dropdown.Toggle className="font-selected">
              <SortByAlphaIcon fontSize="large" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="font-menu">
                <div className="group-type"></div>

                <Dropdown.Item className="selected-font">
                  <div className="media"></div>
                </Dropdown.Item>
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle className="font-selected">
              <SortIcon fontSize="large" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="font-menu">
                <div className="group-type"></div>

                <Dropdown.Item className="selected-font">
                  <div className="media"></div>
                </Dropdown.Item>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer></Modal.Footer>
    </div>
  );
}

export default MediaModal;
