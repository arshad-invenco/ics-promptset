export interface Language {
  languageSupportId: string;
  language: string;
  isoCode: string;
  default: boolean;
}

export interface LanguageRootState {
  language: {
    data: Language[];
    isLoading: boolean;
    error: string;
  };
}
