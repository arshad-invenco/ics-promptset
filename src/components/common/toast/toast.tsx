import React from "react";
import { Toast } from "react-bootstrap";
import "./toast.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectToasts } from "../../../redux/selectors/toastSelectors";
import { Toasts } from "../../../models/toast.modal";
import { removeToast } from "../../../redux/reducers/toastSlice";

const ToastComponent = () => {
  const dispatch = useDispatch();
  const toasts: Toasts[] = useSelector(selectToasts);

  return (
    <>
      {toasts.map((toast, i) => (
        <Toast
          key={i}
          onClose={() => dispatch(removeToast(toast))}
          delay={toast.delay || 5000}
          autohide
          className={toast.className || "toaster"}
        >
          <span>
            <span>
              {toast.count && toast.count > 0 && (
                <span className="toast-counter">{toast.count}</span>
              )}
            </span>
            {toast.message}
          </span>
        </Toast>
      ))}
    </>
  );
};

export default ToastComponent;
