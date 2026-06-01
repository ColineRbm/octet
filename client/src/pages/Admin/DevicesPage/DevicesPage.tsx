import {
  ArrowLeftRight,
  Eye,
  Laptop,
  Monitor,
  Plus,
  Search,
  Tablet,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { deleteDevice, getDevices } from "../../../services/api";
import "./DevicesPage.css";

interface Device {
  id: number;
  type: "desktop" | "laptop" | "tablet";
  brand: string;
  model: string | null;
  status: string;
  received_at: string;
  donor: string | null;
  notes: string | null;
  added_by_user_id: number;
  assigned_to_user_id: number | null;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  to_sort: { label: "À trier", color: "#6A6660", bg: "#F1EFE8" },
  diagnosing: { label: "Diagnostic", color: "#1C2B3A", bg: "#E8EEF4" },
  repairing: { label: "Réparation", color: "#A06010", bg: "#FEF3DC" },
  quality_check: { label: "Contrôle N2", color: "#6B30A0", bg: "#F3E8FA" },
  ready: { label: "À attribuer", color: "#1A7A45", bg: "#E8F4EE" },
  attributed: { label: "Attribué", color: "#C04800", bg: "#FEF0E4" },
  unusable: { label: "Hors service", color: "#A32D2D", bg: "#FDEDEC" },
};

const TYPE_ICONS = {
  desktop: <Monitor size={17} />,
  laptop: <Laptop size={17} />,
  tablet: <Tablet size={17} />,
};

const TYPE_LABELS = {
  desktop: "Ordinateur fixe",
  laptop: "Ordinateur portable",
  tablet: "Tablette",
};

const DevicesPage = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet appareil ?")) return;
    try {
      await deleteDevice(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = devices.filter((d) => {
    const matchSearch =
      !search ||
      d.brand.toLowerCase().includes(search.toLowerCase()) ||
      d.model?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchType = !typeFilter || d.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const countByStatus = (status: string) =>
    devices.filter((d) => d.status === status).length;

  if (loading) {
    return (
      <PageLayout title="Appareils" subtitle="Gestion du parc informatique">
        <div className="devices__loading">Chargement...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Appareils"
      subtitle="Gestion du parc informatique"
      actions={
        <button
          type="button"
          className="topbar__btn topbar__btn--primary"
          onClick={() => navigate("/admin/devices/new")}
        >
          <Plus size={15} /> Ajouter un appareil
        </button>
      }
    >
      <div className="devices">
        {/* STATS CHIPS */}
        <div className="devices__stats">
          <button
            type="button"
            className={`devices__stat-chip${statusFilter === "all" ? " devices__stat-chip--active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            <div>
              <div className="devices__stat-label">Tous</div>
              <div className="devices__stat-num">{devices.length}</div>
            </div>
          </button>

          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <button
              type="button"
              key={key}
              className={`devices__stat-chip${statusFilter === key ? " devices__stat-chip--active" : ""}`}
              onClick={() => setStatusFilter(key)}
            >
              <div
                className="devices__stat-dot"
                style={{ background: config.color }}
              />
              <div>
                <div className="devices__stat-label">{config.label}</div>
                <div className="devices__stat-num">{countByStatus(key)}</div>
              </div>
            </button>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="devices__toolbar">
          <div className="devices__search-wrap">
            <Search size={15} className="devices__search-icon" />
            <input
              className="devices__search-input"
              placeholder="Rechercher marque, modèle…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="devices__filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="laptop">Ordinateur portable</option>
            <option value="desktop">Ordinateur fixe</option>
            <option value="tablet">Tablette</option>
          </select>
          <span className="devices__result-count">
            {filtered.length} appareil{filtered.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* TABLE */}
        <div className="devices__table-wrap">
          <table className="devices__table">
            <thead>
              <tr>
                <th>Appareil</th>
                <th>Statut</th>
                <th>Date réception</th>
                <th>Donateur</th>
                <th>Notes</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="devices__empty">
                      <div className="devices__empty-icon">
                        <Laptop size={36} />
                      </div>
                      <div>Aucun appareil trouvé</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((device) => {
                  const statusConf =
                    STATUS_CONFIG[device.status] ?? STATUS_CONFIG.to_sort;
                  return (
                    <tr key={device.id}>
                      <td>
                        <div className="devices__device-cell">
                          <div className="devices__device-icon">
                            {TYPE_ICONS[device.type]}
                          </div>
                          <div>
                            <div className="devices__device-name">
                              {device.brand} {device.model}
                            </div>
                            <div className="devices__device-type">
                              {TYPE_LABELS[device.type]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="devices__badge"
                          style={{
                            background: statusConf.bg,
                            color: statusConf.color,
                          }}
                        >
                          <span className="devices__badge-dot" />
                          {statusConf.label}
                        </span>
                      </td>
                      <td
                        style={{ color: "var(--color-text-sub)", fontSize: 12 }}
                      >
                        {new Date(device.received_at).toLocaleDateString(
                          "fr-FR",
                        )}
                      </td>
                      <td
                        style={{ color: "var(--color-text-sub)", fontSize: 12 }}
                      >
                        {device.donor ?? "—"}
                      </td>
                      <td
                        style={{
                          color: "var(--color-text-sub)",
                          fontSize: 12,
                          maxWidth: 160,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {device.notes ?? "—"}
                      </td>
                      <td>
                        <div className="devices__actions-cell">
                          {device.status === "ready" && (
                            <button
                              type="button"
                              className="devices__action-btn devices__action-btn--primary"
                              title="Attribuer"
                              onClick={() => navigate("/admin/attributions")}
                            >
                              <ArrowLeftRight size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="devices__action-btn"
                            title="Voir le détail"
                            onClick={() =>
                              navigate(`/admin/devices/${device.id}`)
                            }
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            className="devices__action-btn devices__action-btn--danger"
                            title="Supprimer"
                            onClick={() => handleDelete(device.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
};

export default DevicesPage;
