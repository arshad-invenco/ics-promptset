import { Font } from "../models/fonts.modal";
import { Elements } from "../models/promptset.modal";
import { getDeviceType } from "./deviceType";

export const DEFAULT_FONTS: Font[] = [
  {
    fontId: "Liberation Mono",
    name: "Liberation Mono",
    family: "Liberation Mono",
    type: "DEFAULT",
    supportedDevices: ["G7-100", "G6-300", "G6-400"],
    active: true,
  },
  {
    fontId: "Liberation Sans",
    name: "Liberation Sans",
    family: "Liberation Sans",
    type: "DEFAULT",
    supportedDevices: ["G7-100", "G6-300", "G6-400"],
    active: true,
  },
  {
    fontId: "Liberation Serif",
    name: "Liberation Serif",
    family: "Liberation Serif",
    type: "DEFAULT",
    supportedDevices: ["G7-100", "G6-300", "G6-400"],
    active: true,
  },
  {
    fontId: "FreeMono",
    name: "FreeMono",
    family: "FreeMono",
    type: "DEFAULT",
    supportedDevices: ["G6-200"],
    active: true,
  },
  {
    fontId: "FreeSans",
    name: "FreeSans",
    family: "FreeSans",
    type: "DEFAULT",
    supportedDevices: ["G6-200"],
    active: true,
  },
  {
    fontId: "FreeSerif",
    name: "FreeSerif",
    family: "FreeSerif",
    type: "DEFAULT",
    supportedDevices: ["G6-200"],
    active: true,
  },
  {
    fontId: "Museo Sans",
    name: "Museo Sans",
    family: "Museo Sans",
    type: "DEFAULT",
    supportedDevices: ["G7-100", "G6-300", "G6-400"],
    active: true,
  },
  {
    fontId: "Harabara",
    name: "Harabara",
    family: "Harabara",
    type: "DEFAULT",
    supportedDevices: ["G6-200"],
    active: true,
  },
  {
    fontId: "Source Han Sans SC",
    name: "Source Han Sans SC",
    family: "Source Han Sans SC",
    type: "DEFAULT",
    supportedDevices: ["G7-100", "G6-300", "G6-400"],
    active: true,
  },
];

export const uuidV4Regex =
  /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;

export function filterFonts(fonts: Font[], elementData: Elements): Font[] {
  let updatedFonts = fonts;

  if (elementData && elementData.face) {
    updatedFonts = fonts.filter(
      (font) => !(font.active === false && font.fontId !== elementData.face)
    );
  } else {
    updatedFonts = fonts.filter((font) => font.active === true);
  }

  updatedFonts = updatedFonts.filter((font) =>
    font.supportedDevices.some((device) =>
      device.startsWith(
        getDeviceType().split("-")[0] + "-" + getDeviceType().split("-")[1]
      )
    )
  );

  const customFonts = updatedFonts
    .filter((font) => uuidV4Regex.test(font.fontId))
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const defaultFonts = updatedFonts.filter(
    (font) => !uuidV4Regex.test(font.fontId)
  );

  updatedFonts = [...defaultFonts, ...customFonts];

  if (getDeviceType() === "G6-200") {
    updatedFonts = updatedFonts.filter((font) => {
      if (font.type === "CUSTOM") {
        return /(font\/ttf)$/i.test(font.mimeType ?? "");
      }

      return true;
    });
  }

  return updatedFonts;
}
