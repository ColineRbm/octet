import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import "./Modal.css";

interface ModalProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  footer: ReactNode;
  children: ReactNode;
}

const Modal = ({ title, icon, onClose, footer, children }: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const titleId = "modal-title";

  // Fermeture avec Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap — Tab et Shift+Tab
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab — si on est sur le premier élément, on va au dernier
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab — si on est sur le dernier élément, on va au premier
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus sur le premier élément à l'ouverture
  useEffect(() => {
    const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();
  }, []);

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) onClose();
      }}
    >
      <dialog ref={modalRef} className="modal" aria-labelledby={titleId} open>
        <div className="modal__head">
          {icon && <div className="modal__head-icon">{icon}</div>}
          <span id={titleId} className="modal__title">
            {title}
          </span>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Fermer la modale"
          >
            <X size={16} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">{footer}</div>
      </dialog>
    </div>
  );
};

export default Modal;
