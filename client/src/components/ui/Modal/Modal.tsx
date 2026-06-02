import { X } from "lucide-react";
import type { ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  footer: ReactNode;
  children: ReactNode;
}

const Modal = ({ title, icon, onClose, footer, children }: ModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__head">
          {icon && <div className="modal__head-icon">{icon}</div>}
          <span className="modal__title">{title}</span>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">{footer}</div>
      </div>
    </div>
  );
};

export default Modal;
