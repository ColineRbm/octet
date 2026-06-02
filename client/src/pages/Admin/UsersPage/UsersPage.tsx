import { Info, Lock, Mail, Plus, UserCheck } from "lucide-react";
import { useState } from "react";
import PageLayout from "../../../components/layout/PageLayout/PageLayout";
import { EmptyState, LoadingState, Modal } from "../../../components/ui";
import { useUsers } from "../../../hooks";
import { createUser, updateUserStatus } from "../../../services/api";
import type { User } from "../../../types";
import "./UsersPage.css";

const UsersPage = () => {
  const { users, loading, refetch } = useUsers();
  const [showModal, setShowModal] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = !user.is_active;
    const action = newStatus ? "activer" : "désactiver";
    if (
      !confirm(
        `Voulez-vous ${action} le compte de ${user.firstname} ${user.lastname} ?`,
      )
    )
      return;
    try {
      await updateUserStatus(user.id, newStatus);
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!firstname || !lastname || !email || !password) return;
    setSubmitting(true);
    try {
      await createUser({ firstname, lastname, email, password });
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
      <PageLayout title="Bénévoles" subtitle="Gestion de l'équipe">
        <LoadingState />
      </PageLayout>
    );
  }

  const activeCount = users.filter((u) => u.is_active).length;

  return (
    <PageLayout
      title="Bénévoles"
      subtitle={`${activeCount} actif${activeCount > 1 ? "s" : ""} sur ${users.length}`}
      actions={
        <button
          type="button"
          className="topbar__btn topbar__btn--primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={15} /> Ajouter un bénévole
        </button>
      }
    >
      <div className="users">
        {users.length === 0 ? (
          <EmptyState
            icon={<UserCheck size={36} />}
            message="Aucun bénévole pour l'instant"
          />
        ) : (
          <div className="users__grid">
            {users.map((user) => {
              const initials =
                `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
              const isActive = Boolean(user.is_active);
              return (
                <div
                  key={user.id}
                  className={`users__card${!isActive ? " users__card--inactive" : ""}`}
                >
                  <div className="users__card-top">
                    <div
                      className={`users__avatar${!isActive ? " users__avatar--inactive" : ""}`}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="users__name">
                        {user.firstname} {user.lastname}
                      </div>
                      <span
                        className={`users__status-badge users__status-badge--${isActive ? "active" : "inactive"}`}
                      >
                        <span className="users__status-dot" />
                        {isActive ? "Actif" : "Désactivé"}
                      </span>
                    </div>
                  </div>
                  <hr className="users__divider" />
                  <div className="users__info">
                    <div className="users__info-row">
                      <Mail size={12} /> {user.email}
                    </div>
                  </div>
                  <hr className="users__divider" />
                  <div className="users__footer">
                    <span className="users__footer-date">
                      Depuis le{" "}
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </span>
                    <button
                      type="button"
                      className={`users__toggle-btn users__toggle-btn--${isActive ? "deactivate" : "activate"}`}
                      onClick={() => handleToggleStatus(user)}
                    >
                      {isActive ? "Désactiver" : "Activer"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title="Ajouter un bénévole"
          icon={<UserCheck size={20} />}
          onClose={handleClose}
          footer={
            <>
              <div className="users__modal-security">
                <Lock size={12} /> Argon2 + JWT
              </div>
              <div className="users__modal-actions">
                <button
                  type="button"
                  className="users__modal-cancel"
                  onClick={handleClose}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="users__modal-submit"
                  onClick={handleSubmit}
                  disabled={
                    submitting || !firstname || !lastname || !email || !password
                  }
                >
                  <UserCheck size={15} />
                  {submitting ? "Création..." : "Créer le compte"}
                </button>
              </div>
            </>
          }
        >
          <div className="users__modal-row">
            <div className="users__modal-field">
              <label
                htmlFor="user-firstname"
                className="users__modal-label users__modal-label--required"
              >
                Prénom
              </label>
              <input
                id="user-firstname"
                className="users__modal-input"
                type="text"
                placeholder="ex. Marie"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="users__modal-field">
              <label
                htmlFor="user-lastname"
                className="users__modal-label users__modal-label--required"
              >
                Nom
              </label>
              <input
                id="user-lastname"
                className="users__modal-input"
                type="text"
                placeholder="ex. Lambert"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          <div className="users__modal-field">
            <label
              htmlFor="user-email"
              className="users__modal-label users__modal-label--required"
            >
              Adresse email
            </label>
            <input
              id="user-email"
              className="users__modal-input"
              type="email"
              placeholder="marie.lambert@octet.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="users__modal-field">
            <label
              htmlFor="user-password"
              className="users__modal-label users__modal-label--required"
            >
              Mot de passe temporaire
            </label>
            <input
              id="user-password"
              className="users__modal-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="users__modal-notice">
            <Info size={15} className="users__modal-notice-icon" />
            <span>
              Le rôle <strong>bénévole</strong> est attribué automatiquement. Le
              mot de passe sera hashé avec Argon2 avant stockage.
            </span>
          </div>
        </Modal>
      )}
    </PageLayout>
  );
};

export default UsersPage;
