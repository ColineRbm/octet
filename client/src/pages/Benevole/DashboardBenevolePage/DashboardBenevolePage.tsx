import {
  BarChart3,
  CheckCircle,
  History,
  Laptop,
  Leaf,
  Shield,
  Stethoscope,
  Wrench,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import {
  DeviceIcon,
  EmptyState,
  LoadingState,
  StatusBadge,
} from "../../../components/ui";
import { TYPE_LABELS } from "../../../constants/device.constants";
import { useAuth } from "../../../contexts/AuthContext";
import { useMyActions, useMyDevices } from "../../../hooks";
import { updateDeviceStatus } from "../../../services/api";
import type { Device } from "../../../types";
import "./DashboardBenevolePage.css";

type Tab = "file" | "history" | "stats";

const ACTION_LABELS: Record<string, string> = {
  diagnosing: "Diagnostic",
  repairing: "Réparation",
  quality_check: "Contrôle N2",
  unusable: "Déclaré HS",
  ready: "Validé prêt",
};

const DashboardBenevolePage = () => {
  const { user } = useAuth();
  const { devices, loading: loadingDevices, refetch } = useMyDevices();
  const {
    actions,
    loading: loadingActions,
    refetch: refetchActions,
  } = useMyActions();
  const [activeTab, setActiveTab] = useState<Tab>("file");

  const loading = loadingDevices || loadingActions;

  const handleStatusUpdate = async (
    deviceId: number,
    newStatus: string,
    assignedTo: number | null,
  ) => {
    try {
      await updateDeviceStatus(deviceId, newStatus, assignedTo);
      await Promise.all([refetch(), refetchActions()]);
    } catch (err) {
      console.error(err);
    }
  };

  const toSort = devices.filter((d) => d.status === "to_sort");
  const myDiagnosing = devices.filter(
    (d) => d.status === "diagnosing" && d.assigned_to_user_id === user?.id,
  );
  const myRepairing = devices.filter(
    (d) => d.status === "repairing" && d.assigned_to_user_id === user?.id,
  );
  const availableQC = devices.filter(
    (d) => d.status === "quality_check" && d.assigned_to_user_id !== user?.id,
  );

  const totalTreated = new Set(actions.map((a) => a.device_id)).size;
  const totalRepaired = new Set(
    actions.filter((a) => a.action === "repairing").map((a) => a.device_id),
  ).size;
  const totalUnusable = new Set(
    actions.filter((a) => a.action === "unusable").map((a) => a.device_id),
  ).size;
  const successRate =
    totalTreated > 0 ? Math.round((totalRepaired / totalTreated) * 100) : 0;
  const co2Saved = totalRepaired * 150;

  if (loading) {
    return (
      <PageLayout
        title="Ma file de travail"
        subtitle="Tableau de bord bénévole"
      >
        <LoadingState />
      </PageLayout>
    );
  }

  const renderDeviceRow = (device: Device, actionsNode: React.ReactNode) => (
    <div key={device.id} className="dashboard-benevole__device-row">
      <div className="dashboard-benevole__device-icon">
        <DeviceIcon type={device.type} size={18} />
      </div>
      <div className="dashboard-benevole__device-body">
        <div className="dashboard-benevole__device-name">
          {device.brand} {device.model}
        </div>
        <div className="dashboard-benevole__device-sub">
          {TYPE_LABELS[device.type]}
        </div>
      </div>
      <StatusBadge status={device.status} />
      <div className="dashboard-benevole__device-actions">{actionsNode}</div>
    </div>
  );

  const renderCard = (
    icon: React.ReactNode,
    title: string,
    count: number,
    content: React.ReactNode,
  ) => (
    <div className="dashboard-benevole__card">
      <div className="dashboard-benevole__card-head">
        <div className="dashboard-benevole__card-head-left">
          {icon}
          <span className="dashboard-benevole__card-title">{title}</span>
        </div>
        <span className="dashboard-benevole__card-count">{count}</span>
      </div>
      <div className="dashboard-benevole__card-body">{content}</div>
    </div>
  );

  return (
    <PageLayout
      title="Ma file de travail"
      subtitle={`Bonjour ${user?.firstname} 👋`}
    >
      <div className="dashboard-benevole">
        {/* STATS RAPIDES */}
        <div className="dashboard-benevole__stats">
          <div className="dashboard-benevole__stat-card">
            <div className="dashboard-benevole__stat-top">
              <div
                className="dashboard-benevole__stat-icon"
                style={{
                  background: "var(--color-abricot-pale)",
                  color: "var(--color-abricot-dark)",
                }}
              >
                <Laptop size={18} />
              </div>
              <span className="dashboard-benevole__stat-period">en cours</span>
            </div>
            <div className="dashboard-benevole__stat-num">
              {myDiagnosing.length + myRepairing.length}
            </div>
            <div className="dashboard-benevole__stat-label">
              Mes appareils en cours
            </div>
          </div>

          <div className="dashboard-benevole__stat-card">
            <div className="dashboard-benevole__stat-top">
              <div
                className="dashboard-benevole__stat-icon"
                style={{
                  background: "var(--color-success-pale)",
                  color: "var(--color-success)",
                }}
              >
                <CheckCircle size={18} />
              </div>
              <span className="dashboard-benevole__stat-period">total</span>
            </div>
            <div className="dashboard-benevole__stat-num">{totalRepaired}</div>
            <div className="dashboard-benevole__stat-label">
              Réparations réussies
            </div>
          </div>

          <div className="dashboard-benevole__stat-card">
            <div className="dashboard-benevole__stat-top">
              <div
                className="dashboard-benevole__stat-icon"
                style={{ background: "#E8F4EE", color: "#1A7A45" }}
              >
                <Leaf size={18} />
              </div>
              <span className="dashboard-benevole__stat-period">économisé</span>
            </div>
            <div className="dashboard-benevole__stat-num">{co2Saved}</div>
            <div className="dashboard-benevole__stat-label">
              kg de CO₂ économisés
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="dashboard-benevole__tabs">
          {(
            [
              {
                id: "file",
                icon: <Laptop size={14} />,
                label: `Ma file (${myDiagnosing.length + myRepairing.length + toSort.length})`,
              },
              {
                id: "history",
                icon: <History size={14} />,
                label: `Mon historique (${actions.length})`,
              },
              {
                id: "stats",
                icon: <BarChart3 size={14} />,
                label: "Mes stats",
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`dashboard-benevole__tab${activeTab === tab.id ? " dashboard-benevole__tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB — MA FILE */}
        {activeTab === "file" && (
          <div className="dashboard-benevole__grid">
            {renderCard(
              <Laptop size={15} />,
              "Nouveaux arrivages",
              toSort.length,
              toSort.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle size={24} />}
                  message="Aucun appareil à trier"
                />
              ) : (
                toSort.map((device) =>
                  renderDeviceRow(
                    device,
                    <button
                      type="button"
                      className="dashboard-benevole__action-btn dashboard-benevole__action-btn--primary"
                      onClick={() =>
                        handleStatusUpdate(
                          device.id,
                          "diagnosing",
                          user?.id ?? null,
                        )
                      }
                    >
                      <Stethoscope size={12} /> Prendre en diagnostic
                    </button>,
                  ),
                )
              ),
            )}

            {renderCard(
              <Stethoscope size={15} />,
              "Mes diagnostics",
              myDiagnosing.length,
              myDiagnosing.length === 0 ? (
                <EmptyState message="Aucun diagnostic en cours" />
              ) : (
                myDiagnosing.map((device) =>
                  renderDeviceRow(
                    device,
                    <>
                      <button
                        type="button"
                        className="dashboard-benevole__action-btn dashboard-benevole__action-btn--success"
                        onClick={() =>
                          handleStatusUpdate(
                            device.id,
                            "repairing",
                            user?.id ?? null,
                          )
                        }
                      >
                        <Wrench size={12} /> Réparable
                      </button>
                      <button
                        type="button"
                        className="dashboard-benevole__action-btn dashboard-benevole__action-btn--danger"
                        onClick={() =>
                          handleStatusUpdate(device.id, "unusable", null)
                        }
                      >
                        <XCircle size={12} /> HS
                      </button>
                    </>,
                  ),
                )
              ),
            )}

            {renderCard(
              <Wrench size={15} />,
              "Mes réparations",
              myRepairing.length,
              myRepairing.length === 0 ? (
                <EmptyState message="Aucune réparation en cours" />
              ) : (
                myRepairing.map((device) =>
                  renderDeviceRow(
                    device,
                    <>
                      <button
                        type="button"
                        className="dashboard-benevole__action-btn dashboard-benevole__action-btn--purple"
                        onClick={() =>
                          handleStatusUpdate(
                            device.id,
                            "quality_check",
                            user?.id ?? null,
                          )
                        }
                      >
                        <Shield size={12} /> Réparé → N2
                      </button>
                      <button
                        type="button"
                        className="dashboard-benevole__action-btn dashboard-benevole__action-btn--danger"
                        onClick={() =>
                          handleStatusUpdate(device.id, "unusable", null)
                        }
                      >
                        <XCircle size={12} /> HS
                      </button>
                    </>,
                  ),
                )
              ),
            )}

            {renderCard(
              <Shield size={15} />,
              "Contrôles N2",
              availableQC.length,
              availableQC.length === 0 ? (
                <EmptyState message="Aucun contrôle N2 disponible" />
              ) : (
                availableQC.map((device) =>
                  renderDeviceRow(
                    device,
                    <>
                      <button
                        type="button"
                        className="dashboard-benevole__action-btn dashboard-benevole__action-btn--success"
                        onClick={() =>
                          handleStatusUpdate(device.id, "ready", null)
                        }
                      >
                        <CheckCircle size={12} /> Valider
                      </button>
                      <button
                        type="button"
                        className="dashboard-benevole__action-btn dashboard-benevole__action-btn--danger"
                        onClick={() =>
                          handleStatusUpdate(
                            device.id,
                            "repairing",
                            device.assigned_to_user_id,
                          )
                        }
                      >
                        <XCircle size={12} /> Refuser
                      </button>
                    </>,
                  ),
                )
              ),
            )}
          </div>
        )}

        {/* TAB — HISTORIQUE */}
        {activeTab === "history" && (
          <div className="dashboard-benevole__history">
            {actions.length === 0 ? (
              <EmptyState
                icon={<History size={36} />}
                message="Aucune action pour l'instant"
              />
            ) : (
              actions.map((action) => (
                <div
                  key={action.id}
                  className="dashboard-benevole__history-item"
                >
                  <div
                    className="dashboard-benevole__history-icon"
                    style={{
                      background: "var(--color-abricot-pale)",
                      color: "var(--color-abricot-dark)",
                    }}
                  >
                    <DeviceIcon type={action.type} size={18} />
                  </div>
                  <div className="dashboard-benevole__history-body">
                    <div className="dashboard-benevole__history-name">
                      {action.brand} {action.model}
                    </div>
                    <div className="dashboard-benevole__history-sub">
                      {TYPE_LABELS[action.type]} ·{" "}
                      {ACTION_LABELS[action.action] ?? action.action}
                    </div>
                  </div>
                  <span
                    style={{ fontSize: 11, color: "var(--color-text-sub)" }}
                  >
                    {new Date(action.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB — STATS */}
        {activeTab === "stats" && (
          <div>
            <div className="dashboard-benevole__stats-grid">
              {[
                {
                  icon: <Laptop size={22} />,
                  num: totalTreated,
                  label: "Appareils traités au total",
                  style: {
                    background: "rgba(244,162,97,0.15)",
                    color: "var(--color-abricot)",
                  },
                  accent: true,
                },
                {
                  icon: <CheckCircle size={22} />,
                  num: totalRepaired,
                  label: "Réparations réussies",
                  style: {
                    background: "var(--color-success-pale)",
                    color: "var(--color-success)",
                  },
                },
                {
                  icon: <XCircle size={22} />,
                  num: totalUnusable,
                  label: "Déclarés hors service",
                  style: {
                    background: "var(--color-danger-pale)",
                    color: "var(--color-danger)",
                  },
                },
              ].map(({ icon, num, label, style, accent }) => (
                <div
                  key={label}
                  className={`dashboard-benevole__stats-card${accent ? " dashboard-benevole__stats-card--accent" : ""}`}
                >
                  <div className="dashboard-benevole__stats-icon" style={style}>
                    {icon}
                  </div>
                  <div className="dashboard-benevole__stats-num">{num}</div>
                  <div className="dashboard-benevole__stats-label">{label}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "var(--color-white)",
                border: "0.5px solid var(--color-border)",
                borderRadius: "var(--radius)",
                padding: "18px 20px",
                marginBottom: 16,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text)",
                  }}
                >
                  Taux de réussite
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--color-success)",
                  }}
                >
                  {successRate}%
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "var(--color-ardoise-50)",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${successRate}%`,
                    background: "var(--color-success)",
                    borderRadius: 20,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-sub)",
                  marginTop: 6,
                }}
              >
                {totalRepaired} réparé{totalRepaired > 1 ? "s" : ""} sur{" "}
                {totalTreated} traité{totalTreated > 1 ? "s" : ""}
              </div>
            </div>

            <div className="dashboard-benevole__co2-card">
              <div className="dashboard-benevole__co2-icon">
                <Leaf size={28} />
              </div>
              <div>
                <div className="dashboard-benevole__co2-num">{co2Saved} kg</div>
                <div className="dashboard-benevole__co2-label">
                  de CO₂ économisés grâce à toi
                </div>
                <div className="dashboard-benevole__co2-sub">
                  ~150 kg par appareil reconditionné
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DashboardBenevolePage;
