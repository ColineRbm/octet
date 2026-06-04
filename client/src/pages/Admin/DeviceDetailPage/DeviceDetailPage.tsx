import { Laptop, Package, Shield, Stethoscope, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { DeviceIcon, LoadingState, StatusBadge } from "../../../components/ui";
import { TYPE_LABELS } from "../../../constants/device.constants";
import { getDevice } from "../../../services/api";
import type { Device } from "../../../types";
import "./DeviceDetailPage.css";

const buildTimeline = (device: Device) => {
  const items = [
    {
      icon: <Package size={15} />,
      bg: "#E8EEF4",
      color: "#4A6275",
      title: "Appareil réceptionné",
      desc: "Enregistré dans le système.",
      date: new Date(device.created_at).toLocaleDateString("fr-FR"),
    },
  ];

  if (device.status !== "to_sort") {
    items.push({
      icon: <Stethoscope size={15} />,
      bg: "#E8EEF4",
      color: "#1C2B3A",
      title: "Pris en diagnostic",
      desc: "Un bénévole a pris l'appareil en charge.",
      date: "—",
    });
  }

  if (
    ["repairing", "quality_check", "ready", "attributed"].includes(
      device.status,
    )
  ) {
    items.push({
      icon: <Wrench size={15} />,
      bg: "#FEF3DC",
      color: "#A06010",
      title: "Passé en réparation",
      desc: "Diagnostic terminé, réparation en cours.",
      date: "—",
    });
  }

  if (["quality_check", "ready", "attributed"].includes(device.status)) {
    items.push({
      icon: <Shield size={15} />,
      bg: "#F3E8FA",
      color: "#6B30A0",
      title: "Contrôle N2",
      desc: "Qualité vérifiée par un autre bénévole.",
      date: "—",
    });
  }

  if (device.status === "attributed") {
    items.push({
      icon: <Shield size={15} />,
      bg: "#E8F4EE",
      color: "#1A7A45",
      title: "Attribué",
      desc: "L'appareil a été attribué à un bénéficiaire.",
      date: "—",
    });
  }

  if (device.status === "unusable") {
    items.push({
      icon: <Wrench size={15} />,
      bg: "#FDEDEC",
      color: "#A32D2D",
      title: "Déclaré hors service",
      desc: "L'appareil est irrécupérable.",
      date: "—",
    });
  }

  return items;
};

const DeviceDetailPage = () => {
  const { id } = useParams();
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
        <LoadingState />
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

  const timeline = buildTimeline(device);
  const daysInStock = Math.floor(
    (Date.now() - new Date(device.received_at).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <PageLayout
      title={`${device.brand} ${device.model ?? ""}`}
      subtitle={`Appareils → Détail · #${String(device.id).padStart(4, "0")}`}
    >
      <div className="device-detail">
        {/* HERO */}
        <div className="device-detail__hero">
          <div className="device-detail__hero-icon">
            <DeviceIcon type={device.type} size={30} />
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
            <StatusBadge status={device.status} />
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
                  {[
                    { label: "Type", value: TYPE_LABELS[device.type] },
                    { label: "Marque", value: device.brand },
                    { label: "Modèle", value: device.model },
                    {
                      label: "Date réception",
                      value: new Date(device.received_at).toLocaleDateString(
                        "fr-FR",
                      ),
                    },
                    { label: "N° de série", value: device.serial_number },
                    { label: "Donateur", value: device.donor },
                    { label: "État général", value: device.general_condition },
                    { label: "Accessoires", value: device.accessories },
                  ].map(({ label, value }) => (
                    <div key={label} className="device-detail__info-item">
                      <span className="device-detail__info-label">{label}</span>
                      <span
                        className={`device-detail__info-val${!value ? " device-detail__info-val--muted" : ""}`}
                      >
                        {value ?? "—"}
                      </span>
                    </div>
                  ))}
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
            <div className="device-detail__mini-card">
              {[
                {
                  key: "Durée en stock",
                  val: `${daysInStock} jour${daysInStock > 1 ? "s" : ""}`,
                },
                { key: "CO₂ économisé", val: "~150 kg", success: true },
                { key: "Donateur", val: device.donor ?? "—" },
              ].map(({ key, val, success }, i, arr) => (
                <>
                  <div key={key} className="device-detail__mini-row">
                    <span className="device-detail__mini-key">{key}</span>
                    <span
                      className={`device-detail__mini-val${success ? " device-detail__mini-val--success" : ""}`}
                    >
                      {val}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="device-detail__mini-divider" />
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DeviceDetailPage;
