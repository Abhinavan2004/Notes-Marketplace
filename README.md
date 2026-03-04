## Notes Marketplace

Production-oriented MERN app for uploading, selling, purchasing, and securely downloading student notes.

### Local development

- **1) Configure environment**
  - Copy `server/.env.example` to `server/.env` and fill values.
  - Copy `client/.env.example` to `client/.env` and set `VITE_API_BASE_URL`.

- **2) Install dependencies**

```bash
npm install
npm install --prefix server
npm install --prefix client
```

- **3) Run**

```bash
npm run dev
```

### Production build

```bash
npm run build
```

# Notes-Marketplace