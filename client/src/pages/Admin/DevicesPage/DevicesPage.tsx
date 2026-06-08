import { Eye, Laptop, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import {
  DeviceIcon,
  EmptyState,
  LoadingState,
  StatusBadge,
} from "../../../components/ui";
import { STATUS_CONFIG } from "../../../constants/device.constants";
import { useDevices } from "../../../hooks";
import { deleteDevice } from "../../../services/api";
import type { DeviceStatus } from "../../../types";
import "./DevicesPage.css";

const DevicesPage = () => {
  const navigate = useNavigate();
  const { devices, loading, refetch } = useDevices();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState("");

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet appareil ?")) return;
    try {
      await deleteDevice(id);
      await refetch();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("409")) {
        alert(
          "Seuls les appareils en statut 'À trier' peuvent être supprimés.",
        );
      } else {
        console.error(err);
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
                    <EmptyState
                      icon={<Laptop size={36} />}
                      message="Aucun appareil trouvé"
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((device) => (
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
                      {new Date(device.received_at).toLocaleDateString("fr-FR")}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
};

export default DevicesPage;
