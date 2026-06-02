import { useEffect, useState } from "react";
import {
  CheckCircle,
  Laptop,
  Monitor,
  Shield,
  Stethoscope,
  Tablet,
  Wrench,
  XCircle,
} from "lucide-react";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { getDevices, updateDeviceStatus } from "../../../services/api";
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
};

const DashboardBenevolePage = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusUpdate = async (
    deviceId: number,
    newStatus: string,
    assignedTo: number | null,
  ) => {
    try {
      await updateDeviceStatus(deviceId, newStatus, assignedTo);
      await fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  // Devices to sort (available for anyone)
  const toSort = devices.filter((d) => d.status === "to_sort");

  // My devices (assigned to me)
  const myDiagnosing = devices.filter(
    (d) => d.status === "diagnosing" && d.assigned_to_user_id === user?.id,
  );
  const myRepairing = devices.filter(
    (d) => d.status === "repairing" && d.assigned_to_user_id === user?.id,
  );

  // Available for quality check (not assigned to me, repaired by others)
  const availableQC = devices.filter(
    (d) => d.status === "quality_check" && d.assigned_to_user_id !== user?.id,
  );

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
        {/* STATS */}
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
                  background: "var(--color-neutral-pale)",
                  color: "var(--color-neutral)",
                }}
              >
                <Laptop size={18} />
              </div>
              <span className="dashboard-benevole__stat-period">
                disponibles
              </span>
            </div>
            <div className="dashboard-benevole__stat-num">{toSort.length}</div>
            <div className="dashboard-benevole__stat-label">
              Appareils à trier
            </div>
          </div>

          <div className="dashboard-benevole__stat-card">
            <div className="dashboard-benevole__stat-top">
              <div
                className="dashboard-benevole__stat-icon"
                style={{
                  background: "var(--color-purple-pale)",
                  color: "var(--color-purple)",
                }}
              >
                <Shield size={18} />
              </div>
              <span className="dashboard-benevole__stat-period">
                disponibles
              </span>
            </div>
            <div className="dashboard-benevole__stat-num">
              {availableQC.length}
            </div>
            <div className="dashboard-benevole__stat-label">
              Contrôles N2 disponibles
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="dashboard-benevole__grid">
          {/* À TRIER */}
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

          {/* MES DIAGNOSTICS */}
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

          {/* MES RÉPARATIONS */}
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

          {/* CONTRÔLE N2 */}
          <div className="dashboard-benevole__card">
            <div className="dashboard-benevole__card-head">
              <div className="dashboard-benevole__card-head-left">
                <Shield size={15} />
                <span className="dashboard-benevole__card-title">
                  Contrôles N2 disponibles
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
      </div>
    </PageLayout>
  );
};

export default DashboardBenevolePage;
