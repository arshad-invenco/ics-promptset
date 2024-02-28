import { Modal } from "react-bootstrap";
import { useState } from "react";
import "./dayPart.scss";
import { useSelector } from "react-redux";
import {
  DayPartRootState,
  DaypartItem,
} from "../../../../models/daypart.modal";
import SearchableDropdown from "../../../common/searchable-dropdown/searchableDropdown";

interface ModalProps {
  hide: () => void;
  daypart: (arg: string) => void;
}

function DayPartModal({ hide, daypart }: ModalProps) {
  const [selectedDayPart, setSelectedDayPart] = useState("Daypart");

  const dayParts = useSelector(
    (state: DayPartRootState) => state.daypart.data
  ).map((daypart) => {
    let startTime = convertTime(daypart.start);
    let endTime = convertTime(daypart.end);

    return {
      id: daypart.id,
      name: daypart.name,
      time: `${startTime} - ${endTime}`,
    };
  });

  function convertTime(timeInMilliseconds: number) {
    let hour = Math.floor(timeInMilliseconds / 3600000);
    let minute = Math.floor((timeInMilliseconds % 3600000) / 60000);

    let period = hour < 12 ? "am" : "pm";
    hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${hour}:${minute < 10 ? "0" : ""}${minute}${period}`;
  }

  const handleSelect = (item: DaypartItem) => {
    setSelectedDayPart(item.name);
  };

  return (
    <div className="daypart">
      <Modal.Header>
        <Modal.Title>Add a day part</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchableDropdown
          label="Daypart"
          items={dayParts}
          itemRenderer={(daypart: DaypartItem) => (
            <>
              <div className="fw-bold mb5">{daypart.name}</div>
              <div className="time mb5">
                <i className="fa-regular fa-clock"></i>
                {daypart.time}
              </div>
            </>
          )}
          onSelect={handleSelect}
        />
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
        <div className={selectedDayPart === "Daypart" ? "add-daypart" : ""}>
          <button
            disabled={selectedDayPart === "Daypart"}
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              daypart(selectedDayPart);
            }}
          >
            ADD
          </button>
        </div>
      </Modal.Footer>
    </div>
  );
}

export default DayPartModal;
