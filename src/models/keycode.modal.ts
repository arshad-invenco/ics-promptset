export interface Keycode {
  id?: string;
  code: string;
  name: string;
}
export interface KeycodeRootState {
  keycode: {
    data: Keycode[];
    isLoading: boolean;
    error: string;
  };
}
