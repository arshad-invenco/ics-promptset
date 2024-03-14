import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { Accordion, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { showAssetsDropdown } from "../../../../hooks/common";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import TreeElements from "./treeElements";
import AssetsDropdown from "../asset-dropdown/assetsDropdown";
import {
  Assignment,
  Elements,
  Lang,
  State,
} from "../../../../models/promptset.modal";
import { getLanguage } from "../../../../services/promptsetService";
import { useDispatch, useSelector } from "react-redux";
import { PromptSetRootState } from "../promptTree";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import { promptSetContext } from "../../../../hooks/promptsetContext";
import {
  AREA,
  BG,
  CHILD_STATE,
  TOUCH_MASK,
  VIDEO,
} from "../../../../constants/promptSetConstants";
import DayPartModal from "../../modals/daypart-modal/dayPart";
import { AppDispatch } from "../../../../redux/store";
import {
  deleteTouchMapOrAreaById,
  removeIsTouchMaskChangedById,
} from "../../../../redux/reducers/promptsetSlice";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import {
  getClickOutside,
  setClickOutside,
} from "../../../../constants/clickOutside";
import SaveTouchMask from "../../modals/touch-mask-modal/save-touch-mask-modal/saveTouchMask";
import axios from "axios";
import { getBaseUrl } from "../../../../constants/app";
import { fetchPromptSet } from "../../../../redux/thunks/promptSetThunk";
import NewTouchMask from "../../modals/touch-mask-modal/new-touch-mask-modal/newTouchMask";
import { usePromptSetId } from "../../../../hooks/promptsetId";
import { useReadOnly } from "../../../../hooks/readOnly";
import request from "../../../../services/interceptor";
import { selectPromptSetAssignmentById } from "../../../../redux/selectors/promptSetSelectors";
import { fetchTouchMasks } from "../../../../redux/thunks/touchMaskThunk";
import { addToasts } from "../../../../redux/reducers/toastSlice";

interface InnerStateProps {
  child: Assignment;
  index: number;
}

export interface ToolTipProps {
  text: string;
}

export default function InnerStates(props: InnerStateProps) {
  const { child, index } = props;
  const [show, setShow] = useState(false);
  const [showSaveTouchMask, setShowSaveTouchMask] = useState(false);
  const [showNewTouchMask, setShowNewTouchMask] = useState(false);

  const handleShow = () => {
    setClickOutside(true);
    setShow(true);
  };

  // TOOLTIP
  const renderTooltip = (props: ToolTipProps) => (
    <Tooltip id="button-tooltip" {...props} className="ics-tooltip">
      {props.text}
    </Tooltip>
  );

  const handleClose = () => {
    setClickOutside(false);
    setShow(false);
  };

  const handleNewTouchMask = (update: boolean) => {
    if (update) {
      setShowSaveTouchMask(true);
    } else {
      request()
        .put(
          `${getBaseUrl()}/media/touchmaps/${childState?.touchmap?.id}/areas`,
          childState?.touchmap?.areas,
        )
        .then(() => {
          dispatch(fetchTouchMasks());
          dispatch(addToasts({ message: "Touch mask overriden" }));
          dispatch(removeIsTouchMaskChangedById(childState?.id));
        })
        .catch(() => {});
    }
    handleNewTouchMaskClose();
  };

  const handleNewTouchMaskShow = () => {
    setShowNewTouchMask(true);
  };

  const handleNewTouchMaskClose = () => {
    setShowNewTouchMask(false);
  };

  const handleSaveTouchClose = () => {
    setShowSaveTouchMask(false);
  };

  const handleSaveTouchMask = (maskName: string) => {
    let payload = { ...childState?.touchmap, name: maskName };
    request()
      .post(`${getBaseUrl()}/media/touchmaps`, payload)
      .then(() => {
        dispatch(fetchTouchMasks());
        dispatch(addToasts({ message: "Touch mask saved" }));
        dispatch(removeIsTouchMaskChangedById(childState?.id));
      })
      .catch(() => {});
  };

  // SELECTOR
  const lang: Lang = useSelector(
    (state: PromptSetRootState) => state.promptset.data.lang,
  );

  // STATES
  const [elements, setElements] = useState(child.elements);
  const [showDropdown, setShowDropdown] = useState(false);

  // HOOKS
  const promptSetId = usePromptSetId();
  const readOnly = useReadOnly();

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  // Context API
  const {
    setActiveControlType,
    setActivePromptEditorId,
    setActiveStateId,
    setActiveElementId,
    activeElementId,
    setLastModified,
    activePromptEditorId,
  } = useContext(promptSetContext);

  // REFS
  const dragElement = useRef(0);
  const draggedOverElement = useRef(0);
  const dropdownRef = useRef(null);

  // SELECTORS
  const childState = useSelector((state: PromptSetRootState & State[]) =>
    selectPromptSetAssignmentById(state, activePromptEditorId),
  );

  // EFFECTS
  useEffect(() => {
    setElements(child.elements);

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as Node).contains(event.target as Node) &&
        !getClickOutside()
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elements, child]);

  function handleElementSort() {
    const elementsClone = [...child.elements];
    const temp = elementsClone[dragElement.current];
    elementsClone[dragElement.current] =
      elementsClone[draggedOverElement.current];
    elementsClone[draggedOverElement.current] = temp;
    setElements(elementsClone);
  }

  function onClickChildState() {
    setActiveControlType(CHILD_STATE);
    setActivePromptEditorId(child.id);
    setActiveStateId(child.parentId);
  }

  function onClickElement(touch_mask_id: string, type: string) {
    setActiveControlType(type);
    setActivePromptEditorId(child.id);
    setActiveStateId(child.parentId);
    setActiveElementId(touch_mask_id);
  }

  function handleDaypart(item: string) {
    setShow(false);
  }

  function deleteTouchMapOrArea(touchMapId: string) {
    dispatch(deleteTouchMapOrAreaById(touchMapId));
  }

  function deleteDayPart(assignmentId: string, childStateId: string) {
    axios
      .delete(`${getBaseUrl()}/media/prompt/${childStateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setLastModified(res.data);
        dispatch(fetchPromptSet(promptSetId));
      })
      .catch(() => {});
  }

  return (
    <Accordion alwaysOpen defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header
          onClick={() => {
            onClickChildState();
          }}
        >
          <div className="prompt-set-child-status">
            <div className="child-status-left-container">
              <div className="child-status-icon">
                <i className="fa fa-clone"></i>
              </div>
              <div className="child-status-middle-text text-capitalize">
                {child.promptSetLanguageId && (
                  <span className="text-uppercase">
                    {getLanguage(child.promptSetLanguageId, lang)}:{" "}
                  </span>
                )}
                {child.dayPart ? child.dayPart.name : child.type}
              </div>
            </div>
            {!readOnly && (
              <div className="child-states-right-icons">
                {child.isAssignmentChanged && !readOnly && (
                  <ErrorRoundedIcon
                    onClick={(e) => e.stopPropagation()}
                    className="icons-right-child-states"
                  />
                )}
                {child.dayPart ? (
                  <i
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDayPart(child.parentId, child.id);
                    }}
                    className="far fa-trash-alt child-state-trash-icon"
                  ></i>
                ) : (
                  <>
                    <OverlayTrigger
                      placement="left"
                      delay={{ show: 25, hide: 25 }}
                      overlay={renderTooltip({
                        text: "Add daypart",
                      })}
                    >
                      <MoreTimeIcon
                        className="icons-right-child-states"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShow();
                        }}
                      />
                    </OverlayTrigger>
                    <Modal show={show} onHide={handleClose} size="sm">
                      <DayPartModal
                        childStateId={child.id}
                        hide={handleClose}
                        daypart={handleDaypart}
                        parentId={child.parentId}
                      ></DayPartModal>
                    </Modal>
                  </>
                )}
                {showDropdown ? (
                  <OverlayTrigger
                    placement="left"
                    delay={{ show: 25, hide: 25 }}
                    overlay={renderTooltip({
                      text: "Add daypart",
                    })}
                  >
                    <IndeterminateCheckBoxOutlinedIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(!showDropdown);
                      }}
                      className="icons-right-child-states"
                    />
                  </OverlayTrigger>
                ) : (
                  <OverlayTrigger
                    placement="left"
                    delay={{ show: 25, hide: 25 }}
                    overlay={renderTooltip({
                      text: "Add assets",
                    })}
                  >
                    <AddBoxOutlinedIcon
                      className="icons-right-child-states"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(!showDropdown);
                        showAssetsDropdown();
                      }}
                    />
                  </OverlayTrigger>
                )}
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(!showDropdown);
                    }}
                    className="assets-dropdown"
                  >
                    <AssetsDropdown
                      childState={child}
                      hide={() => {
                        setShowDropdown(false);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <div key={index} className="elements-list">
            {elements.map((element: Elements, index: number) => {
              return element.lock !== false &&
                [BG, TOUCH_MASK, AREA, VIDEO].indexOf(element.type) < 0 ? (
                <div
                  draggable
                  onDragStart={() => (dragElement.current = index)}
                  onDragEnter={() => (draggedOverElement.current = index)}
                  onDragEnd={handleElementSort}
                  onClick={() => {
                    onClickElement(element.id, element.type);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  key={index}
                  className={`inner-elements ${activeElementId === element.id && child.id === activePromptEditorId ? "active-inner-element" : ""} `}
                >
                  <TreeElements childState={child.id} element={element} />
                </div>
              ) : element.lock !== false ? (
                <div
                  onClick={() => {
                    onClickElement(element.id, element.type);
                  }}
                  className={`inner-elements ${activeElementId === element.id ? "active-inner-element" : ""} `}
                  key={index}
                >
                  <TreeElements childState={child.id} element={element} />
                </div>
              ) : null;
            })}
            {child?.touchmap && (
              <>
                <div
                  onClick={() => {
                    if (child?.touchmap?.id) {
                      onClickElement(child.touchmap.id, TOUCH_MASK);
                    }
                  }}
                  className="inner-elements"
                >
                  <div className="element">
                    <div className="element-left-container">
                      <i className="far fa-hand-pointer"></i>
                      Touch Mask
                    </div>
                    {!readOnly && (
                      <div>
                        {child.touchmap.isTouchMaskChanged && (
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 25, hide: 250 }}
                            overlay={renderTooltip({
                              text: "Save Touch Mask",
                            })}
                          >
                            <i
                              onClick={() => {
                                setActivePromptEditorId(child.id);
                                setShowNewTouchMask(true);
                              }}
                              className="fa fa-floppy-o touchmask-save-icon"
                            ></i>
                          </OverlayTrigger>
                        )}
                        <i
                          onClick={() => {
                            if (child?.touchmap?.id) {
                              deleteTouchMapOrArea(child.touchmap.id);
                            }
                          }}
                          className={`far fa-trash-alt trash-icon ${child.touchmap.isTouchMaskChanged ? "margin-right-0" : ""}`}
                        ></i>
                        <Modal
                          show={showSaveTouchMask}
                          onHide={handleSaveTouchClose}
                          size="sm"
                        >
                          <SaveTouchMask
                            hide={handleSaveTouchClose}
                            newTouchMask={handleSaveTouchMask}
                          />
                        </Modal>
                        <Modal
                          show={showNewTouchMask}
                          onHide={handleNewTouchMaskClose}
                          size="sm"
                        >
                          <NewTouchMask
                            hide={handleNewTouchMaskClose}
                            touchMaskId={child.touchmap.id}
                            onChange={handleNewTouchMask}
                          />
                        </Modal>
                      </div>
                    )}
                  </div>
                </div>
                {/*for touch map*/}
                {child?.touchmap &&
                  child.touchmap.areas &&
                  child.touchmap.areas.map((area, index) => {
                    if (area) {
                      return (
                        <div
                          onClick={() => {
                            onClickElement(area.id, AREA);
                          }}
                          className={`inner-elements element-type-area ${activeElementId === area.id ? "active-inner-element" : ""} `}
                        >
                          <div className="element">
                            <div className="element-left-container">
                              <i className="fas fa-square"></i>
                              Touch Area
                            </div>
                            {!readOnly && (
                              <i
                                onClick={() => {
                                  deleteTouchMapOrArea(area.id);
                                }}
                                className="far fa-trash-alt trash-icon"
                              ></i>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
              </>
            )}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}