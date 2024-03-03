export interface Size {
  name: string;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
}

export interface AssetParams {
  [key: string]: any;
  order?: string;
  pageIndex: number;
  pageSize: number;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  videoExtension?: string;
}

export interface AssetResponse {
  resultsMetadata: {
    totalResults: number;
    pageIndex: number;
    pageSize: number;
  };
  results: Asset[];
}

export interface Asset {
  id: string;
  name: string;
  width?: null;
  height?: null;
  status: string;
  size: number;
  type: string;
  uploaded: string;
  company: string;
  thumbnailUrl?: null;
  sourceUrl: string;
  uploader: Uploader;
  properties: Properties;
  active: boolean;
}
export interface Uploader {
  id: string;
  fullName: string;
  company: Company;
}

export interface Company {
  id: string;
  name: string;
}

export interface Properties {
  mimeType?: string;
  face?: string;
  version?: string;
  fullName?: string;
  copyright?: string;
  familyName?: string;
  subfamilyName?: string;
  postscriptName?: string;
}

export interface AssetRootState {
  asset: {
    data: AssetResponse;
    loading: boolean;
    error: string;
  };
}

export interface Order {
  id: number;
  name: string;
  title: string;
  value: string;
}
