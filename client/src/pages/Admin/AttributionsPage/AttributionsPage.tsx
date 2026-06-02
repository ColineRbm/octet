import { useEffect, useState } from "react";
import { ArrowLeftRight, Laptop, Monitor, Tablet } from "lucide-react";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { getAttributions } from "../../../services/api";
import "./AttributionsPage.css";

interface Attribution {
  id: number;
  cession_type: "donation" | "cession";
  price: string;
  attributed_at: string;
  notes: string | null;
  brand: string;
  model: string;
  device_type: "desktop" | "laptop" | "tablet";
  beneficiary_name: string;
  beneficiary_firstname: string | null;
  structure_type: string;
  attributed_by_firstname: string;
  attributed_by_lastname: string;
}

const TYPE_ICONS = {
  desktop: <Monitor size={15} />,
  laptop: <Laptop size={15} />,
  tablet: <Tablet size={15} />,
};

const AttributionsPage = () => {
  const [attributions, setAttributions] = useState<Attribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttributions = async () => {
      try {
        const data = await getAttributions();
        setAttributions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttributions();
  }, []);

  const totalDonations = attributions.filter(
    (a) => a.cession_type === "donation",
  ).length;
  const totalCessions = attributions.filter(
    (a) => a.cession_type === "cession",
  ).length;
  const totalCollected = attributions
    .filter((a) => a.cession_type === "cession")
    .reduce((acc, a) => acc + Number(a.price), 0);

  if (loading) {
    return (
      <PageLayout title="Attributions" subtitle="Historique des attributions">
        <div className="attributions__loading">Chargement...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Attributions" subtitle="Historique des attributions">
      <div className="attributions">
        {/* STATS */}
        <div className="attributions__stats">
          <div className="attributions__stat-card">
            <div className="attributions__stat-label">
              <div
                className="attributions__stat-dot"
                style={{ background: "#1A7A45" }}
              />
              Dons gratuits
            </div>
            <div className="attributions__stat-num">{totalDonations}</div>
            <div className="attributions__stat-sub">appareils offerts</div>
          </div>
          <div className="attributions__stat-card">
            <div className="attributions__stat-label">
              <div
                className="attributions__stat-dot"
                style={{ background: "#F4A261" }}
              />
              Cessions solidaires
            </div>
            <div className="attributions__stat-num">{totalCessions}</div>
            <div className="attributions__stat-sub">avec participation</div>
          </div>
          <div className="attributions__stat-card">
            <div className="attributions__stat-label">
              <div
                className="attributions__stat-dot"
                style={{ background: "#6B30A0" }}
              />
              Montant collecté
            </div>
            <div className="attributions__stat-num">{totalCollected} €</div>
            <div className="attributions__stat-sub">via les cessions</div>
          </div>
        </div>

        {/* TABLE */}
        <div className="attributions__card">
          <div className="attributions__card-head">
            <span className="attributions__card-title">
              Toutes les attributions ({attributions.length})
            </span>
          </div>

          {attributions.length === 0 ? (
            <div className="attributions__empty">
              <ArrowLeftRight
                size={36}
                style={{ color: "var(--color-border)" }}
              />
              <div>Aucune attribution pour l'instant</div>
            </div>
          ) : (
            <table className="attributions__table">
              <thead>
                <tr>
                  <th>Appareil</th>
                  <th>Bénéficiaire</th>
                  <th>Type</th>
                  <th>Prix</th>
                  <th>Date</th>
                  <th>Par</th>
                </tr>
              </thead>
              <tbody>
                {attributions.map((attr) => (
                  <tr key={attr.id}>
                    <td>
                      <div className="attributions__device-cell">
                        <div className="attributions__device-icon">
                          {TYPE_ICONS[attr.device_type]}
                        </div>
                        <div>
                          <div className="attributions__device-name">
                            {attr.brand} {attr.model}
                          </div>
                          <div className="attributions__device-type">
                            {attr.device_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {attr.beneficiary_firstname
                          ? `${attr.beneficiary_firstname} ${attr.beneficiary_name}`
                          : attr.beneficiary_name}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "var(--color-text-sub)" }}
                      >
                        {attr.structure_type}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`attributions__cession-badge attributions__cession-badge--${attr.cession_type}`}
                      >
                        {attr.cession_type === "donation" ? "Don" : "Cession"}
                      </span>
                    </td>
                    <td
                      style={{ color: "var(--color-text-sub)", fontSize: 12 }}
                    >
                      {attr.cession_type === "donation"
                        ? "Gratuit"
                        : `${attr.price} €`}
                    </td>
                    <td
                      style={{ color: "var(--color-text-sub)", fontSize: 12 }}
                    >
                      {new Date(attr.attributed_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td
                      style={{ color: "var(--color-text-sub)", fontSize: 12 }}
                    >
                      {attr.attributed_by_firstname}{" "}
                      {attr.attributed_by_lastname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AttributionsPage;
