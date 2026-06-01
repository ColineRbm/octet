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

  // Get user initials for avatar
  const initials = user
    ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase()
    : "??";

  // Admin nav items
  const adminNavItems = [
    { to: "/admin", label: "Tableau de bord", icon: "📊", end: true },
    { to: "/admin/devices", label: "Appareils", icon: "💻" },
    { to: "/admin/attributions", label: "Attributions", icon: "🔄" },
    { to: "/admin/beneficiaries", label: "Bénéficiaires", icon: "👥" },
    { to: "/admin/users", label: "Bénévoles", icon: "🙋" },
  ];

  // Benevole nav items
  const benevoleNavItems = [
    { to: "/benevole", label: "Ma file de travail", icon: "📋", end: true },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : benevoleNavItems;

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">♻</div>
        <div>
          <div className="sidebar__brand-name">Octet</div>
          <div className="sidebar__brand-tagline">Ressourcerie Numérique</div>
        </div>
      </div>

      {/* Navigation */}
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

      {/* User */}
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
          🚪
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
