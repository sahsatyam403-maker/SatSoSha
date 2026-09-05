<<<<<<< HEAD
# Petition to Restore Ethernet at GGSIPU EDC Hostels

A full-stack **MERN** platform (MongoDB + Express + React + Node) that collects student
digital signatures for the petition to bring back wired Ethernet in the GGSIPU East Delhi
Campus hostels.

## Features

- Mobile-friendly petition page with the required header, name / enrollment / room fields
- HTML5 canvas digital signature pad (works with mouse, finger, and stylus), with
  **Undo** and **Clear Signature** buttons
- Signatures stored as base64 PNG images in MongoDB
- "Thank you for supporting the cause!" success screen after submission
- A student's enrollment/roll number can sign **only once** (duplicate rejected)
- Hidden **admin panel** at `/#/admin`, protected by a username + password login:
  - View every applicant with the actual drawn signature
  - **Export CSV** (UTF-8, Excel ready) for the university administration
  - **Print Petition** — formatted, printable list of all signatures

## What you need (Prerequisites)

1. **Node.js 18 or newer** — download from https://nodejs.org (LTS recommended)
2. **MongoDB** — pick one option:

   **Option A — Local MongoDB (recommended):**
   Install MongoDB Community Server from https://www.mongodb.com/try/download/community
   (or run `winget install --id MongoDB.Server --exact --accept-package-agreements --accept-source-agreements`).
   It runs automatically as a Windows service on `mongodb://127.0.0.1:27017`.

   **Option B — Free MongoDB Atlas (cloud):**
   Create a free M0 cluster at https://www.mongodb.com/atlas, click "Connect" and copy the
   connection string, then put it in the `.env` file (see step 2 below).

## Setup — exact commands (Windows PowerShell)

Open PowerShell in the project folder and run:

```powershell
# 1. Install all Node dependencies (server + React app)
npm install

# 2. (Optional) Create the config file and set your own admin credentials
Copy-Item .env.example .env
#    Then edit .env in a text editor and change ADMIN_USERNAME / ADMIN_PASSWORD
#    to whatever you want. Defaults are:
#      ADMIN_USERNAME=somarshi
#      ADMIN_PASSWORD=Satyam1234

# 3. Launch in development mode (auto-reload on code changes)
npm run dev
```

- The React app runs at **http://localhost:5173**
- The API server runs at **http://localhost:4000** (Vite proxies `/api` automatically)

## Production mode (single port, ready to deploy)

```powershell
npm run build
npm start
```

Now the whole platform (React + API + CSV export) is served from **http://localhost:4000**.
This is the mode to use while collecting signatures.

## Using the platform

| Action                          | How                                                                     |
| ------------------------------- | ----------------------------------------------------------------------- |
| Sign the petition               | Open http://localhost:4000 (or :5173 in dev) on any phone/laptop        |
| View all applicants             | Add `/#/admin` to the URL → sign in with the admin username & password  |
| Export CSV                      | Admin panel: **Load applicants** → **Export CSV**                       |
| Print the petition              | Admin panel: **Load applicants** → **Print Petition**                   |
| Stop the server                 | Press `Ctrl+C` in the PowerShell window                                 |

> Default admin credentials: username `somarshi` / password `Satyam1234`.

### Letting hostel students sign from their phones

The server listens on all network interfaces, so phones on the **same Wi-Fi network**
can sign directly:

```powershell
ipconfig
```

Find the `IPv4 Address` of your active connection (e.g. `192.168.1.105`), then share
**`http://192.168.1.105:4000`** with your classmates. If Windows shows a firewall pop-up,
click **Allow** so the phones can reach the laptop.

## Configuration (`.env`)

| Variable         | Default                                        | Purpose                                      |
| ---------------- | ---------------------------------------------- | -------------------------------------------- |
| `PORT`           | `4000`                                         | API/UI port                                  |
| `MONGODB_URI`    | `mongodb://127.0.0.1:27017/ethernet_petition`  | Your database connection string (Atlas OK)   |
| `ADMIN_USERNAME` | `somarshi`                                     | Admin panel username                         |
| `ADMIN_PASSWORD` | `Satyam1234`                                   | Admin panel password                         |

> Security note: change `ADMIN_USERNAME`/`ADMIN_PASSWORD` in your `.env` before sharing the
> admin link. After signing in, the panel works via a session token issued to your browser.

## Project structure

```
├── index.html            # Vite entry point
├── package.json          # Dependencies and run scripts
├── vite.config.js        # React build + dev proxy
├── server/               # Express + Mongoose backend
│   ├── index.js          # Server entry point
│   ├── db.js             # MongoDB connection
│   ├── models/Signature.js
│   └── routes/
│       ├── signatures.js # Public: submit signature, signature count
│       └── admin.js      # Protected: list entries, export CSV
└── src/                  # React frontend
    ├── main.jsx
    ├── App.jsx
    ├── api.js
    └── components/
        ├── PetitionForm.jsx
        ├── SignatureCanvas.jsx   # Canvas signature pad (base64 PNG)
        ├── Success.jsx           # "Thank you for supporting the cause!"
        └── Admin.jsx             # View / CSV export / print
```

## API endpoints

| Method | Endpoint                  | Auth             | Body                                          |
| ------ | ------------------------- | ---------------- | --------------------------------------------- |
| GET    | `/api/count`              | –                | –                                             |
| POST   | `/api/signatures`         | –                | `{ fullName, enrollmentNumber, roomNumber, signatureData }` |
| POST   | `/api/admin/login`        | –                | `{ username, password }` → returns a session token |
| GET    | `/api/admin/signatures`   | session token*   | –                                             |
| GET    | `/api/admin/export.csv`   | session token*   | – (downloads the CSV)                         |

\* Send the session token returned by `POST /api/admin/login` in the `x-admin-token` header.
=======
# SatSoSha
>>>>>>> a5098f4e60ed6b2ab3840cfe20cd095c611cb677
