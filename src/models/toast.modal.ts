export interface Toasts {
  message: string;
  className?: string;
  delay?: number;
  count?: number;
}

export interface ToastsState {
  toasts: Toasts[];
}
