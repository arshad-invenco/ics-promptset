import { Font } from "./fonts.modal";

export interface Language {
  languageSupportId: string;
  language: string;
  isoCode: string;
  default?: boolean;
  deleted?: boolean;
  promptSetLanguageSupport?: promptSetLanguageSupport;
  type?: Font;
  size?: number;
  isAvailableInPromptSet?: boolean;
}

export interface LanguageRootState {
  language: {
    data: Language[];
    isLoading: boolean;
    error: string;
  };
}

export interface promptSetLanguageSupport {
  type: string;
  size: number;
  default?: boolean;
  deleted: boolean;
}

export interface FaceType {
  fontId: string;
  name: string;
  family: string;
  type: string;
  supportedDevices: string[];
  active: boolean;
}
