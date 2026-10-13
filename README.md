# Smart Rental Property & Tenant Management SaaS

A complete, production-ready multi-tenant SaaS application built with **Node.js, Express, MongoDB/Mongoose, React 19, Vite, Tailwind CSS, Redux Toolkit, and Recharts**.

---

## 🌟 Key Features

### 🏢 Multi-Tenant SaaS Architecture
- **Data Isolation**: Every business record is automatically scoped by `tenantId` (Landlord SaaS account ID).
- **Role-Based Access Control (RBAC)**: Supports **Super Admin**, **Landlord**, and **Tenant** roles.
- **Secure Authentication**: JWT Access Tokens, HTTP-only Refresh Tokens, bcrypt password hashing, and protected routes.

### 🏠 Property & Unit Management
- Full CRUD for properties (apartment complexes, commercial plazas, single-family homes).
- Unit cataloging with status tracking (**VACANT**, **OCCUPIED**, **MAINTENANCE**), floor levels, rent rates, and deposit amounts.

### 👥 Tenant & Lease Management
- Digital tenant profiles linked to user accounts.
- Automated lease agreements with start/end dates, monthly rates, and unit auto-occupancy sync.

### 💳 Payments & Automated Rent Generation
- Rent payment history with status tracking (**PAID**, **PENDING**, **OVERDUE**).
- **1-Click Bulk Monthly Rent Generation** for all active lease contracts.
- Printable/viewable **Official Payment Receipts**.

### 🛠️ Maintenance Ticket System
- Tenant portal for submitting maintenance requests with priority levels (**LOW**, **MEDIUM**, **HIGH**).
- Real-time status updates (**OPEN**, **IN_PROGRESS**, **RESOLVED**, **CLOSED**).

### 📁 Cloud Document Vault
- Cloudinary file upload integration with automatic local filesystem fallback.
- Support for lease agreements, tenant government IDs, property rules, and receipts.

### 📊 Dashboard & Analytics
- **Landlord Dashboard**: Interactive Recharts visualizations including 6-Month Revenue Trends, Unit Occupancy Breakdown (Donut Chart), and Ticket Priority Distribution.
- **Tenant Dashboard**: Overview of unit details, upcoming rent payments, and open repair tickets.
- **Reports Engine**: Financial revenue summaries, occupancy audit reports, and maintenance analytics.

---

## 🚀 Quick Start Guide (Run Locally Immediately)

### 1. Installation
Run the following command from the root directory to install dependencies for both `backend` and `frontend`:

```bash
npm run install:all
```

Or install individually:
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Environment Setup
The backend `.env` file comes pre-configured for local execution:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart_rental_saas
JWT_ACCESS_SECRET=smart_rental_access_secret_key_2026_super_secure
JWT_REFRESH_SECRET=smart_rental_refresh_secret_key_2026_super_secure
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

*(Note: Cloudinary and SMTP settings are optional; local storage and console logger fallbacks kick in automatically if credentials are omitted.)*

### 3. Seed Demo Data
Populate realistic demo data (Landlords, Tenants, Properties, Units, Leases, Payments, Tickets, Documents):

```bash
npm run seed
```

#### Demo Logins Created by Seed:
- **Landlord Account**: `landlord@example.com` / `Password123!`
- **Tenant Account**: `tenant@example.com` / `Password123!`
- **Super Admin Account**: `admin@smartrental.com` / `Password123!`

*(Tip: The login page features 1-Click Demo Buttons to fill credentials instantly!)*

### 4. Run Application
To start both Backend REST API (Port 5000) and Frontend Vite Dev Server (Port 5173):

```bash
npm run dev
```

Open your browser at: `http://localhost:5173`

---

## 🏗️ Project Architecture

```
Smart Rental Property & Tenant Management SaaS/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Cloudinary, Mailer, Logger (Winston)
│   │   ├── constants/       # Roles, Statuses, Enums
│   │   ├── controllers/     # Express route handlers
│   │   ├── jobs/            # Daily Cron Jobs (Lease Expiration & Overdue Reminders)
│   │   ├── middleware/      # Auth JWT, RBAC, Multi-tenancy Scoper, File Upload, Errors
│   │   ├── models/          # Mongoose Schemas (User, Property, Unit, Lease, Payment, Ticket, Document)
│   │   ├── repositories/    # Database query layer (Mongoose queries)
│   │   ├── routes/          # API Route declarations
│   │   ├── services/        # Core Business Logic & Multi-tenant Scoping
│   │   ├── utils/           # ApiResponse, ApiError, JWT helpers
│   │   ├── validators/      # Express-validator schemas
│   │   ├── app.js           # Express app setup & security middleware
│   │   ├── server.js        # HTTP server entrypoint
│   │   └── seed.js          # Demo dataset seeder
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance with auto-refresh token interceptor
│   │   ├── components/      # Common UI components (Navbar, Sidebar, StatCard, StatusBadge, Modal)
│   │   ├── hooks/           # useDarkMode custom hook
│   │   ├── layouts/         # MainLayout and AuthLayout
│   │   ├── pages/           # Landlord, Tenant, and Public pages
│   │   ├── routes/          # AppRoutes definition with RBAC guards
│   │   ├── store/           # Redux Toolkit store & feature slices
│   │   ├── utils/           # Formatters (currency, dates, roles)
│   │   ├── App.jsx          # Root component
│   │   ├── main.jsx         # React entrypoint
│   │   └── index.css        # Tailwind CSS & Glassmorphism styles
```

---

## 📡 API Endpoint Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new landlord/tenant | Public |
| `POST` | `/api/v1/auth/login` | Sign in & receive JWT | Public |
| `POST` | `/api/v1/auth/refresh-token` | Refresh Access Token | Public / Cookie |
| `GET` | `/api/v1/dashboard/stats` | Retrieve role-specific metrics & charts | Authenticated |
| `GET` / `POST` | `/api/v1/properties` | List & Create Properties | Landlord / Super Admin |
| `GET` / `POST` | `/api/v1/units` | List & Create Units | Landlord / Super Admin |
| `GET` / `POST` | `/api/v1/tenants` | List & Create Tenant Profiles | Landlord / Super Admin |
| `GET` / `POST` | `/api/v1/leases` | List & Create Lease Contracts | Landlord / Super Admin |
| `GET` / `POST` | `/api/v1/payments` | List & Record Payments | Authenticated |
| `POST` | `/api/v1/payments/generate-monthly-rent` | Auto-generate monthly rent invoices | Landlord |
| `GET` | `/api/v1/payments/:id/receipt` | View formatted payment receipt | Authenticated |
| `GET` / `POST` | `/api/v1/maintenance` | List & Report Maintenance Tickets | Authenticated |
| `GET` / `POST` | `/api/v1/documents` | List & Upload Files to Vault | Authenticated |
| `GET` | `/api/v1/reports/financial` | Financial revenue report | Landlord |

---

## 🚢 Deployment Guide

### Deploying Backend to Render
1. Create a new Web Service on [Render](https://render.com).
2. Connect your Git repository and set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `node src/server.js`
5. Add Environment Variables (`MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`).

### Deploying Frontend to Vercel
1. Create a new project on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Rewrite Rule in `vercel.json` if proxying API requests to Render backend.

---

## 📜 License
This software is built for high-performance SaaS property management.
