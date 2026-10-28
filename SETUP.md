# Setup (Windows / PowerShell)

## 1. Prerequisites

- Node.js 20 or newer
- PostgreSQL 15 or newer (local installation or a hosted PostgreSQL instance)
- Optional: Gemini API key from Google AI Studio

## 2. Install dependencies

Open PowerShell in the extracted project folder:

```powershell
npm install
```

## 3. Create a separate database

Open pgAdmin's Query Tool or `psql` and run:

```sql
CREATE DATABASE ai_workforce_db;
```

Do not point this app at Chintu's `chintu_db`.

## 4. Configure `.env`

```powershell
Copy-Item .env.example .env
notepad .env
```

Update these fields:

```dotenv
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/ai_workforce_db
ADMIN_NAME=Business Owner
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=replace-with-a-unique-password-of-at-least-12-characters
BUSINESS_NAME=Your Business
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.8-flash
```

If your PostgreSQL password contains URL-reserved characters, URL-encode them. Keep `.env` private and never commit it.

## 5. Create schema and demo data

```powershell
npm run setup
```

This runs the SQL migration and creates the initial administrator plus sample lead records. The seed script refuses the unchanged placeholder password.

## 6. Start and sign in

```powershell
npm start
```

Browse to `http://localhost:4173`. Sign in using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

## 7. Run tests

In a separate terminal:

```powershell
npm test
```

With the app running and PostgreSQL configured, run a basic authenticated API smoke test:

```powershell
$env:ADMIN_EMAIL = "you@example.com"
$env:ADMIN_PASSWORD = "your configured password"
npm run smoke
```

## Quick troubleshooting

- **`DATABASE_URL is missing`:** copy `.env.example` to `.env` and edit it.
- **Connection refused:** ensure PostgreSQL is running, the database exists, and the URL/port/user/password are correct.
- **Role does not exist:** use a real PostgreSQL role for `DATABASE_URL`; this app does not assume a role named `postgres` exists.
- **Gemini falls back to rules:** check `GEMINI_API_KEY`, model access, and network connectivity. The workflow still runs with the fallback scorer.
- **Production deployment:** use HTTPS, set `NODE_ENV=production`, and provision secrets securely. The session cookie is marked `Secure` in production.
