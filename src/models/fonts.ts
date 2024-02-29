export interface Font {
  fontId: string;
  name: string;
  assetName?: string;
  family: string;
  type: string;
  supportedDevices: string[];
  sourceUrl?: string;
  active: boolean;
  fileSize?: number;
  mimeType?: string;
}

export interface FontRootState {
  font: {
    data: Font[];
    isLoading: boolean;
    error: string;
  };
}
