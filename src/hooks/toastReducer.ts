import { Notification, ToastAction } from "../models/toast.modal";

export function toastReducer(
  toasts: Notification[],
  action: ToastAction
): Notification[] {
  let toastExistIndex;

  switch (action.type) {
    case "ADD_TOAST":
      toastExistIndex = toasts.findIndex(
        (existingToast) => existingToast.message === action.payload.message
      );

      if (toastExistIndex === -1) {
        return [...toasts, action.payload];
      } else {
        const existingToast = toasts[toastExistIndex];
        if (existingToast.count) {
          const newToasts = [...toasts];
          newToasts[toastExistIndex] = {
            ...existingToast,
            count: existingToast.count + 1,
          };
          return newToasts;
        }
        return toasts;
      }
    case "REMOVE_TOAST":
      return toasts.filter((toast) => toast.id !== action.payload);
    case "CLEAR_TOASTS":
      return [];
    default:
      throw new Error(`Unknown action: ${(action as ToastAction).type}`);
  }
}
