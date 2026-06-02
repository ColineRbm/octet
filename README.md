# Octet — Ressourcerie Numérique

Application de gestion d'une ressourcerie spécialisée en matériel informatique. Elle permet de collecter, reconditionner et redistribuer des appareils informatiques à des bénéficiaires.

## Fonctionnalités

**Profil Admin**
- Tableau de bord avec statistiques (appareils, attributions, bénévoles)
- Gestion du parc d'appareils (ajout, suivi, suppression)
- Gestion des bénéficiaires (familles, écoles, associations)
- Gestion des bénévoles (création, activation/désactivation)
- Historique des attributions (dons et cessions solidaires)

**Profil Bénévole**
- File de travail : diagnostic, réparation, contrôle qualité N2
- Historique des appareils traités
- Statistiques personnelles et impact CO₂

## Stack technique

| Côté client | Côté serveur | Base de données |
|-------------|--------------|-----------------|
| React + TypeScript | Node.js + Express + TypeScript | MySQL + Prisma |
| Vite + Biome | JWT + Argon2 | MongoDB (logs) |
| Lucide React | CORS | |

## Installation

### Prérequis
- Node.js 18+
- MySQL

### 1. Cloner le projet
```bash
git clone https://github.com/ColineRbm/octet.git
cd octet
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier le fichier `.env.sample` dans `server/` et renseigner les valeurs :

```bash
cp server/.env.sample server/.env
```

```env
APP_PORT=3310
DB_HOST=localhost
DB_PORT=3306
DB_USER=votre_user
DB_PASSWORD=votre_password
DB_NAME=recyclerie
JWT_SECRET=votre_secret_genere
CLIENT_URL=http://localhost:5173
```

### 4. Créer la base de données
```bash
npm run db:migrate
```

### 5. Lancer le projet
```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173`

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@octet.fr | Admin1234! |
| Bénévole | marie.lambert@octet.fr | Admin1234! |

## Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre client et serveur |
| `npm run db:migrate` | Recrée la base de données depuis le schema |
| `npm run check` | Vérifie le code (Biome + TypeScript) |

## Sécurité

- Authentification JWT avec expiration 24h
- Mots de passe hashés avec Argon2
- Validation des entrées sur toutes les routes POST/PUT
- Protection des routes par rôle (admin / bénévole)
- `password_hash` jamais exposé dans les réponses API

## Architecture

```
octet/
├── client/                 # React + TypeScript
│   └── src/
│       ├── components/     # Composants réutilisables (ui/, layout/)
│       ├── constants/      # Données statiques (STATUS_CONFIG...)
│       ├── contexts/       # AuthContext
│       ├── hooks/          # Hooks custom (useDevices, useUsers...)
│       ├── pages/          # Pages par profil (Admin/, Benevole/)
│       ├── services/       # Appels API (api.ts)
│       └── types/          # Interfaces TypeScript centralisées
│
└── server/                 # Node.js + Express + TypeScript
    ├── database/           # Schema SQL + client MySQL
    └── src/
        ├── middlewares/    # Auth (JWT) + Validation
        ├── modules/        # Par entité : actions + repository
        └── router.ts       # Routes API
```