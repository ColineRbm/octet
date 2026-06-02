import {
  ArrowLeftRight,
  Laptop,
  Monitor,
  Package,
  Shield,
  Stethoscope,
  Tablet,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { getDevice } from "../../../services/api";
import "./DeviceDetailPage.css";

interface Device {
  id: number;
  type: "desktop" | "laptop" | "tablet";
  brand: string;
  model: string | null;
  status: string;
  received_at: string;
  serial_number: string | null;
  donor: string | null;
  general_condition: string | null;
  accessories: string | null;
  notes: string | null;
  added_by_user_id: number;
  assigned_to_user_id: number | null;
  created_at: string;
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
  desktop: <Monitor size={30} />,
  laptop: <Laptop size={30} />,
  tablet: <Tablet size={30} />,
};

const TYPE_LABELS = {
  desktop: "Ordinateur fixe",
  laptop: "Ordinateur portable",
  tablet: "Tablette",
};

const DeviceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const data = await getDevice(Number(id));
        setDevice(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id]);

  if (loading) {
    return (
      <PageLayout title="Détail appareil">
        <div className="device-detail__loading">Chargement...</div>
      </PageLayout>
    );
  }

  if (!device) {
    return (
      <PageLayout title="Détail appareil">
        <div className="device-detail__not-found">Appareil introuvable.</div>
      </PageLayout>
    );
  }

  const statusConf = STATUS_CONFIG[device.status] ?? STATUS_CONFIG.to_sort;
  const daysInStock = Math.floor(
    (Date.now() - new Date(device.received_at).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  // Build timeline based on status
  const timeline = [
    {
      icon: <Package size={15} />,
      bg: "#E8EEF4",
      color: "#6B8499",
      title: "Appareil réceptionné",
      desc: "Enregistré dans le système.",
      date: new Date(device.created_at).toLocaleDateString("fr-FR"),
    },
    ...(device.status !== "to_sort"
      ? [
          {
            icon: <Stethoscope size={15} />,
            bg: "#E8EEF4",
            color: "#1C2B3A",
            title: "Pris en diagnostic",
            desc: "Un bénévole a pris l'appareil en charge.",
            date: "—",
          },
        ]
      : []),
    ...(["repairing", "quality_check", "ready", "attributed"].includes(
      device.status,
    )
      ? [
          {
            icon: <Wrench size={15} />,
            bg: "#FEF3DC",
            color: "#A06010",
            title: "Passé en réparation",
            desc: "Diagnostic terminé, réparation en cours.",
            date: "—",
          },
        ]
      : []),
    ...(["quality_check", "ready", "attributed"].includes(device.status)
      ? [
          {
            icon: <Shield size={15} />,
            bg: "#F3E8FA",
            color: "#6B30A0",
            title: "Contrôle N2",
            desc: "Qualité vérifiée par un autre bénévole.",
            date: "—",
          },
        ]
      : []),
    ...(device.status === "attributed"
      ? [
          {
            icon: <ArrowLeftRight size={15} />,
            bg: "#E8F4EE",
            color: "#1A7A45",
            title: "Attribué",
            desc: "L'appareil a été attribué à un bénéficiaire.",
            date: "—",
          },
        ]
      : []),
    ...(device.status === "unusable"
      ? [
          {
            icon: <Wrench size={15} />,
            bg: "#FDEDEC",
            color: "#A32D2D",
            title: "Déclaré hors service",
            desc: "L'appareil est irrécupérable.",
            date: "—",
          },
        ]
      : []),
  ];

  return (
    <PageLayout
      title={`${device.brand} ${device.model ?? ""}`}
      subtitle={`Appareils → Détail · #${String(device.id).padStart(4, "0")}`}
      actions={
        device.status === "ready" ? (
          <button
            type="button"
            className="topbar__btn topbar__btn--primary"
            onClick={() => navigate("/admin/attributions")}
          >
            <ArrowLeftRight size={15} /> Attribuer
          </button>
        ) : undefined
      }
    >
      <div className="device-detail">
        {/* HERO */}
        <div className="device-detail__hero">
          <div className="device-detail__hero-icon">
            {TYPE_ICONS[device.type]}
          </div>
          <div className="device-detail__hero-body">
            <div className="device-detail__hero-ref">
              Référence #{String(device.id).padStart(4, "0")} · Reçu le{" "}
              {new Date(device.received_at).toLocaleDateString("fr-FR")}
            </div>
            <div className="device-detail__hero-name">
              {device.brand} {device.model}
            </div>
            <div className="device-detail__hero-sub">
              {TYPE_LABELS[device.type]}
            </div>
          </div>
          <div className="device-detail__hero-status">
            <span
              className="device-detail__badge"
              style={{ background: statusConf.bg, color: statusConf.color }}
            >
              <span className="device-detail__badge-dot" />
              {statusConf.label}
            </span>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="device-detail__layout">
          <div className="device-detail__left">
            {/* INFOS */}
            <div className="device-detail__card">
              <div className="device-detail__card-head">
                <span className="device-detail__card-head-icon">
                  <Laptop size={16} />
                </span>
                <span className="device-detail__card-title">
                  Informations générales
                </span>
              </div>
              <div className="device-detail__card-body">
                <div className="device-detail__info-grid">
                  <div className="device-detail__info-item">
                    <span className="device-detail__info-label">Type</span>
                    <span className="device-detail__info-val">
                      {TYPE_LABELS[device.type]}
                    </span>
                  </div>
                  <div className="device-detail__info-item">
                    <span className="device-detail__info-label">Marque</span>
                    <span className="device-detail__info-val">
                      {device.brand}
                    </span>
                  </div>
                  <div className="device-detail__info-item">
                    <span className="device-detail__info-label">Modèle</span>
                    <span
                      className={`device-detail__info-val${!device.model ? " device-detail__info-val--muted" : ""}`}
                    >
                      {device.model ?? "—"}
                    </span>
                  </div>
                  <div className="device-detail__info-item">
                    <span className="device-detail__info-label">
                      Date réception
                    </span>
                    <span className="device-detail__info-val">
                      {new Date(device.received_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="device-detail__info-item">
                    <span className="device-detail__info-label">
                      N° de série
                    </span>
                    <span
                      className={`device-detail__info-val${!device.serial_number ? " device-detail__info-val--muted" : ""}`}
                    >
                      {device.serial_number ?? "—"}
                    </span>
                  </div>
                  <div className="device-detail__info-item">
                    <span className="device-detail__info-label">Donateur</span>
                    <span
                      className={`device-detail__info-val${!device.donor ? " device-detail__info-val--muted" : ""}`}
                    >
                      {device.donor ?? "—"}
                    </span>
                  </div>
                  <div className="device-detail__info-item">
                    <span className="device-detail__info-label">
                      État général
                    </span>
                    <span
                      className={`device-detail__info-val${!device.general_condition ? " device-detail__info-val--muted" : ""}`}
                    >
                      {device.general_condition ?? "—"}
                    </span>
                  </div>
                  <div className="device-detail__info-item">
                    <span className="device-detail__info-label">
                      Accessoires
                    </span>
                    <span
                      className={`device-detail__info-val${!device.accessories ? " device-detail__info-val--muted" : ""}`}
                    >
                      {device.accessories ?? "—"}
                    </span>
                  </div>
                </div>
                {device.notes && (
                  <div className="device-detail__notes-box">{device.notes}</div>
                )}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="device-detail__card">
              <div className="device-detail__card-head">
                <span className="device-detail__card-head-icon">
                  <Package size={16} />
                </span>
                <span className="device-detail__card-title">Historique</span>
                <span className="device-detail__card-meta">
                  {timeline.length} étape{timeline.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="device-detail__card-body">
                <div className="device-detail__timeline">
                  {timeline.map((item, index) => (
                    <div key={item.title} className="device-detail__tl-item">
                      <div className="device-detail__tl-left">
                        <div
                          className="device-detail__tl-dot"
                          style={{ background: item.bg, color: item.color }}
                        >
                          {item.icon}
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="device-detail__tl-line" />
                        )}
                      </div>
                      <div className="device-detail__tl-body">
                        <div className="device-detail__tl-title">
                          {item.title}
                        </div>
                        <div className="device-detail__tl-desc">
                          {item.desc}
                        </div>
                        <div className="device-detail__tl-meta">
                          {item.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="device-detail__right">
            {/* CTA si prêt */}
            {device.status === "ready" && (
              <div className="device-detail__cta">
                <div className="device-detail__cta-title">
                  Prêt à être attribué !
                </div>
                <div className="device-detail__cta-sub">
                  Cet appareil a passé toutes les étapes de contrôle qualité.
                </div>
                <button
                  type="button"
                  className="device-detail__cta-btn"
                  onClick={() => navigate("/admin/attributions")}
                >
                  <ArrowLeftRight size={15} /> Attribuer maintenant
                </button>
              </div>
            )}

            {/* MINI INFOS */}
            <div className="device-detail__mini-card">
              <div className="device-detail__mini-row">
                <span className="device-detail__mini-key">Durée en stock</span>
                <span className="device-detail__mini-val">
                  {daysInStock} jour{daysInStock > 1 ? "s" : ""}
                </span>
              </div>
              <div className="device-detail__mini-divider" />
              <div className="device-detail__mini-row">
                <span className="device-detail__mini-key">Statut actuel</span>
                <span
                  className="device-detail__mini-val"
                  style={{ color: statusConf.color }}
                >
                  {statusConf.label}
                </span>
              </div>
              <div className="device-detail__mini-divider" />
              <div className="device-detail__mini-row">
                <span className="device-detail__mini-key">CO₂ économisé</span>
                <span className="device-detail__mini-val device-detail__mini-val--success">
                  ~150 kg
                </span>
              </div>
              <div className="device-detail__mini-divider" />
              <div className="device-detail__mini-row">
                <span className="device-detail__mini-key">Donateur</span>
                <span className="device-detail__mini-val">
                  {device.donor ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DeviceDetailPage;
