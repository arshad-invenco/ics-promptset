export interface TouchMaskRootState {
  touchmask: {
    data: TouchMaskResponse;
    loading: boolean;
    error: string;
  };
}

export interface TouchMaskResponse {
  resultsMetadata: ResultsMetadata;
  results: TouchMask[];
}

interface ResultsMetadata {
  totalResults: number;
  pageIndex: number;
  pageSize: number;
}
export interface TouchMask {
  id: string;
  name: string;
  areas?: AreasEntity[] | null;
  description?: null;
  jsonBuildObject: JsonBuildObject;
}
export interface AreasEntity {
  id: string;
  type: string;
  shape: string;
  coords: string;
  softkeyId?: string;
}
export interface JsonBuildObject {
  id: string;
  fullName: string;
}

export interface TouchMaskPromptSets {
  id: string;
  name: string;
  status: string;
  version: string;
  code: string;
}
