export interface Notification {
  id?: string;
  message: string;
  className?: string;
  delay?: number;
  count?: number;
}

type AddToastAction = {
  type: "ADD_TOAST";
  payload: Notification;
};

type RemoveToastAction = {
  type: "REMOVE_TOAST";
  payload: string;
};

type ClearToastsAction = {
  type: "CLEAR_TOASTS";
};

export type ToastAction =
  | AddToastAction
  | RemoveToastAction
  | ClearToastsAction;
