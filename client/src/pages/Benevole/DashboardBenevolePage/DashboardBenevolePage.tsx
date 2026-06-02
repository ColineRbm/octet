import { useEffect, useState } from "react";
import {
  CheckCircle,
  History,
  Laptop,
  Leaf,
  Monitor,
  Shield,
  BarChart3,
  Stethoscope,
  Tablet,
  Wrench,
  XCircle,
} from "lucide-react";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getDevices,
  getMyDevices,
  updateDeviceStatus,
} from "../../../services/api";
import "./DashboardBenevolePage.css";

interface Device {
  id: number;
  type: "desktop" | "laptop" | "tablet";
  brand: string;
  model: string | null;
  status: string;
  received_at: string;
  assigned_to_user_id: number | null;
}

const TYPE_ICONS = {
  desktop: <Monitor size={18} />,
  laptop: <Laptop size={18} />,
  tablet: <Tablet size={18} />,
};

const TYPE_LABELS = {
  desktop: "Ordinateur fixe",
  laptop: "Ordinateur portable",
  tablet: "Tablette",
};

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

type Tab = "file" | "history" | "stats";

const DashboardBenevolePage = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [myDevices, setMyDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("file");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [allData, myData] = await Promise.all([
        getDevices(),
        getMyDevices(),
      ]);
      setDevices(allData);
      setMyDevices(myData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    deviceId: number,
    newStatus: string,
    assignedTo: number | null,
  ) => {
    try {
      await updateDeviceStatus(deviceId, newStatus, assignedTo);
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // File de travail
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

  // Historique — appareils traités (status != to_sort et assigned ou ajouté par moi)
  const historyDevices = myDevices.filter(
    (d) => !["to_sort"].includes(d.status),
  );

  // Stats
  const totalTreated = myDevices.length;
  const totalRepaired = myDevices.filter((d) =>
    ["ready", "attributed", "quality_check"].includes(d.status),
  ).length;
  const totalUnusable = myDevices.filter((d) => d.status === "unusable").length;
  const successRate =
    totalTreated > 0 ? Math.round((totalRepaired / totalTreated) * 100) : 0;
  const co2Saved = totalRepaired * 150;

  if (loading) {
    return (
      <PageLayout
        title="Ma file de travail"
        subtitle="Tableau de bord bénévole"
      >
        <div className="dashboard-benevole__loading">Chargement...</div>
      </PageLayout>
    );
  }

  const renderDeviceRow = (device: Device, actions: React.ReactNode) => {
    const statusConf = STATUS_CONFIG[device.status];
    return (
      <div key={device.id} className="dashboard-benevole__device-row">
        <div className="dashboard-benevole__device-icon">
          {TYPE_ICONS[device.type]}
        </div>
        <div className="dashboard-benevole__device-body">
          <div className="dashboard-benevole__device-name">
            {device.brand} {device.model}
          </div>
          <div className="dashboard-benevole__device-sub">
            {TYPE_LABELS[device.type]}
          </div>
        </div>
        {statusConf && (
          <span
            className="dashboard-benevole__badge"
            style={{ background: statusConf.bg, color: statusConf.color }}
          >
            <span className="dashboard-benevole__badge-dot" />
            {statusConf.label}
          </span>
        )}
        <div className="dashboard-benevole__device-actions">{actions}</div>
      </div>
    );
  };

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
          <button
            type="button"
            className={`dashboard-benevole__tab${activeTab === "file" ? " dashboard-benevole__tab--active" : ""}`}
            onClick={() => setActiveTab("file")}
          >
            <Laptop size={14} /> Ma file (
            {myDiagnosing.length + myRepairing.length + toSort.length})
          </button>
          <button
            type="button"
            className={`dashboard-benevole__tab${activeTab === "history" ? " dashboard-benevole__tab--active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <History size={14} /> Mon historique ({historyDevices.length})
          </button>
          <button
            type="button"
            className={`dashboard-benevole__tab${activeTab === "stats" ? " dashboard-benevole__tab--active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <BarChart3 size={14} /> Mes stats
          </button>
        </div>

        {/* TAB — MA FILE */}
        {activeTab === "file" && (
          <div className="dashboard-benevole__grid">
            <div className="dashboard-benevole__card">
              <div className="dashboard-benevole__card-head">
                <div className="dashboard-benevole__card-head-left">
                  <Laptop size={15} />
                  <span className="dashboard-benevole__card-title">
                    Nouveaux arrivages
                  </span>
                </div>
                <span className="dashboard-benevole__card-count">
                  {toSort.length}
                </span>
              </div>
              <div className="dashboard-benevole__card-body">
                {toSort.length === 0 ? (
                  <div className="dashboard-benevole__empty">
                    <CheckCircle
                      size={24}
                      style={{ color: "var(--color-success)" }}
                    />
                    <div>Aucun appareil à trier</div>
                  </div>
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
                )}
              </div>
            </div>

            <div className="dashboard-benevole__card">
              <div className="dashboard-benevole__card-head">
                <div className="dashboard-benevole__card-head-left">
                  <Stethoscope size={15} />
                  <span className="dashboard-benevole__card-title">
                    Mes diagnostics
                  </span>
                </div>
                <span className="dashboard-benevole__card-count">
                  {myDiagnosing.length}
                </span>
              </div>
              <div className="dashboard-benevole__card-body">
                {myDiagnosing.length === 0 ? (
                  <div className="dashboard-benevole__empty">
                    <div>Aucun diagnostic en cours</div>
                  </div>
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
                )}
              </div>
            </div>

            <div className="dashboard-benevole__card">
              <div className="dashboard-benevole__card-head">
                <div className="dashboard-benevole__card-head-left">
                  <Wrench size={15} />
                  <span className="dashboard-benevole__card-title">
                    Mes réparations
                  </span>
                </div>
                <span className="dashboard-benevole__card-count">
                  {myRepairing.length}
                </span>
              </div>
              <div className="dashboard-benevole__card-body">
                {myRepairing.length === 0 ? (
                  <div className="dashboard-benevole__empty">
                    <div>Aucune réparation en cours</div>
                  </div>
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
                )}
              </div>
            </div>

            <div className="dashboard-benevole__card">
              <div className="dashboard-benevole__card-head">
                <div className="dashboard-benevole__card-head-left">
                  <Shield size={15} />
                  <span className="dashboard-benevole__card-title">
                    Contrôles N2
                  </span>
                </div>
                <span className="dashboard-benevole__card-count">
                  {availableQC.length}
                </span>
              </div>
              <div className="dashboard-benevole__card-body">
                {availableQC.length === 0 ? (
                  <div className="dashboard-benevole__empty">
                    <div>Aucun contrôle N2 disponible</div>
                  </div>
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
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB — HISTORIQUE */}
        {activeTab === "history" && (
          <div className="dashboard-benevole__history">
            {historyDevices.length === 0 ? (
              <div
                className="dashboard-benevole__empty"
                style={{
                  background: "var(--color-white)",
                  border: "0.5px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  padding: 48,
                }}
              >
                <History size={36} style={{ color: "var(--color-border)" }} />
                <div>Aucun appareil traité pour l'instant</div>
              </div>
            ) : (
              historyDevices.map((device) => {
                const statusConf =
                  STATUS_CONFIG[device.status] ?? STATUS_CONFIG.to_sort;
                return (
                  <div
                    key={device.id}
                    className="dashboard-benevole__history-item"
                  >
                    <div
                      className="dashboard-benevole__history-icon"
                      style={{
                        background: "var(--color-abricot-pale)",
                        color: "var(--color-abricot-dark)",
                      }}
                    >
                      {TYPE_ICONS[device.type]}
                    </div>
                    <div className="dashboard-benevole__history-body">
                      <div className="dashboard-benevole__history-name">
                        {device.brand} {device.model}
                      </div>
                      <div className="dashboard-benevole__history-sub">
                        {TYPE_LABELS[device.type]} · Reçu le{" "}
                        {new Date(device.received_at).toLocaleDateString(
                          "fr-FR",
                        )}
                      </div>
                    </div>
                    <span
                      className="dashboard-benevole__history-badge"
                      style={{
                        background: statusConf.bg,
                        color: statusConf.color,
                      }}
                    >
                      {statusConf.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB — STATS */}
        {activeTab === "stats" && (
          <div>
            <div className="dashboard-benevole__stats-grid">
              <div className="dashboard-benevole__stats-card dashboard-benevole__stats-card--accent">
                <div
                  className="dashboard-benevole__stats-icon"
                  style={{
                    background: "rgba(244,162,97,0.15)",
                    color: "var(--color-abricot)",
                  }}
                >
                  <Laptop size={22} />
                </div>
                <div className="dashboard-benevole__stats-num">
                  {totalTreated}
                </div>
                <div className="dashboard-benevole__stats-label">
                  Appareils traités au total
                </div>
              </div>

              <div className="dashboard-benevole__stats-card">
                <div
                  className="dashboard-benevole__stats-icon"
                  style={{
                    background: "var(--color-success-pale)",
                    color: "var(--color-success)",
                  }}
                >
                  <CheckCircle size={22} />
                </div>
                <div className="dashboard-benevole__stats-num">
                  {totalRepaired}
                </div>
                <div className="dashboard-benevole__stats-label">
                  Réparations réussies
                </div>
              </div>

              <div className="dashboard-benevole__stats-card">
                <div
                  className="dashboard-benevole__stats-icon"
                  style={{
                    background: "var(--color-danger-pale)",
                    color: "var(--color-danger)",
                  }}
                >
                  <XCircle size={22} />
                </div>
                <div className="dashboard-benevole__stats-num">
                  {totalUnusable}
                </div>
                <div className="dashboard-benevole__stats-label">
                  Déclarés hors service
                </div>
              </div>
            </div>

            {/* TAUX DE SUCCÈS */}
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

            {/* CO2 */}
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
