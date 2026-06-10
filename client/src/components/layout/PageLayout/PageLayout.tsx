import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./PageLayout.css";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const PageLayout = ({
  title,
  subtitle,
  actions,
  children,
}: PageLayoutProps) => {
  // This state controls the opening of the drawer on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="page-layout">
      {isSidebarOpen && (
        <button
          type="button"
          className="page-layout__overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Fermer le menu"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="page-layout__main">
        <Topbar
          title={title}
          subtitle={subtitle}
          actions={actions}
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        />
        <div className="page-layout__content">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
