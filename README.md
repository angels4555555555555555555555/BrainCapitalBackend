# Brain Capital backend

Express API for customer authentication, profiles, password changes, and admin user management.

## Local setup

1. Copy `.env.example` to `.env` and provide MongoDB, JWT, and encryption values.
2. `PASSWORD_ENCRYPTION_KEY` must be exactly 64 hexadecimal characters. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
3. Cloudinary variables are required only for profile-picture uploads.
4. Install and start:

```bash
npm install
npm run dev
```

The API is served at `http://localhost:5000/api`. `GET /api/testing` is the health/smoke endpoint.

## Seed the administrator

The seed is idempotent: it creates the administrator when missing and updates its password when it already exists. Provide the password only at execution time:

```powershell
$env:ADMIN_SEED_PASSWORD="your-password"
npm run seed:admin
Remove-Item Env:ADMIN_SEED_PASSWORD
```

The default seed email is `admin@braincapitalasset.com`; override it with `ADMIN_SEED_EMAIL` when needed.

For production, set `NODE_ENV=production`, a strong `JWT_SECRET`, the production MongoDB values, Cloudinary credentials, and any additional comma-separated frontend origins in `CORS_ORIGINS`.
