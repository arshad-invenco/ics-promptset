import { PromptType } from "../models/promptset.modal";

let promptSetId = "";

export function setPromptSetId(id: string) {
  promptSetId = id;
}

export const AssetsDropdownMapping: {
  [key: string]: { icon: string; text: string; type: string };
} = {
  bg: {
    icon: "far fa-square",
    text: "Background",
    type: "bg",
  },
  text: {
    icon: "fas fa-font",
    text: "Text",
    type: "text",
  },
  input: {
    icon: "fas fa-i-cursor",
    text: "Input",
    type: "input",
  },
  image: {
    icon: "far fa-image",
    text: "Image",
    type: "image",
  },
  video: {
    icon: "fas fa-video",
    text: "Video",
    type: "video",
  },
  touchmask: {
    icon: "far fa-hand-pointer",
    text: "Touch Mask",
    type: "touchmask",
  },
  area: {
    icon: "fas fa-square",
    text: "Touch Area",
    type: "area",
  },
};

export const TEXT = "text";
export const INPUT = "input";
export const BG = "bg";
export const IMAGE = "image";
export const TOUCH_MASK = "touchmask";
export const AREA = "area";
export const VIDEO = "video";

export const ICON = "icon";
export const STATE = "state";
export const CHILD_STATE = "child_state";
export const EXCEPTION = "exception";
export const TYPE = "type";

export const ELEMENTS_LIST = [BG, TEXT, IMAGE, VIDEO, INPUT, TOUCH_MASK, AREA];

export const PROMPT_TYPES: PromptType[] = [
  { id: "1", name: "Standard" },
  { id: "2", name: "PIN" },
  { id: "3", name: "Data" },
];

export const CENTER = "center";
export const LEFT = "left";
export const RIGHT = "right";
export const TOP = "top";
export const BOTTOM = "bottom";
export const POSITION = "middle";
export const SIZE = "size";
export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical";
