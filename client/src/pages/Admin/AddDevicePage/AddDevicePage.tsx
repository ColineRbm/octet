import { Laptop, Monitor, Plus, Tablet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import {
  STATUS_CONFIG,
  TYPE_LABELS,
} from "../../../constants/device.constants";
import { createDevice } from "../../../services/api";
import type { DeviceStatus, DeviceType } from "../../../types";
import "./AddDevicePage.css";

const TYPE_OPTIONS: {
  value: DeviceType;
  icon: React.ReactElement;
  sub: string;
}[] = [
  { value: "laptop", icon: <Laptop size={22} />, sub: "Laptop, notebook" },
  { value: "desktop", icon: <Monitor size={22} />, sub: "Tour, tout-en-un" },
  { value: "tablet", icon: <Tablet size={22} />, sub: "iPad, Android" },
];

const STATUS_OPTIONS: DeviceStatus[] = [
  "to_sort",
  "diagnosing",
  "repairing",
  "ready",
  "unusable",
];

const AddDevicePage = () => {
  const navigate = useNavigate();

  const [type, setType] = useState<DeviceType>("laptop");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [receivedAt, setReceivedAt] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [serialNumber, setSerialNumber] = useState("");
  const [donor, setDonor] = useState("");
  const [generalCondition, setGeneralCondition] = useState("");
  const [accessories, setAccessories] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<DeviceStatus>("to_sort");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedType = TYPE_OPTIONS.find((t) => t.value === type);
  const selectedStatus = STATUS_CONFIG[status];

  const handleSubmit = async () => {
    if (!brand) {
      setError("La marque est obligatoire.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await createDevice({
        type,
        brand,
        model: model || null,
        status,
        received_at: receivedAt,
        serial_number: serialNumber || null,
        donor: donor || null,
        general_condition: generalCondition || null,
        accessories: accessories || null,
        notes: notes || null,
      });
      navigate("/admin/devices", {
        state: { toast: "Appareil enregistré avec succès !" },
      });
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Enregistrer un appareil"
      subtitle="Appareil reçu en donation"
    >
      <div className="add-device">
        <div className="add-device__sections">
          {/* TYPE */}
          <div className="add-device__section">
            <div className="add-device__section-head">
              <Laptop size={16} />
              <span className="add-device__section-title">Type d'appareil</span>
            </div>
            <div className="add-device__section-body">
              <div className="add-device__type-grid">
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`add-device__type-card${type === t.value ? " add-device__type-card--active" : ""}`}
                    onClick={() => setType(t.value)}
                  >
                    <div className="add-device__type-icon">{t.icon}</div>
                    <div>
                      <div className="add-device__type-label">
                        {TYPE_LABELS[t.value]}
                      </div>
                      <div className="add-device__type-sub">{t.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* IDENTIFICATION */}
          <div className="add-device__section">
            <div className="add-device__section-head">
              <Laptop size={16} />
              <span className="add-device__section-title">Identification</span>
            </div>
            <div className="add-device__section-body">
              <div className="add-device__field-row add-device__field-row--two">
                <div className="add-device__field">
                  <label
                    htmlFor="brand"
                    className="add-device__label add-device__label--required"
                  >
                    Marque
                  </label>
                  <input
                    id="brand"
                    className="add-device__input"
                    type="text"
                    placeholder="Dell, Apple, Lenovo…"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="add-device__field">
                  <label htmlFor="model" className="add-device__label">
                    Modèle
                  </label>
                  <input
                    id="model"
                    className="add-device__input"
                    type="text"
                    placeholder="ex. Latitude 5490"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
              </div>

              <div className="add-device__field-row add-device__field-row--three">
                <div className="add-device__field">
                  <label
                    htmlFor="received-at"
                    className="add-device__label add-device__label--required"
                  >
                    Date de réception
                  </label>
                  <input
                    id="received-at"
                    className="add-device__input"
                    type="date"
                    value={receivedAt}
                    onChange={(e) => setReceivedAt(e.target.value)}
                  />
                </div>
                <div className="add-device__field">
                  <label htmlFor="serial-number" className="add-device__label">
                    N° de série
                  </label>
                  <input
                    id="serial-number"
                    className="add-device__input"
                    type="text"
                    placeholder="ex. SN123456789"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </div>
                <div className="add-device__field">
                  <label htmlFor="donor" className="add-device__label">
                    Donateur
                  </label>
                  <input
                    id="donor"
                    className="add-device__input"
                    type="text"
                    placeholder="Particulier, entreprise…"
                    value={donor}
                    onChange={(e) => setDonor(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="add-device__section">
            <div className="add-device__section-head">
              <Laptop size={16} />
              <span className="add-device__section-title">Statut initial</span>
            </div>
            <div className="add-device__section-body">
              <div className="add-device__status-grid">
                {STATUS_OPTIONS.map((s) => {
                  const config = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`add-device__status-pill${status === s ? " add-device__status-pill--active" : ""}`}
                      style={status === s ? { borderColor: config.dot } : {}}
                      onClick={() => setStatus(s)}
                    >
                      <div
                        className="add-device__status-dot"
                        style={{ background: config.dot }}
                      />
                      <div>
                        <div className="add-device__status-label">
                          {config.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CONDITION & NOTES */}
          <div className="add-device__section">
            <div className="add-device__section-head">
              <Laptop size={16} />
              <span className="add-device__section-title">
                État & observations
              </span>
            </div>
            <div className="add-device__section-body">
              <div className="add-device__field-row add-device__field-row--two">
                <div className="add-device__field">
                  <label htmlFor="condition" className="add-device__label">
                    État général
                  </label>
                  <select
                    id="condition"
                    className="add-device__select"
                    value={generalCondition}
                    onChange={(e) => setGeneralCondition(e.target.value)}
                  >
                    <option value="">Sélectionner…</option>
                    <option value="Bon état apparent">Bon état apparent</option>
                    <option value="Quelques rayures">Quelques rayures</option>
                    <option value="Endommagé (boîtier)">
                      Endommagé (boîtier)
                    </option>
                    <option value="Inconnu">Inconnu</option>
                  </select>
                </div>
                <div className="add-device__field">
                  <label htmlFor="accessories" className="add-device__label">
                    Accessoires
                  </label>
                  <select
                    id="accessories"
                    className="add-device__select"
                    value={accessories}
                    onChange={(e) => setAccessories(e.target.value)}
                  >
                    <option value="">Sélectionner…</option>
                    <option value="Chargeur inclus">Chargeur inclus</option>
                    <option value="Sans chargeur">Sans chargeur</option>
                    <option value="Chargeur + souris">Chargeur + souris</option>
                    <option value="Complet">Complet (boîte d'origine)</option>
                  </select>
                </div>
              </div>
              <div className="add-device__field">
                <label htmlFor="notes" className="add-device__label">
                  Observations
                </label>
                <textarea
                  id="notes"
                  className="add-device__textarea"
                  placeholder="État, pièces manquantes, remarques…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "var(--color-danger-pale)",
                border: "0.5px solid #F0C0C0",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                fontSize: 13,
                color: "var(--color-danger)",
              }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* RECAP */}
        <div className="add-device__recap">
          <div className="add-device__recap-head">
            <span className="add-device__recap-title">Récapitulatif</span>
          </div>

          <div className="add-device__recap-preview">
            <div className="add-device__recap-icon">{selectedType?.icon}</div>
            <div>
              <div className="add-device__recap-device-name">
                {brand || "Nouvel appareil"} {model}
              </div>
              <div className="add-device__recap-device-sub">
                {TYPE_LABELS[type]}
              </div>
            </div>
          </div>

          <div className="add-device__recap-body">
            {[
              { key: "Type", val: TYPE_LABELS[type] },
              { key: "Marque", val: brand || null },
              { key: "Modèle", val: model || null },
            ].map(({ key, val }) => (
              <div key={key} className="add-device__recap-item">
                <span className="add-device__recap-key">{key}</span>
                <span
                  className={`add-device__recap-val${!val ? " add-device__recap-val--muted" : ""}`}
                >
                  {val || "Non renseigné"}
                </span>
              </div>
            ))}
            <hr className="add-device__recap-divider" />
            <div className="add-device__recap-item">
              <span className="add-device__recap-key">Statut initial</span>
              <span
                className="add-device__recap-val"
                style={{ color: selectedStatus.color }}
              >
                {selectedStatus.label}
              </span>
            </div>
            <div className="add-device__recap-item">
              <span className="add-device__recap-key">Date réception</span>
              <span className="add-device__recap-val">
                {new Date(receivedAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          <div className="add-device__recap-footer">
            <button
              type="button"
              className="add-device__submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Plus size={16} />
              {loading ? "Enregistrement..." : "Enregistrer l'appareil"}
            </button>
            <button
              type="button"
              className="add-device__cancel-btn"
              onClick={() => navigate("/admin/devices")}
            >
              Annuler
            </button>
          </div>

          <div className="add-device__security">
            🔒 Traçabilité complète en base
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AddDevicePage;
