import { Menu } from "lucide-react";
import "./Topbar.css";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onMenuToggle: () => void;
}

const Topbar = ({ title, subtitle, actions, onMenuToggle }: TopbarProps) => {
  return (
    <div className="topbar">
      <div className="topbar__left">
        {/* Hamburger button — visible only on mobile via CSS */}
        <button
          type="button"
          className="topbar__menu-btn"
          onClick={onMenuToggle}
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} />
        </button>

        <div className="topbar__titles">
          <span className="topbar__title">{title}</span>
          {subtitle && <span className="topbar__subtitle">{subtitle}</span>}
        </div>
      </div>

      {actions && <div className="topbar__right">{actions}</div>}
    </div>
  );
};

export default Topbar;
