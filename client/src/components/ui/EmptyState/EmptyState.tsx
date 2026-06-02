import type { ReactNode } from "react";
import "./EmptyState.css";

interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
}

const EmptyState = ({ icon, message }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <div className="empty-state__message">{message}</div>
    </div>
  );
};

export default EmptyState;
