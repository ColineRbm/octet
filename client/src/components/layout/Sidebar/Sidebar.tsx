import {
  ArrowLeftRight,
  Laptop,
  LayoutDashboard,
  LogOut,
  Recycle,
  UserCheck,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user
    ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase()
    : "??";

  const adminNavItems = [
    {
      to: "/admin",
      label: "Tableau de bord",
      icon: <LayoutDashboard size={16} />,
      end: true,
    },
    { to: "/admin/devices", label: "Appareils", icon: <Laptop size={16} /> },
    {
      to: "/admin/attributions",
      label: "Attributions",
      icon: <ArrowLeftRight size={16} />,
    },
    {
      to: "/admin/beneficiaries",
      label: "Bénéficiaires",
      icon: <Users size={16} />,
    },
    { to: "/admin/users", label: "Bénévoles", icon: <UserCheck size={16} /> },
  ];

  const benevoleNavItems = [
    {
      to: "/benevole",
      label: "Ma file de travail",
      icon: <LayoutDashboard size={16} />,
      end: true,
    },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : benevoleNavItems;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">
          <Recycle size={18} />
        </div>
        <div>
          <div className="sidebar__brand-name">Octet</div>
          <div className="sidebar__brand-tagline">Ressourcerie Numérique</div>
        </div>
      </div>

      <nav className="sidebar__section">
        <span className="sidebar__section-label">Navigation</span>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__nav-item${isActive ? " sidebar__nav-item--active" : ""}`
            }
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <hr className="sidebar__divider" />

      <div className="sidebar__user">
        <div className="sidebar__user-avatar">{initials}</div>
        <div>
          <div className="sidebar__user-name">
            {user?.firstname} {user?.lastname}
          </div>
          <div className="sidebar__user-role">
            {user?.role === "admin" ? "Administrateur" : "Bénévole"}
          </div>
        </div>
        <button
          type="button"
          className="sidebar__logout-btn"
          onClick={handleLogout}
          aria-label="Se déconnecter"
          title="Se déconnecter"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
