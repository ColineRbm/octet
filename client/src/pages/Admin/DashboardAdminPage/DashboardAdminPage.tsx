import { ArrowLeftRight, Laptop, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { LoadingState } from "../../../components/ui";
import { STATUS_CONFIG } from "../../../constants/device.constants";
import {
  useAttributions,
  useBeneficiaries,
  useDevices,
  useUsers,
} from "../../../hooks";
import "./DashboardAdminPage.css";

const DashboardAdminPage = () => {
  const navigate = useNavigate();
  const { devices, loading: loadingDevices } = useDevices();
  const { users, loading: loadingUsers } = useUsers();
  const { beneficiaries, loading: loadingBeneficiaries } = useBeneficiaries();
  const { attributions, loading: loadingAttributions } = useAttributions();

  const loading =
    loadingDevices ||
    loadingUsers ||
    loadingBeneficiaries ||
    loadingAttributions;

  if (loading) {
    return (
      <PageLayout title="Tableau de bord" subtitle="Vue d'ensemble">
        <LoadingState />
      </PageLayout>
    );
  }

  const statusCounts = devices.reduce(
    (acc, device) => {
      acc[device.status] = (acc[device.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const readyDevices = devices.filter((d) => d.status === "ready");
  const recentAttributions = attributions.slice(0, 4);

  return (
    <PageLayout
      title="Tableau de bord"
      subtitle="Vue d'ensemble de la ressourcerie"
    >
      <div className="dashboard">
        {/* KPIs */}
        <div className="dashboard__kpi-grid">
          <div className="dashboard__kpi-card dashboard__kpi-card--accent">
            <div className="dashboard__kpi-top">
              <div
                className="dashboard__kpi-icon"
                style={{
                  background: "rgba(244,162,97,0.15)",
                  color: "#F4A261",
                }}
              >
                <Laptop size={18} />
              </div>
              <div className="dashboard__kpi-trend dashboard__kpi-trend--up">
                <TrendingUp size={11} /> +3
              </div>
            </div>
            <div className="dashboard__kpi-num">{devices.length}</div>
            <div className="dashboard__kpi-label">Appareils en stock</div>
          </div>

          <div className="dashboard__kpi-card">
            <div className="dashboard__kpi-top">
              <div
                className="dashboard__kpi-icon"
                style={{
                  background: "var(--color-success-pale)",
                  color: "var(--color-success)",
                }}
              >
                <ArrowLeftRight size={18} />
              </div>
              <div className="dashboard__kpi-trend dashboard__kpi-trend--up">
                <TrendingUp size={11} /> +2
              </div>
            </div>
            <div className="dashboard__kpi-num">{attributions.length}</div>
            <div className="dashboard__kpi-label">Attributions total</div>
          </div>

          <div className="dashboard__kpi-card">
            <div className="dashboard__kpi-top">
              <div
                className="dashboard__kpi-icon"
                style={{
                  background: "var(--color-abricot-pale)",
                  color: "var(--color-abricot-dark)",
                }}
              >
                <Users size={18} />
              </div>
            </div>
            <div className="dashboard__kpi-num">{beneficiaries.length}</div>
            <div className="dashboard__kpi-label">Bénéficiaires</div>
          </div>

          <div className="dashboard__kpi-card">
            <div className="dashboard__kpi-top">
              <div
                className="dashboard__kpi-icon"
                style={{
                  background: "var(--color-ardoise-100)",
                  color: "var(--color-ardoise-600)",
                }}
              >
                <Users size={18} />
              </div>
              <div className="dashboard__kpi-trend dashboard__kpi-trend--neutral">
                = stable
              </div>
            </div>
            <div className="dashboard__kpi-num">
              {users.filter((u) => u.is_active).length}
            </div>
            <div className="dashboard__kpi-label">Bénévoles actifs</div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="dashboard__grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Répartition par statut */}
            <div className="dashboard__card">
              <div className="dashboard__card-head">
                <span className="dashboard__card-title">
                  Répartition par statut
                </span>
                <button
                  type="button"
                  className="dashboard__card-link"
                  onClick={() => navigate("/admin/devices")}
                >
                  Voir les appareils →
                </button>
              </div>
              <div className="dashboard__card-body">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                  const count = statusCounts[key] || 0;
                  const pct = Math.round((count / (devices.length || 1)) * 100);
                  return (
                    <div key={key} className="dashboard__statut-row">
                      <div
                        className="dashboard__statut-dot"
                        style={{ background: config.dot }}
                      />
                      <span className="dashboard__statut-label">
                        {config.label}
                      </span>
                      <span className="dashboard__statut-count">{count}</span>
                      <div className="dashboard__statut-bar">
                        <div
                          className="dashboard__statut-fill"
                          style={{ width: `${pct}%`, background: config.dot }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attributions récentes */}
            <div className="dashboard__card">
              <div className="dashboard__card-head">
                <span className="dashboard__card-title">
                  Attributions récentes
                </span>
                <button
                  type="button"
                  className="dashboard__card-link"
                  onClick={() => navigate("/admin/attributions")}
                >
                  Tout voir →
                </button>
              </div>
              <div className="dashboard__card-body">
                {recentAttributions.length === 0 ? (
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-sub)",
                      textAlign: "center",
                      padding: "16px 0",
                    }}
                  >
                    Aucune attribution pour l'instant
                  </div>
                ) : (
                  recentAttributions.map((attr, index) => (
                    <div key={attr.id} className="dashboard__activity-item">
                      <div className="dashboard__activity-dot-col">
                        <div
                          className="dashboard__activity-dot"
                          style={{ background: "var(--color-success)" }}
                        />
                        {index < recentAttributions.length - 1 && (
                          <div className="dashboard__activity-line" />
                        )}
                      </div>
                      <div>
                        <div className="dashboard__activity-text">
                          <strong>
                            {attr.brand} {attr.model}
                          </strong>{" "}
                          attribué à {attr.beneficiary_name}
                        </div>
                        <div className="dashboard__activity-meta">
                          {attr.attributed_by_firstname}{" "}
                          {attr.attributed_by_lastname} ·{" "}
                          {new Date(attr.attributed_at).toLocaleDateString(
                            "fr-FR",
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Prêts à attribuer */}
          <div className="dashboard__card">
            <div className="dashboard__card-head">
              <span className="dashboard__card-title">Prêts à attribuer</span>
              <span style={{ fontSize: 11, color: "var(--color-text-sub)" }}>
                {readyDevices.length} appareil
                {readyDevices.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="dashboard__card-body">
              {readyDevices.length === 0 ? (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-sub)",
                    textAlign: "center",
                    padding: "16px 0",
                  }}
                >
                  Aucun appareil prêt pour l'instant
                </div>
              ) : (
                readyDevices.map((device) => (
                  <div key={device.id} className="dashboard__ready-item">
                    <div className="dashboard__ready-icon">
                      <Laptop size={16} />
                    </div>
                    <div>
                      <div className="dashboard__ready-name">
                        {device.brand} {device.model}
                      </div>
                      <div className="dashboard__ready-sub">{device.type}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardAdminPage;
