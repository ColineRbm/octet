import { Eye, Laptop, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import {
  DeviceIcon,
  EmptyState,
  LoadingState,
  StatusBadge,
  Toast,
} from "../../../components/ui";
import { STATUS_CONFIG } from "../../../constants/device.constants";
import { useDevices, useToast } from "../../../hooks";
import { deleteDevice } from "../../../services/api";
import type { DeviceStatus } from "../../../types";
import "./DevicesPage.css";

const getDaysInStock = (receivedAt: string) =>
  Math.floor(
    (Date.now() - new Date(receivedAt).getTime()) / (1000 * 60 * 60 * 24),
  );

const DevicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { devices, loading, refetch } = useDevices();
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    if (location.state?.toast) {
      showToast(location.state.toast);
    }
  }, [location.state, showToast]);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet appareil ?")) return;
    try {
      await deleteDevice(id);
      await refetch();
      showToast("Appareil supprimé avec succès !");
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("409")) {
        showToast(
          "Seuls les appareils en statut 'À trier' peuvent être supprimés.",
          "error",
        );
      } else {
        console.error(err);
        showToast("Une erreur est survenue.", "error");
      }
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
        <LoadingState />
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
              onClick={() => setStatusFilter(key as DeviceStatus)}
            >
              <div
                className="devices__stat-dot"
                style={{ background: config.dot }}
              />
              <div>
                <div className="devices__stat-label">{config.label}</div>
                <div className="devices__stat-num">{countByStatus(key)}</div>
              </div>
            </button>
          ))}
        </div>

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
                    <EmptyState
                      icon={<Laptop size={36} />}
                      message="Aucun appareil trouvé"
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((device) => {
                  const days = getDaysInStock(device.received_at);
                  const isOld = days > 30 && device.status === "to_sort";
                  return (
                    <tr key={device.id}>
                      <td>
                        <div className="devices__device-cell">
                          <div className="devices__device-icon">
                            <DeviceIcon type={device.type} />
                          </div>
                          <div>
                            <div className="devices__device-name">
                              {device.brand} {device.model}
                            </div>
                            <div className="devices__device-type">
                              {device.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={device.status} />
                      </td>
                      <td
                        style={{ color: "var(--color-text-sub)", fontSize: 12 }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                          }}
                        >
                          {new Date(device.received_at).toLocaleDateString(
                            "fr-FR",
                          )}
                          {isOld && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: "#92400E",
                                background: "#FDE68A",
                                padding: "1px 6px",
                                borderRadius: 10,
                                width: "fit-content",
                              }}
                            >
                              ⚠️ {days} jours
                            </span>
                          )}
                        </div>
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
                          {device.status === "to_sort" && (
                            <button
                              type="button"
                              className="devices__action-btn devices__action-btn--danger"
                              title="Supprimer"
                              onClick={() => handleDelete(device.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
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

      {toast && <Toast message={toast.message} type={toast.type} />}
    </PageLayout>
  );
};

export default DevicesPage;
