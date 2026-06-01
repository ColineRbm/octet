import "./Topbar.css";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const Topbar = ({ title, subtitle, actions }: TopbarProps) => {
  return (
    <div className="topbar">
      <div className="topbar__left">
        <span className="topbar__title">{title}</span>
        {subtitle && <span className="topbar__subtitle">{subtitle}</span>}
      </div>
      {actions && <div className="topbar__right">{actions}</div>}
    </div>
  );
};

export default Topbar;
