import { set } from "snapsvg";
import { Language } from "../models/language.modal";
import { Lang, PromptSetInterface } from "../models/promptset.modal";
import isSequoiaDevice from "../services/promptsetService";
import { getDeviceType } from "./deviceType";
import { getFilteredFonts } from "./fontConstant";

let companyId = "";

export function setCompanyId(id: string) {
  companyId = id;
}

export function getCompanyId() {
  return companyId;
}

let companyLanguages: Language[] = [];

export function setCompanyLanguages(languages: Language[]) {
  companyLanguages = languages;
}

export function getCompanyLanguages() {
  return companyLanguages;
}

let promptSet: PromptSetInterface = {} as PromptSetInterface;

export function setPromptSet(promptSetData: PromptSetInterface) {
  promptSet = promptSetData;
}

export function getPromptSet() {
  return promptSet;
}

let isDefaultFontSettingsAvail = false;

export let languageKeysSet: string[] = [];

let defaultFontSettings: any = [];

export let langModalViewItems: Language[] = [];

export let defaultLanguageList: any = [];

export function setLangModalViewItems(languages: Language[]) {
  langModalViewItems = languages;
}

export function getLangModalViewItems() {
  return langModalViewItems;
}

const modalState = {
  add: false,
  edit: false,
  delete: false,
  error: false,
};

let defaultLanguage: { key: number; value: Language } = {} as {
  key: number;
  value: Language;
};

export const getPromptsetLanguages = () => {
  let promptsetLanguages = Object.values(promptSet?.lang || {});
  if (companyLanguages.length >= 1 && promptsetLanguages.length === 0) {
    const companyDefault = companyLanguages.find(
      (item) => item.default === true
    );
    if (companyDefault) {
      promptSet.lang[companyDefault.isoCode] = {
        languageSupportId: companyDefault.languageSupportId as string,
        language: companyDefault.language,
        isoCode: companyDefault.isoCode,
        promptSetLanguageSupport: {
          default: companyDefault.default || false,
          deleted: companyDefault.deleted || false,
        },
      };
      promptsetLanguages = Object.values(promptSet.lang);
    }
  } else {
    promptsetLanguages = promptsetLanguages;
  }
  languageKeysSet = Object.keys(promptSet?.lang || {});
  defaultFontSettings = getDefaults();
  return promptsetLanguages;
};

const getDefaults = () => {
  let defaults: any = {};
  if (companyLanguages.length === 0 && languageKeysSet.length === 0) {
    defaults = getDefaultFontSettings();
  } else {
    defaults = createDefaultFontSettings();
  }
  return defaults;
};

const getDefaultFontSettings = () => {
  try {
    const fontSettings = JSON.parse(
      localStorage.getItem("defaultFontSettings") || ""
    );
    const defaultFontSettings = fontSettings[promptSet.id] || {};
    isDefaultFontSettingsAvail = Object.keys(defaultFontSettings).length !== 0;
    return defaultFontSettings;
  } catch (err) {
    localStorage.setItem("defaultFontSettings", JSON.stringify({}));
    isDefaultFontSettingsAvail = false;
    return {};
  }
};

const createDefaultFontSettings = () => {
  const tempDefaultFontSettings = [];
  const promptsetLanguages = Object.values(promptSet.lang); // Get promptset languages
  for (const lang of promptsetLanguages) {
    const fallbackDefault: { size: number; face: any } = {
      size: 0,
      face: null,
    };
    if (isSequoiaDevice(promptSet.deviceType)) {
      // Set fallback defaults based on device type
      fallbackDefault.size = 48;
      fallbackDefault.face = {
        fontId: "Liberation Sans",
        name: "Liberation Sans",
        family: "Liberation Sans",
        type: "DEFAULT",
        supportedDevices: ["G7-100", "G6-300", "G6-400"],
        active: true,
      };
    } else if (promptSet.deviceType === "G6-200") {
      fallbackDefault.size = 24;
      fallbackDefault.face = {
        fontId: "FreeSans",
        name: "FreeSans",
        family: "FreeSans",
        type: "DEFAULT",
        supportedDevices: ["G6-200"],
        active: true,
      };
    }

    if (lang.promptSetLanguageSupport.type === null) {
      lang.promptSetLanguageSupport.type = fallbackDefault.face.name;
    }

    if (lang.promptSetLanguageSupport.size === null) {
      lang.promptSetLanguageSupport.size = fallbackDefault.size;
    }
    const font = getFilteredFonts().find(
      (item) => item.name === lang.promptSetLanguageSupport.type
    );
    const defaultItem = {
      isoCode: lang.isoCode,
      fontFace: font,
      fontSize: lang.promptSetLanguageSupport.size,
    };
    tempDefaultFontSettings.push(defaultItem);
  }
  return tempDefaultFontSettings;
};

export const createModalInfo = () => {
  for (const companyLanguage of companyLanguages) {
    const languageDetails = getTypeAndSize(
      companyLanguage.languageSupportId || ""
    );
    const isAvailable = isAvailableInPromptSet(companyLanguage);
    const item = {
      languageSupportId: companyLanguage.languageSupportId,
      isAvailableInPromptSet: isAvailable,
      isoCode: companyLanguage.isoCode,
      language: companyLanguage.language,
      default: companyLanguage.default,
      deleted: companyLanguage.deleted,
      type: getFontTypeByName(languageDetails.type),
      size: languageDetails.size,
    };
    langModalViewItems.push(item);
    handleLanguageCheck(item, item.isAvailableInPromptSet);
  }
  getDefaultLanguage();
};

export const getTypeAndSize = (languageSupportId: string) => {
  const fallbackDefault: { size: number; face: any } = {
    size: 0,
    face: null,
  };
  const deviceType = getDeviceType();
  if (isSequoiaDevice(deviceType)) {
    fallbackDefault.size = 48;
    fallbackDefault.face = {
      fontId: "Liberation Sans",
      name: "Liberation Sans",
      family: "Liberation Sans",
      type: "DEFAULT",
      supportedDevices: ["G7-100", "G6-300", "G6-400"],
      active: true,
    };
  } else if (deviceType === "G6-200") {
    fallbackDefault.size = 24;
    fallbackDefault.face = {
      fontId: "FreeSans",
      name: "FreeSans",
      family: "FreeSans",
      type: "DEFAULT",
      supportedDevices: ["G6-200"],
      active: true,
    };
  }
  const psLanguageSupport = companyLanguages.find(
    (psLang) =>
      psLang.languageSupportId?.toLowerCase() ===
      languageSupportId.toLowerCase()
  );
  return {
    type:
      (psLanguageSupport &&
        promptSet.lang[psLanguageSupport.isoCode]?.promptSetLanguageSupport
          .type) ||
      fallbackDefault.face.name,
    size:
      (psLanguageSupport &&
        promptSet.lang[psLanguageSupport.isoCode]?.promptSetLanguageSupport
          .size) ||
      fallbackDefault.size,
  };
};

export const isAvailableInPromptSet = (companyLanguage: Language) => {
  const promptSetLanguage = Object.values(promptSet.lang).find(
    (item) => item.languageSupportId === companyLanguage.languageSupportId
  );
  return !!promptSetLanguage;
};

export const getFontTypeByName = (type: string) => {
  const fontIndex = getFilteredFonts().findIndex((item) => item.name === type);
  if (fontIndex >= 1) {
    return getFilteredFonts()[fontIndex];
  }
};

export const handleLanguageCheck = (
  langModalViewItem: Language,
  value: boolean
) => {
  langModalViewItem.isAvailableInPromptSet = value;
  createDefaultLanguageList();
  languageValidation();
};

export const createDefaultLanguageList = () => {
  defaultLanguageList = languageKeysSet.filter((item: string) => {
    return promptSet.lang[item].promptSetLanguageSupport.default;
  });
};

export const languageValidation = () => {
  const invalidLangs = langModalViewItems.filter((item: Language) => {
    if (item.isAvailableInPromptSet) {
      return (
        item.type === null ||
        item.type === undefined ||
        item.size === null ||
        item.size === undefined ||
        item.size < 1
      );
    }
  });
  const selectedLanguages = getSelectedLanguages();
  modalState.error = invalidLangs.length >= 1 || selectedLanguages.length === 0;

  if (defaultLanguage !== undefined && modalState.error === false) {
    const defaultChecked = selectedLanguages.filter(
      (item: Language) => item?.language === defaultLanguage?.value?.language
    );
    modalState.error = defaultChecked.length === 0;
  }
};

export const getSelectedLanguages = () => {
  return langModalViewItems.filter(
    (item: Language) => item.isAvailableInPromptSet === true
  );
};

export const getDefaultLanguage = () => {
  const existingDefaultIndex = langModalViewItems.findIndex(
    (item: Language) => item.default === true
  );
  if (existingDefaultIndex >= 0) {
    defaultLanguage = {
      key: existingDefaultIndex,
      value: langModalViewItems[existingDefaultIndex],
    };
  }
  return defaultLanguage;
};

export const onPromptLanguageSave = (newDefaultLanguage: Language) => {
  languageValidation();
  setNewDefault(newDefaultLanguage);
  const languages: Language[] = langModalViewItems.map((item: Language) => ({
    languageSupportId: item.languageSupportId,
    isoCode: item.isoCode,
    language: item.language,
    promptSetLanguageSupport: {
      type: item.type === undefined || item.type === null ? "" : item.type.name,
      size: item.size === null || item.size === undefined ? 0 : item.size,
      default: item.default,
      deleted: !item.isAvailableInPromptSet,
    },
  }));

  const languagesModified = isLanguagesModified(languages);

  if (languagesModified) {
    return { languages: languages, modified: true };
  } else {
    return { languages: languages, modified: false };
  }
};

const isLanguagesModified = (newLanguages: Language[]) => {
  const existingLang = getPromptsetLanguages()
    .sort((a, b) => a.languageSupportId.localeCompare(b.languageSupportId))
    .map((item) => item.languageSupportId);
  const updatedLang = newLanguages
    .filter((item) => item.promptSetLanguageSupport?.deleted === false)
    .sort((a, b) => a.languageSupportId.localeCompare(b.languageSupportId))
    .map((item) => item.languageSupportId);
  if (existingLang.length !== updatedLang.length) return true;
  for (let i = 0; i < existingLang.length; i++) {
    if (existingLang[i] !== updatedLang[i]) {
      return true;
    }
  }
  return false;
};

export const setNewDefault = (newDefaultLanguage: Language) => {
  const newDefault = langModalViewItems.find(
    (item: Language) => item.language === newDefaultLanguage.language
  );
  langModalViewItems.forEach((item: Language) => {
    item.default = item.language === newDefault?.language;
  });
  languageValidation();
};
