import {
  Building2,
  GraduationCap,
  Heart,
  HelpCircle,
  Mail,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { EmptyState, LoadingState, Modal } from "../../../components/ui";
import { useBeneficiaries } from "../../../hooks";
import { createBeneficiary } from "../../../services/api";
import type { StructureType } from "../../../types";
import "./BeneficiariesPage.css";

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
  const { beneficiaries, loading, refetch } = useBeneficiaries();
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [structureType, setStructureType] = useState<StructureType>("family");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setFirstname("");
    setStructureType("family");
    setContact("");
    setAddress("");
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
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
      await refetch();
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Bénéficiaires" subtitle="Gestion des bénéficiaires">
        <LoadingState />
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
          <EmptyState
            icon={<Users size={36} />}
            message="Aucun bénéficiaire pour l'instant"
          />
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
                        <Mail size={12} /> {b.contact}
                      </div>
                    )}
                    {b.address && (
                      <div className="beneficiaries__info-row">
                        <MapPin size={12} /> {b.address}
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

      {showModal && (
        <Modal
          title="Ajouter un bénéficiaire"
          icon={<Heart size={20} />}
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
                disabled={submitting || !name}
              >
                {submitting ? "Enregistrement..." : "Ajouter"}
              </button>
            </>
          }
        >
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
                setStructureType(e.target.value as StructureType)
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
        </Modal>
      )}
    </PageLayout>
  );
};

export default BeneficiariesPage;
