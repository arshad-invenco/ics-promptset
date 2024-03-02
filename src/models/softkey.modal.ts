export interface Softkey {
  id: number;
  name: string;
  deviceType: string;
  side: string;
  offset: number;
  physicalCode: string;
}

export interface SoftkeyRootState {
  softkey: {
    data: Softkey[];
    isLoading: boolean;
    error: string;
  };
}
