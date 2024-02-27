import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import "./dayPart.scss";
import { useSelector } from "react-redux";
import { DayPartRootState } from "../../../models/daypart.modal";

interface ModalProps {
  hide: () => void;
}

function DayPartModal({ hide }: ModalProps) {
  const [dropdownStatus, setDropdownStatus] = useState(true);
  const [selectedDayPart, setSelectedDayPart] = useState("Daypart");

  const toggleDropdown = () => {
    setDropdownStatus(!dropdownStatus);
  };

  const dayParts = useSelector(
    (state: DayPartRootState) => state.daypart.data
  ).map((daypart) => {
    let startHour = Math.floor(daypart.start / 3600000);
    let startMinute = Math.floor((daypart.start % 3600000) / 60000);
    let endHour = Math.floor(daypart.end / 3600000);
    let endMinute = Math.floor((daypart.end % 3600000) / 60000);

    let startTime = `${startHour}:${
      startMinute < 10 ? "0" : ""
    }${startMinute}am`;
    let endTime = `${endHour}:${endMinute < 10 ? "0" : ""}${endMinute}am`;

    return {
      name: daypart.name,
      time: `${startTime} - ${endTime}`,
    };
  });

  return (
    <>
      <Modal.Header>
        <Modal.Title>Add a day part</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="dayPartName">Daypart</label>
        <div className="react-select">
          {dropdownStatus && (
            <div className="dropdown-btn">
              <span role="button" onClick={toggleDropdown}>
                {selectedDayPart}
                <span className="caret pull-right"></span>
              </span>
            </div>
          )}
          {!dropdownStatus && (
            <input
              type="search"
              placeholder="Daypart"
              aria-label="Select box"
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            hide();
          }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            hide();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </>
  );
}

export default DayPartModal;
