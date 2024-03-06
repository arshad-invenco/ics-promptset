import { Modal } from "react-bootstrap";
import "./updateFontColor.scss";
import { getBaseUrl } from "../../../../../constants/app";
import { getPromptSetId } from "../../../../../constants/promptSetConstants";
import request from "../../../../../services/interceptor";
import { useDispatch } from "react-redux";
import { fetchPromptSet } from "../../../../../redux/thunks/promptSetThunk";
import { AppDispatch } from "../../../../../redux/store";
import { useContext } from "react";
import { promptSetContext } from "../../../../../hooks/promptsetContext";

interface UpdateFontColorProps {
  value: string;
  hide: () => void;
}

function UpdateFontColor({ value, hide }: UpdateFontColorProps) {
  const { toastDispatch } = useContext(promptSetContext);

  const dispatch = useDispatch<AppDispatch>();
  const handleUpdateFontColor = async (update: boolean) => {
    try {
      value = value.replace("#", "");

      const response = await request().put(
        `${getBaseUrl()}/media/promptsets/${getPromptSetId()}/font?all=${update}&fontColor=${value}`
      );

      if (response) {
        dispatch(fetchPromptSet());
        toastDispatch({
          type: "ADD_TOAST",
          payload: { message: "Default font color updated" },
        });
        hide();
      }
    } catch (error) {}
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
