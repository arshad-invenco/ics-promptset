import {Modal} from "react-bootstrap";
import {useState} from "react";
import "./dayPart.scss";
import {useDispatch, useSelector} from "react-redux";
import {DaypartItem, DayPartRootState,} from "../../../../models/daypart.modal";
import SearchableDropdown from "../../../common/searchable-dropdown/searchableDropdown";
import axios from "axios";
import {AppDispatch} from "../../../../redux/store";
import {fetchPromptSet} from "../../../../redux/thunks/promptSetThunk";
import {usePromptSetId} from "../../../../hooks/promptsetId";

interface ModalProps {
    hide: () => void;
    daypart: (arg: string) => void;
}

function DayPartModal({hide, daypart}: ModalProps) {
    // STATES
    const [selectedDayPart, setSelectedDayPart] = useState("Daypart");

    // SELECTORS
    const dayPartData = useSelector((state: DayPartRootState) => state.daypart.data);

    // REDUX
    const dispatch = useDispatch<AppDispatch>();

    const promptSetId = usePromptSetId();

    const dayParts = Array.isArray(dayPartData) ? dayPartData.map((daypart) => {
        let startTime = convertTime(daypart.start);
        let endTime = convertTime(daypart.end);

        return {
            id: daypart.id, name: daypart.name, time: `${startTime} - ${endTime}`,
        };
    }) : [];

    function convertTime(timeInMilliseconds: number) {
        let hour = Math.floor(timeInMilliseconds / 3600000);
        let minute = Math.floor((timeInMilliseconds % 3600000) / 60000);

        let period = hour < 12 ? "am" : "pm";
        hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

        return `${hour}:${minute < 10 ? "0" : ""}${minute}${period}`;
    }

    const handleSelect = (item: DaypartItem) => {
        setSelectedDayPart(item.name);
        console.log(item, "DAYYY PPAAARRRTTTT")
        const payload = {
            "type": "exception",
            "dayPart": {
                "id": "249ad27e-0867-4ef7-8763-2eba14067623",
                "name": "sd",
                "start": 0,
                "end": 3600000,
                "active": true
            },
            "code": null,
            "promptSetLanguageId": null,
            "parentId": "79270e6d-8fb7-4512-89d2-65e0991b7c1d",
            "showAssets": false,
            "showAssetsDropdown": false,
            "elements": [],
            "flatElements": [],
            "softkeys": []
        }


        axios.post("https://api-martini.invencocloud.com/rest/v1/media/promptsets/7b6b43c8-080c-4548-8618-362db74e77dd/prompts/e1327a34-ef58-49f3-b792-c66e2d4d9e44/exception"
        , payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                dispatch(fetchPromptSet(promptSetId));
            }).catch((err) => {
            console.log(err, "DAY PART ERROR")
        })

    };

    return (<div className="daypart">
        <Modal.Header>
            <Modal.Title>Add a day part</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <SearchableDropdown
                label="Daypart"
                items={dayParts}
                placeholder="Daypart"
                itemRenderer={(daypart: DaypartItem) => (<>
                    <div className="fw-bold mb5">{daypart.name}</div>
                    <div className="time mb5">
                        <i className="fa-regular fa-clock"></i>
                        {daypart.time}
                    </div>
                </>)}
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
            <div className={selectedDayPart === "Daypart" ? "no-selection" : ""}>
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
    </div>);
}

export default DayPartModal;
