export interface DayPart {
  id: string;
  name: string;
  start: number;
  end: number;
  active: boolean;
}

export interface DayPartRootState {
  daypart: {
    data: DayPart[];
    isLoading: boolean;
    error: string;
  };
}

export interface DaypartItem {
  id: string;
  name: string;
  time: string;
}
