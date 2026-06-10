import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "🔧",
      title: "Reconditionnement solidaire",
      desc: "Chaque appareil passe par diagnostic, réparation et contrôle qualité.",
    },
    {
      icon: "🤝",
      title: "Redistribution équitable",
      desc: "Familles, écoles, associations — l'accès au numérique pour tous.",
    },
    {
      icon: "🌱",
      title: "Impact environnemental",
      desc: "Chaque appareil reconditionné c'est ~150 kg de CO₂ économisés.",
    },
  ];

  const stats = [
    { num: "1 280", label: "Appareils collectés" },
    { num: "850+", label: "Redistribués" },
    { num: "60+", label: "Bénévoles" },
  ];

  return (
    <div className="login-page">
      {/* LEFT PART */}
      <div className="login-page__left">
        <div>
          {/* Brand */}
          <div className="login-page__brand">
            <div className="login-page__brand-icon">♻</div>
            <div>
              <div className="login-page__brand-name">Octet</div>
              <div className="login-page__brand-tagline">
                Ressourcerie Numérique
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="login-page__hero">
            <div className="login-page__hero-label">Mission solidaire</div>
            <h1 className="login-page__hero-title">
              Le numérique,
              <br />
              <em>circulaire</em>
              <br />
              et accessible à tous.
            </h1>
            <p className="login-page__hero-desc">
              Nous collectons, réparons et redistribuons du matériel
              informatique pour réduire la fracture numérique.
            </p>
          </div>

          {/* Features */}
          <div className="login-page__features">
            {features.map((feature) => (
              <div key={feature.title} className="login-page__feature">
                <div className="login-page__feature-icon">{feature.icon}</div>
                <div>
                  <div className="login-page__feature-title">
                    {feature.title}
                  </div>
                  <div className="login-page__feature-desc">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="login-page__stats">
          <div className="login-page__stats-row">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`login-page__stat${index < stats.length - 1 ? " login-page__stat--bordered" : ""}`}
              >
                <div className="login-page__stat-num">{stat.num}</div>
                <div className="login-page__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="login-page__footer-text">
            © 2026 Octet · Ressourcerie Numérique Solidaire
          </div>
        </div>
      </div>

      {/* RIGHT PART */}
      <div className="login-page__right">
        <div className="login-page__form-wrapper">
          <h2 className="login-page__title">Connexion</h2>
          <p className="login-page__subtitle">
            Accès réservé aux membres de l'équipe
          </p>

          {/* Error message */}
          {error && <div className="login-page__error">⚠️ {error}</div>}

          <form className="login-page__form" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="login-page__field">
              <label htmlFor="email" className="login-page__label">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                className="login-page__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@octet.fr"
                autoComplete="email"
                required
              />
            </div>

            {/* Password field */}
            <div className="login-page__field">
              <label htmlFor="password" className="login-page__label">
                Mot de passe
              </label>
              <div className="login-page__password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="login-page__input login-page__input--password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-page__toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="login-page__submit"
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter →"}
            </button>
          </form>
        </div>

        {/* Security note */}
        <div className="login-page__security">🔒 Chiffrement Argon2 + JWT</div>
      </div>
    </div>
  );
};

export default LoginPage;
