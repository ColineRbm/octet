import {
  Building2,
  GraduationCap,
  Heart,
  HelpCircle,
  Mail,
  MapPin,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { createBeneficiary, getBeneficiaries } from "../../../services/api";
import "./BeneficiariesPage.css";

interface Beneficiary {
  id: number;
  name: string;
  firstname: string | null;
  structure_type: "family" | "school" | "association" | "other";
  contact: string | null;
  address: string | null;
  created_at: string;
}

const STRUCTURE_CONFIG = {
  family: {
    label: "Famille",
    icon: <Heart size={18} />,
    className: "beneficiaries__structure-badge--family",
  },
  school: {
    label: "École",
    icon: <GraduationCap size={18} />,
    className: "beneficiaries__structure-badge--school",
  },
  association: {
    label: "Association",
    icon: <Building2 size={18} />,
    className: "beneficiaries__structure-badge--association",
  },
  other: {
    label: "Autre",
    icon: <HelpCircle size={18} />,
    className: "beneficiaries__structure-badge--other",
  },
};

const BeneficiariesPage = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [structureType, setStructureType] = useState<
    "family" | "school" | "association" | "other"
  >("family");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const data = await getBeneficiaries();
      setBeneficiaries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name) return;
    setSubmitting(true);
    try {
      await createBeneficiary({
        name,
        firstname: firstname || null,
        structure_type: structureType,
        contact: contact || null,
        address: address || null,
      });
      await fetchBeneficiaries();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setFirstname("");
    setStructureType("family");
    setContact("");
    setAddress("");
  };

  if (loading) {
    return (
      <PageLayout title="Bénéficiaires" subtitle="Gestion des bénéficiaires">
        <div className="beneficiaries__loading">Chargement...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Bénéficiaires"
      subtitle={`${beneficiaries.length} bénéficiaire${beneficiaries.length > 1 ? "s" : ""} enregistré${beneficiaries.length > 1 ? "s" : ""}`}
      actions={
        <button
          type="button"
          className="topbar__btn topbar__btn--primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={15} /> Ajouter un bénéficiaire
        </button>
      }
    >
      <div className="beneficiaries">
        {beneficiaries.length === 0 ? (
          <div className="beneficiaries__empty">
            <Users size={36} style={{ color: "var(--color-border)" }} />
            <div>Aucun bénéficiaire pour l'instant</div>
          </div>
        ) : (
          <div className="beneficiaries__grid">
            {beneficiaries.map((b) => {
              const config = STRUCTURE_CONFIG[b.structure_type];
              return (
                <div key={b.id} className="beneficiaries__card">
                  <div className="beneficiaries__card-top">
                    <div className="beneficiaries__avatar">{config.icon}</div>
                    <div>
                      <div className="beneficiaries__name">
                        {b.firstname ? `${b.firstname} ${b.name}` : b.name}
                      </div>
                      <span
                        className={`beneficiaries__structure-badge ${config.className}`}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <hr className="beneficiaries__divider" />

                  <div className="beneficiaries__info">
                    {b.contact && (
                      <div className="beneficiaries__info-row">
                        <Mail size={12} />
                        {b.contact}
                      </div>
                    )}
                    {b.address && (
                      <div className="beneficiaries__info-row">
                        <MapPin size={12} />
                        {b.address}
                      </div>
                    )}
                  </div>

                  <div className="beneficiaries__footer">
                    Ajouté le{" "}
                    {new Date(b.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="beneficiaries__modal-overlay">
          <div className="beneficiaries__modal">
            <div className="beneficiaries__modal-head">
              <div className="beneficiaries__modal-head-icon">
                <Heart size={20} />
              </div>
              <span className="beneficiaries__modal-title">
                Ajouter un bénéficiaire
              </span>
              <button
                type="button"
                className="beneficiaries__modal-close"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="beneficiaries__modal-body">
              <div className="beneficiaries__modal-field">
                <label
                  htmlFor="structure-type"
                  className="beneficiaries__modal-label beneficiaries__modal-label--required"
                >
                  Type de bénéficiaire
                </label>
                <select
                  id="structure-type"
                  className="beneficiaries__modal-select"
                  value={structureType}
                  onChange={(e) =>
                    setStructureType(
                      e.target.value as
                        | "family"
                        | "school"
                        | "association"
                        | "other",
                    )
                  }
                >
                  <option value="family">Famille</option>
                  <option value="school">École</option>
                  <option value="association">Association</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="beneficiaries__modal-row">
                <div className="beneficiaries__modal-field">
                  <label
                    htmlFor="ben-firstname"
                    className="beneficiaries__modal-label"
                  >
                    Prénom
                  </label>
                  <input
                    id="ben-firstname"
                    className="beneficiaries__modal-input"
                    type="text"
                    placeholder="ex. Claire"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
                <div className="beneficiaries__modal-field">
                  <label
                    htmlFor="ben-name"
                    className="beneficiaries__modal-label beneficiaries__modal-label--required"
                  >
                    Nom / Structure
                  </label>
                  <input
                    id="ben-name"
                    className="beneficiaries__modal-input"
                    type="text"
                    placeholder="ex. Dupont ou École Jean Moulin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="beneficiaries__modal-row">
                <div className="beneficiaries__modal-field">
                  <label
                    htmlFor="ben-contact"
                    className="beneficiaries__modal-label"
                  >
                    Contact
                  </label>
                  <input
                    id="ben-contact"
                    className="beneficiaries__modal-input"
                    type="text"
                    placeholder="Email ou téléphone"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
                <div className="beneficiaries__modal-field">
                  <label
                    htmlFor="ben-address"
                    className="beneficiaries__modal-label"
                  >
                    Adresse
                  </label>
                  <input
                    id="ben-address"
                    className="beneficiaries__modal-input"
                    type="text"
                    placeholder="Ville ou adresse"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="beneficiaries__modal-footer">
              <button
                type="button"
                className="beneficiaries__modal-cancel"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                className="beneficiaries__modal-submit"
                onClick={handleSubmit}
                disabled={submitting || !name}
              >
                {submitting ? "Enregistrement..." : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default BeneficiariesPage;
