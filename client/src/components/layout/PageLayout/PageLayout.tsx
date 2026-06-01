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
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-layout__main">
        <Topbar title={title} subtitle={subtitle} actions={actions} />
        <div className="page-layout__content">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
