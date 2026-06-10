import { ArrowLeftRight, Plus } from "lucide-react";
import { useState } from "react";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import {
  DeviceIcon,
  EmptyState,
  LoadingState,
  Modal,
  Toast,
} from "../../../components/ui";
import {
  useAttributions,
  useBeneficiaries,
  useDevices,
  useToast,
} from "../../../hooks";
import { createAttribution } from "../../../services/api";
import type { CessionType } from "../../../types";
import "./AttributionsPage.css";

const AttributionsPage = () => {
  const { attributions, loading, refetch } = useAttributions();
  const { devices } = useDevices();
  const { beneficiaries } = useBeneficiaries();
  const { toast, showToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [deviceId, setDeviceId] = useState<number | "">("");
  const [beneficiaryId, setBeneficiaryId] = useState<number | "">("");
  const [cessionType, setCessionType] = useState<CessionType>("donation");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const readyDevices = devices.filter((d) => d.status === "ready");

  const resetForm = () => {
    setDeviceId("");
    setBeneficiaryId("");
    setCessionType("donation");
    setPrice("");
    setError("");
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!deviceId || !beneficiaryId) {
      setError("Veuillez sélectionner un appareil et un bénéficiaire.");
      return;
    }
    if (cessionType === "cession" && !price) {
      setError("Veuillez indiquer un prix pour la cession.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createAttribution({
        device_id: Number(deviceId),
        beneficiary_id: Number(beneficiaryId),
        cession_type: cessionType,
        price: cessionType === "cession" ? Number(price) : 0,
      });
      await refetch();
      handleClose();
      showToast("Attribution créée avec succès !");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Réessayez.");
      showToast("Une erreur est survenue.", "error");
    } finally {
      setSubmitting(false);
    }
  };

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
        <LoadingState />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Attributions"
      subtitle="Historique des attributions"
      actions={
        <button
          type="button"
          className="topbar__btn topbar__btn--primary"
          onClick={() => setShowModal(true)}
          disabled={readyDevices.length === 0}
          title={
            readyDevices.length === 0
              ? "Aucun appareil prêt à attribuer"
              : undefined
          }
        >
          <Plus size={15} /> Nouvelle attribution
        </button>
      }
    >
      <div className="attributions">
        <div className="attributions__stats">
          <div className="attributions__stat-card">
            <div className="attributions__stat-label">
              <div
                className="attributions__stat-dot"
                style={{ background: "#10B981" }}
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
                style={{ background: "#8B5CF6" }}
              />
              Montant collecté
            </div>
            <div className="attributions__stat-num">{totalCollected} €</div>
            <div className="attributions__stat-sub">via les cessions</div>
          </div>
        </div>

        <div className="attributions__card">
          <div className="attributions__card-head">
            <span className="attributions__card-title">
              Toutes les attributions ({attributions.length})
            </span>
          </div>

          {attributions.length === 0 ? (
            <EmptyState
              icon={<ArrowLeftRight size={36} />}
              message="Aucune attribution pour l'instant"
            />
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
                          <DeviceIcon type={attr.device_type} size={15} />
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
                    <td data-label="Bénéficiaire">
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
                    <td data-label="Type">
                      <span
                        className={`attributions__cession-badge attributions__cession-badge--${attr.cession_type}`}
                      >
                        {attr.cession_type === "donation" ? "Don" : "Cession"}
                      </span>
                    </td>
                    <td
                      data-label="Prix"
                      style={{ color: "var(--color-text-sub)", fontSize: 12 }}
                    >
                      {attr.cession_type === "donation"
                        ? "Gratuit"
                        : `${attr.price} €`}
                    </td>
                    <td
                      data-label="Date"
                      style={{ color: "var(--color-text-sub)", fontSize: 12 }}
                    >
                      {new Date(attr.attributed_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td
                      data-label="Par"
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

      {showModal && (
        <Modal
          title="Nouvelle attribution"
          icon={<ArrowLeftRight size={20} />}
          onClose={handleClose}
          footer={
            <>
              <button
                type="button"
                className="beneficiaries__modal-cancel"
                onClick={handleClose}
              >
                Annuler
              </button>
              <button
                type="button"
                className="beneficiaries__modal-submit"
                onClick={handleSubmit}
                disabled={submitting || !deviceId || !beneficiaryId}
              >
                {submitting ? "Enregistrement..." : "Attribuer"}
              </button>
            </>
          }
        >
          {error && (
            <div
              style={{
                color: "var(--color-danger)",
                fontSize: 13,
                background: "var(--color-danger-pale)",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <div className="beneficiaries__modal-field">
            <label
              htmlFor="attr-device"
              className="beneficiaries__modal-label beneficiaries__modal-label--required"
            >
              Appareil à attribuer
            </label>
            <select
              id="attr-device"
              className="beneficiaries__modal-select"
              value={deviceId}
              onChange={(e) => setDeviceId(Number(e.target.value))}
            >
              <option value="">Sélectionner un appareil…</option>
              {readyDevices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.brand} {d.model} — {d.type}
                </option>
              ))}
            </select>
          </div>

          <div className="beneficiaries__modal-field">
            <label
              htmlFor="attr-beneficiary"
              className="beneficiaries__modal-label beneficiaries__modal-label--required"
            >
              Bénéficiaire
            </label>
            <select
              id="attr-beneficiary"
              className="beneficiaries__modal-select"
              value={beneficiaryId}
              onChange={(e) => setBeneficiaryId(Number(e.target.value))}
            >
              <option value="">Sélectionner un bénéficiaire…</option>
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.firstname ? `${b.firstname} ${b.name}` : b.name} —{" "}
                  {b.structure_type}
                </option>
              ))}
            </select>
          </div>

          <div className="beneficiaries__modal-field">
            <div className="beneficiaries__modal-label beneficiaries__modal-label--required">
              Type de cession
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {(["donation", "cession"] as CessionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCessionType(type)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${cessionType === type ? "var(--color-text)" : "var(--color-border)"}`,
                    background:
                      cessionType === type
                        ? "var(--color-ardoise-50)"
                        : "transparent",
                    fontWeight: cessionType === type ? 600 : 400,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {type === "donation"
                    ? "🎁 Don gratuit"
                    : "🤝 Cession solidaire"}
                </button>
              ))}
            </div>
          </div>

          {cessionType === "cession" && (
            <div className="beneficiaries__modal-field">
              <label
                htmlFor="attr-price"
                className="beneficiaries__modal-label beneficiaries__modal-label--required"
              >
                Participation demandée (€)
              </label>
              <input
                id="attr-price"
                className="beneficiaries__modal-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="ex. 20.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </PageLayout>
  );
};

export default AttributionsPage;
