import { useContext, useEffect } from "react";
import { Toast } from "react-bootstrap";
import { promptSetContext } from "../../../hooks/promptsetContext";
import "./toast.scss";

const ToastComponent = () => {
  const { toasts, toastDispatch } = useContext(promptSetContext);

  useEffect(() => {
    console.log(toasts);
  }, [toasts]);

  return (
    <>
      {toasts.map((toast, i) => (
        <Toast
          key={i}
            onClose={() =>
              toastDispatch({ type: "REMOVE_TOAST", payload: toast.id as string })
            }
          delay={toast.delay || 5000}
          autohide
          className={toast.className || "toaster"}
        >
          <span>
            <span>
              {toast.count && toast.count > 1 && (
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
