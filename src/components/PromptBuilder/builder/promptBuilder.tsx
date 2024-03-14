import React, { memo } from "react";
import { useContext, useEffect, useState } from "react";
import { promptSetContext } from "../../../hooks/promptsetContext";
import { useDispatch, useSelector } from "react-redux";
import { PromptSetRootState } from "../Tree/promptTree";
import {
  Elements,
  State,
  TouchMapAreas,
} from "../../../models/promptset.modal";
import { selectPromptSetAssignmentById } from "../../../redux/selectors/promptSetSelectors";
import { AppDispatch } from "../../../redux/store";
import { BBox } from "snapsvg";
import {
  updateInputElement,
  updateTouchMapArea,
} from "../../../redux/reducers/promptsetSlice";
import { getBaseUrl } from "../../../constants/app";
import {
  CENTER,
  LEFT,
  POSITION,
  SIZE,
} from "../../../constants/promptSetConstants";

interface PromptBuilderProps {
  color: string;
  screenWidth: number;
  screenHeight: number;
}

function PromptBuilder(props: PromptBuilderProps) {
  const { color, screenHeight, screenWidth } = props;
  const [elements, setElements] = useState<Elements[]>([]);

  // CONTEXT API
  const {
    activePromptEditorId,
    activeElementId,
    setActiveElementId,
    setActiveControlType,
    gridViewState,
    showPlaylistState,
  } = useContext(promptSetContext);

  // SELECTORS
  const childState = useSelector((state: PromptSetRootState & State[]) =>
    selectPromptSetAssignmentById(state, activePromptEditorId),
  );

  // REDUX
  const dispatch = useDispatch<AppDispatch>();

  let s: any = null;
  let g: any = null;

  function onClickSVGElement(elementId: string, type: string) {
    setActiveElementId(elementId);
    setActiveControlType(type);
  }

  useEffect(() => {
    if (childState?.elements) {
      setElements(childState.elements);
    }
    initElements(elements, childState?.touchmap?.areas || []);
  }, [activeElementId, gridViewState, elements, childState, showPlaylistState]);

  function updateElement(newElement: Elements, x: number, y: number) {
    const updatedElement = {
      ...newElement,
      left: Math.ceil(x),
      top: Math.ceil(y),
    };
    dispatch(
      updateInputElement({
        assignmentId: childState?.id,
        newElement: updatedElement,
      }),
    );
  }

  function updateSizeOfElement(
    newElement: Elements,
    width: number,
    height: number,
  ) {
    const updatedElement = {
      ...newElement,
      width: Number(Math.ceil(width)),
      height: Number(Math.ceil(height)),
    };
    dispatch(
      updateInputElement({
        assignmentId: childState?.id,
        newElement: updatedElement,
      }),
    );
  }

  function updateArea(area: TouchMapAreas, x: number, y: number, type: string) {
    const areaCoords = area.coords.split(",");
    let newArea;
    if (type === POSITION) {
      newArea = {
        ...area,
        coords: `${Math.ceil(x)},${Math.ceil(y)},${areaCoords[2]},${areaCoords[3]}`,
      };
    }
    if (type === SIZE) {
      newArea = {
        ...area,
        coords: `${areaCoords[0]},${areaCoords[1]},${Number(areaCoords[2]) + Math.ceil(x)},${Number(areaCoords[3]) + Math.ceil(y)}`,
      };
    }
    dispatch(
      updateTouchMapArea({ assignmentId: childState?.id, newArea: newArea }),
    );
  }

  function initElements(elements: Elements[], areas: TouchMapAreas[]) {
    s = window.Snap("#svg");
    s.clear();
    g = s.group();
    elements.forEach((element) => {
      let svgElement;
      const newElement = { ...element };
      let elementUrl = "media url";
      const x = Math.min(Math.max(10, newElement.left || 0), screenWidth);
      const y = Math.min(Math.max(10, newElement.top || 0), screenHeight);
      switch (newElement.type) {
        case "bg":
          const colorValidationRegex = /^[0-9A-F]{6}$/i;
          const elementType = colorValidationRegex.test(newElement.value)
            ? "color"
            : "image";

          if (elementType === "image") {
            elementUrl = `${getBaseUrl()}/media/assets/${
              newElement.value
            }/source`;
            svgElement = s.image(elementUrl, 0, 0).attr({
              id: newElement.id,
            });
          } else {
            svgElement = g.group(
              s.rect(0, 0, screenWidth, screenHeight).attr({
                fill: `#${newElement.value}`,
                id: newElement.id,
              }),
            );
          }
          break;
        case "text":
          newElement.top = newElement.top === undefined ? 0 : newElement.top;
          newElement.left = newElement.left === undefined ? 0 : newElement.left;

          // Split the text into words
          var words = newElement.value.split(" ");

          // Create an array to hold the lines of text
          var lines: any = [];
          var currLine = 0;
          lines[0] = [];

          // Create a temporary group to measure text widths
          var tempGroup = g.group();

          // Iterate over the words
          words.forEach(function (word) {
            // Create a temporary text element to measure the width
            var tempText = tempGroup.text(0, 0, word + "\u00A0").attr({
              "font-size": newElement.size,
              dy: "1em",
            });

            // Get the width of the text
            var textWidth = tempText.getBBox().width;

            // Check if adding this word would exceed the maximum width
            var lineWidth = lines[currLine].reduce(function (
              sum: any,
              word: any,
            ) {
              return sum + word.width;
            }, 0);
            if (lineWidth + textWidth > (newElement.width ?? 0)) {
              // Start a new line
              currLine += 1;
              lines[currLine] = [];
            }

            // Add the word to the current line
            lines[currLine].push({
              text: word,
              width: textWidth,
            });

            // Remove the temporary text element
            tempText.remove();
          });

          // Remove the temporary group
          tempGroup.remove();

          // Create the actual text elements
          lines.forEach(function (line: any, i: any) {
            var text = line
              .map(function (word: any) {
                return word.text;
              })
              .join(" ");

            var textElement = g
              .text(
                newElement.left,
                (newElement.top ?? 0) + i * (newElement.size ?? 0),
                text,
              )
              .attr({
                fill: `#${newElement.color}`,
                id: newElement.id,
                fontSize: newElement.size,
                cursor: "pointer !important",
                dy: "1em",
              });

            if (newElement.textAlign === CENTER) {
              textElement.attr({
                textAnchor: "middle",
                x: (newElement.width ?? 0) / 2 + (newElement.left ?? 0),
              });
            }
            tempGroup.add(textElement);
          });
          if (activeElementId === newElement.id) {
            const bbox = tempGroup.getBBox();
            svgElement = createWrapperController(
              bbox,
              newElement,
              tempGroup,
              newElement.type,
            );
          } else {
            svgElement = tempGroup;
          }
          break;

        case "input":
          newElement.top = newElement.top === undefined ? 0 : newElement.top;
          newElement.left = newElement.left === undefined ? 0 : newElement.left;
          const inputSvg = g.group();

          if (newElement.textAlign === CENTER) {
            const inputCenter = s
              .text(x + (newElement.width || 1) / 2, y, newElement.value)
              .attr({
                fill: `#${newElement.color}`,
                id: newElement.id,
                fontSize: newElement.size,
                textAnchor: "middle",
                textDecoration: "underline",
                cursor: "default",
                dy: "1em",
                fontFamily: newElement.face,
              });
            inputSvg.add(inputCenter);
          } else if (newElement.textAlign === LEFT) {
            const inputCenter = s.text(x, y, newElement.value).attr({
              fill: `#${newElement.color}`,
              id: newElement.id,
              fontSize: newElement.size,
              textAnchor: "start",
              textDecoration: "underline",
              cursor: "default",
              dy: "1em",
              fontFamily: newElement.face,
            });
            inputSvg.add(inputCenter);
          } else {
            const inputCenter = s
              .text(x + (newElement.width || 0), y, newElement.value)
              .attr({
                fill: `#${newElement.color}`,
                id: newElement.id,
                fontSize: newElement.size,
                textAnchor: "end",
                textDecoration: "underline",
                cursor: "default",
                dy: "1em",
                fontFamily: newElement.face,
              });
            inputSvg.add(inputCenter);
          }

          const bboxInput = inputSvg.getBBox();
          if (activeElementId === newElement.id) {
            svgElement = createWrapperController(
              bboxInput,
              newElement,
              inputSvg,
              newElement.type,
              undefined,
            );
          } else {
            svgElement = inputSvg;
          }
          break;
        case "image":
          elementUrl = `${getBaseUrl()}/media/assets/${
            newElement.value
          }/source`;
          const imageElement = g
            .group(
              s.image(elementUrl, 0, 0).attr({
                id: newElement.id,
                preserveAspectRatio: "none",
              }),
            )
            .transform(`t${x},${y}`);
          const bboxImage = imageElement.getBBox();
          if (activeElementId === newElement.id) {
            svgElement = g.group(
              s
                .rect(
                  bboxImage.x,
                  bboxImage.y,
                  bboxImage.width,
                  bboxImage.height,
                )
                .attr({
                  fill: "#ffffff",
                  stroke: "#00ff00",
                  fillOpacity: 0,
                  strokeWidth: 1,
                }),
              imageElement,
            );
          } else {
            svgElement = imageElement;
          }
          break;
        case "video":
          elementUrl = `${getBaseUrl()}/media/assets/${
            newElement.value
          }/thumbnail`;
          const videoElement = s
            .image(elementUrl, 0, 0, newElement.width, newElement.height)
            .attr({
              id: newElement.id,
              preserveAspectRatio: "none",
            });
          const bboxVideo = videoElement.getBBox();
          if (activeElementId === newElement.id) {
            svgElement = g.group(
              s
                .rect(
                  bboxVideo.x,
                  bboxVideo.y,
                  bboxVideo.width,
                  bboxVideo.height,
                )
                .attr({
                  fill: "#ffffff",
                  stroke: "#00ff00",
                  fillOpacity: 0,
                  strokeWidth: 1,
                }),
              videoElement,
            );
          } else {
            svgElement = videoElement;
          }
          break;
        default:
          return;
      }

      if (svgElement) {
        const start = function (this: Snap.Element) {
          this.data("origTransform", this.transform().local);
          this.data("origBBox", this.getBBox());
        };
        const move = function (this: Snap.Element, dx: number, dy: number) {
          // Getting the original bounding box
          const origBBox = this.data("origBBox");

          // Calculating the new position
          let newX = origBBox.x + dx;
          let newY = origBBox.y + dy;

          // Checking if the new position would be outside the boundaries of the SVG container
          if (newX < 0) newX = 0;
          if (newY < 0) newY = 0;
          if (newX > screenWidth - origBBox.width)
            newX = screenWidth - origBBox.width;
          if (newY > screenHeight - origBBox.height)
            newY = screenHeight - origBBox.height;

          // Applying the new position
          this.attr({
            transform:
              this.data("origTransform") +
              (this.data("origTransform") ? "T" : "t") +
              [newX - origBBox.x, newY - origBBox.y],
          });
          updateElement(newElement, newX, newY);
        };
        const stop = function (this: Snap.Element) {
          const ele = this.getBBox();
        };
        svgElement.click(() => {
          onClickSVGElement(newElement.id, newElement.type);
        });
        if (newElement.type !== "bg" && newElement.type !== "video") {
          svgElement.drag(move, start, stop);
        }

        g.add(svgElement);
      }
    });

    if (gridViewState) {
      const offset = 10;
      const thickLineIn = 9;
      for (let i = 0; i <= screenWidth; i += offset) {
        let line;
        if (i % thickLineIn === 0) {
          line = g.group(
            s.line(i, 0, i, screenHeight).attr({
              stroke: "#616161",
              strokeWidth: 3,
            }),
          );
        } else {
          line = g.group(
            s.line(i, 0, i, screenHeight).attr({
              stroke: "#616161",
              strokeWidth: 1,
            }),
          );
        }
      }
      for (let i = 0; i <= screenHeight; i += offset) {
        let line;
        if (i % thickLineIn === 0) {
          line = g.group(
            s.line(0, i, screenWidth, i).attr({
              stroke: "#616161",
              strokeWidth: 3,
            }),
          );
        } else {
          line = g.group(
            s.line(0, i, screenWidth, i).attr({
              stroke: "#616161",
              strokeWidth: 1,
            }),
          );
        }
      }
    }
    if (showPlaylistState) {
      const g = s.g();

      const p = g
        .path("M10-5-10,15M15,0,0,15M0-5-20,15")
        .attr({
          fill: "none",
          stroke: "#00ff00",
        })
        .pattern(0, 0, 10, 10);
      if (screenWidth === 1366) {
        const area = g.rect(256, 288, 853, 480).attr({
          fill: p,
          "pointer-events": "none",
        });

        const line1 = s.line(256, 0, 256, 800).attr({
          stroke: "#00ff00",
          strokeWidth: 2,
        });

        const line2 = s.line(1110, 0, 1110, 800).attr({
          stroke: "#00ff00",
          strokeWidth: 2,
        });

        const line3 = s.line(0, 288, 1366, 288).attr({
          stroke: "#00ff00",
          strokeWidth: 2,
        });

        g.add(area, line1, line2, line3);
      } else if (screenWidth === 1280) {
        const area = g.rect(213.5, 320, 853, 480).attr({
          fill: p,
          "pointer-events": "none",
        });

        const line1 = s.line(213.5, 0, 213.5, 800).attr({
          stroke: "#00ff00",
          strokeWidth: 2,
        });

        const line2 = s.line(1066.5, 0, 1066.5, 800).attr({
          stroke: "#00ff00",
          strokeWidth: 2,
        });

        const line3 = s.line(0, 320, 1280, 320).attr({
          stroke: "#00ff00",
          strokeWidth: 2,
        });

        g.add(area, line1, line2, line3);
      } else if (screenWidth === 640) {
        const area = g.rect(0, 0, 640, 360).attr({
          fill: p,
          "pointer-events": "none",
          "fill-opacity": "0.5",
        });

        const line = s.line(0, 360, 640, 360).attr({
          stroke: "#00ff00",
          strokeWidth: 2,
          "stroke-opacity": "0.5",
        });

        g.add(area, line);
      }
    }

    areas.forEach((area) => {
      let areaElement;
      const coords = area.coords.split(",");
      switch (area.shape) {
        case "circle":
          const circleGroup = g.group(
            s.circle(coords[0], coords[1], coords[3]).attr({
              id: area.id,
              fill: "#006400",
              fillOpacity: 0.5,
            }),
            s.text(coords[0], coords[1], area.softkeyName).attr({
              fill: `white`,
              id: area.id,
              fontStyle: "italic",
              fontSize: 20,
              opacity: 0.8,
              textAnchor: "middle",
              dy: ".5em",
            }),
          );
          const circleBBox = circleGroup.getBBox();
          if (activeElementId === area.id) {
            areaElement = createWrapperController(
              circleBBox,
              undefined,
              circleGroup,
              area.type,
              area,
            );
          } else {
            areaElement = circleGroup;
          }
          break;
        case "rect":
          const rectGroup = g.group(
            s.rect(coords[0], coords[1], coords[2], coords[3]).attr({
              id: area.id,
              fill: "#006400",
              fillOpacity: 0.5,
            }),
            s
              .text(coords[0], coords[1], area.softkeyName || area.keyCodeName)
              .attr({
                fill: `white`,
                id: area.id,
                fontStyle: "italic",
                fontSize: 20,
                opacity: 0.8,
                textAnchor: "start",
                dy: "1em",
              }),
          );
          const rectBBox = rectGroup.getBBox();
          if (activeElementId === area.id) {
            areaElement = createWrapperController(
              rectBBox,
              undefined,
              rectGroup,
              area.type,
              area,
            );
          } else {
            areaElement = rectGroup;
          }
          break;
      }
      if (areaElement) {
        const start = function (this: Snap.Element) {
          this.data("origTransform", this.transform().local);
          this.data("origBBox", this.getBBox());
        };
        const move = function (this: Snap.Element, dx: number, dy: number) {
          // Getting the original bounding box
          const origBBox = this.data("origBBox");

          // Calculating the new position
          let newX = origBBox.x + dx;
          let newY = origBBox.y + dy;

          // Checking if the new position would be outside the boundaries of the SVG container
          if (newX < 0) newX = 0;
          if (newY < 0) newY = 0;
          if (newX > screenWidth - origBBox.width)
            newX = screenWidth - origBBox.width;
          if (newY > screenHeight - origBBox.height)
            newY = screenHeight - origBBox.height;

          // Applying the new position
          this.attr({
            transform:
              this.data("origTransform") +
              (this.data("origTransform") ? "T" : "t") +
              [newX - origBBox.x, newY - origBBox.y],
          });
          updateArea(area, newX, newY, POSITION);
        };
        const stop = function (this: Snap.Element) {
          const ele = this.getBBox();
        };
        areaElement.drag(move, start, stop);

        areaElement.click(() => {
          onClickSVGElement(area.id, area.type);
        });
      }
    });
  }

  function createWrapperController(
    bboxInput: BBox,
    element?: Elements,
    ElementSvg?: Snap.Element,
    type?: string,
    area?: TouchMapAreas,
  ) {
    const elementBBox = ElementSvg?.getBBox();
    const coords: number[] = area?.coords.split(",").map(Number) || [
      0, 0, 0, 0,
    ];
    let controller: any;
    let NewElementSVG;
    if (type === "area") {
      if (area?.shape === "circle") {
        controller = s
          .rect(bboxInput.x, bboxInput.y, coords[3] * 2, coords[3] * 2)
          .attr({
            fill: "#ffffff",
            stroke: "#00ff00",
            fillOpacity: 0,
          });
      } else {
        controller = s
          .rect(bboxInput.x, bboxInput.y, coords[2], coords[3])
          .attr({
            fill: "#ffffff",
            stroke: "#00ff00",
            fillOpacity: 0,
          });
      }
    } else {
      controller = s
        .rect(
          element?.left || bboxInput.x,
          element?.top || bboxInput.y,
          element?.width || bboxInput.width,
          element?.height || bboxInput.height,
        )
        .attr({
          fill: "#ffffff",
          stroke: "#00ff00",
          fillOpacity: 0,
        });
    }
    const controllerBBox = controller.getBBox();
    const controllerResize = g
      .group(
        s.rect(0, 0, 20, 10).attr({
          fill: "#32b447",
          transform: "matrix(0,1,-1,0,15,-5)",
          fillOpacity: 0.9,
        }),
        s.rect(0, 0, 10, 20).attr({
          fill: "#32b447",
          transform: "matrix(0,1,-1,0,15,5)",
          fillOpacity: 0.9,
        }),
      )
      .attr({
        id: "controllerResize",
        cursor: "se-resize",
        transform: `matrix(1,0,0,1,${controllerBBox.x2},${controllerBBox.y2})`,
      });

    const start = function (this: Snap.Element) {
      this.data("origTransform", this.transform().local);
      this.data("origBBox", this.getBBox());
    };

    const move = function (this: Snap.Element, dx: number, dy: number) {
      const origBBox = this.data("origBBox");

      let newSize = origBBox.width + dx;
      let newSizeY = origBBox.height + dy;

      if (
        element &&
        element?.width &&
        element?.left &&
        element?.height &&
        element?.top
      ) {
        if (element?.width + element.left + newSize >= screenWidth) return;
        if (element.height + element.top + newSizeY >= screenHeight) return;
      }
      if (element?.width + newSize <= 0) return;
      if (element?.height + newSizeY <= 0) return;

      if (type === "input") {
        controller.attr({
          width: controllerBBox.width + newSize,
        });
        controllerResize.attr({
          transform: `matrix(1,0,0,1,${controllerBBox.x2 + newSize},${controllerBBox.y2})`,
        });
        if (element && element.height)
          updateSizeOfElement(element, element.width + newSize, element.height);
      } else if (type === "text") {
        controller.attr({
          width: controllerBBox.width + newSize,
          height: controllerBBox.height + newSizeY,
        });
        controllerResize.attr({
          transform: `matrix(1,0,0,1,${controllerBBox.x2 + newSize},${controllerBBox.y2 + newSizeY})`,
        });
        if (element)
          updateSizeOfElement(
            element,
            element.width + newSize,
            element.height + newSizeY,
          );
      } else {
        let areaX = Number(area?.coords.split(",")[0]);
        let areaY = Number(area?.coords.split(",")[1]);
        let areaW = Number(area?.coords.split(",")[2]);
        let areaH = Number(area?.coords.split(",")[3]);

        if (areaW + areaX + newSize >= screenWidth) return;
        if (areaH + areaY + newSizeY >= screenHeight) return;
        if (area && areaW + newSize <= 0) return;
        if (area && areaH + newSizeY <= 0) return;

        controller.attr({
          width: controllerBBox.width + newSize,
          height: controllerBBox.height + newSizeY,
        });
        controllerResize.attr({
          transform: `matrix(1,0,0,1,${controllerBBox.x2 + newSize},${controllerBBox.y2 + newSizeY})`,
        });
        if (type === "area" && area) {
          updateArea(area, newSize, newSizeY, SIZE);
        }
      }

      const children = ElementSvg?.children();
      if (children && children.length > 0) {
        NewElementSVG = children[0];
        NewElementSVG.attr({
          width: controllerBBox.width + newSize,
          height: controllerBBox.height + newSizeY,
          id: "NewElementSVG",
        });
      }
    };

    const stop = function (this: Snap.Element) {
      const ele = this.getBBox();
    };

    controllerResize.drag(move, start, stop);

    if (type === "area") {
    }
    if (NewElementSVG) return g.group(ElementSvg, NewElementSVG);
    else return g.group(ElementSvg, controller);
  }

  return <svg id="svg" viewBox={`0 0 ${screenWidth} ${screenHeight}`}></svg>;
}
export default memo(PromptBuilder);
