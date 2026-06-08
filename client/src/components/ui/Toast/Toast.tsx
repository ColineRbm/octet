import { CheckCircle, XCircle } from "lucide-react";
import "./Toast.css";

interface ToastProps {
  message: string;
  type: "success" | "error";
}

const Toast = ({ message, type }: ToastProps) => {
  return (
    <div className={`toast toast--${type}`}>
      {type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
