import {Modal} from "react-bootstrap";
import {useState} from "react";
import "./dayPart.scss";
import {useDispatch, useSelector} from "react-redux";
import {DaypartItem, DayPartRootState,} from "../../../../models/daypart.modal";
import SearchableDropdown from "../../../common/searchable-dropdown/searchableDropdown";
import {AppDispatch} from "../../../../redux/store";
import {fetchPromptSet} from "../../../../redux/thunks/promptSetThunk";
import {usePromptSetId} from "../../../../hooks/promptsetId";
import {getBaseUrl} from "../../../../constants/app";
import request from "../../../../services/interceptor";

interface ModalProps {
    hide: () => void;
    daypart: (arg: string) => void;
    childStateId: string;
    parentId: string;
}

function DayPartModal({hide, daypart, childStateId, parentId}: ModalProps) {
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
            type: "exception",
            "dayPart": {
                "id": `${item.id}`, "name": `${item.name}`, "start": 0, "end": 3600000, "active": true
            },
            "code": null,
            "promptSetLanguageId": null,
            "parentId": `${parentId}`,
            "showAssets": false,
            "showAssetsDropdown": false,
            "elements": [],
            "flatElements": [],
            "softkeys": []
        }


        request().post(`${getBaseUrl()}/media/promptsets/${promptSetId}/prompts/${childStateId}/exception`, payload)
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
