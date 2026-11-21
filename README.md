# DevVault - Full-Stack Digital Downloads Store (React + Vite + Render Ready)

A modern, production-grade e-commerce application designed specifically for selling **digital downloads** (software boilerplates, Figma UI systems, e-books, and developer templates).

Built with **React + Vite**, **Tailwind CSS**, **Node.js/Express**, and **Stripe**, pre-configured for seamless 1-click deployment on **Render**.

---

## ✨ Features Included

- 🛒 **Full Digital Storefront & Catalog**:
  - Live instant search across titles, summaries, and tech stacks.
  - Category filters (*Software & Boilerplates*, *UI & Design Kits*, *E-Books & Guides*, *Templates & Tools*).
  - Price range slider and sorting (*Featured*, *Price Low/High*, *Highest Rated*, *Newest*).
- ⚡ **Digital Asset Delivery & Licensing**:
  - Instant digital download tokens generated upon completed checkout.
  - Automated software license key generation (e.g. `SBPRO-89F2-47A1-BC99-2026`) with 1-click clipboard copy.
  - Customer **Digital Download Vault** to re-download purchased files anytime.
- 💳 **Stripe Checkout & Fast Simulator Mode**:
  - **Live/Test Stripe Mode**: Real Stripe Checkout Session creation and webhook verification.
  - **Instant Simulator Mode**: Works immediately out-of-the-box with zero Stripe API keys required for development and testing.
  - Promo code discounts (e.g., `WELCOME20` for 20% off, `SAVE10` for 10% off).
- 🛡️ **Customer Authentication & Orders**:
  - JWT-based authentication with bcrypt password hashing.
  - Customer account view showing order history and file downloads.
  - Verified buyer badge on customer reviews.
- ⭐️ **Product Reviews & Ratings**:
  - 5-star customer review system with average rating calculations.
  - Authenticated customers can submit ratings and written feedback.
- 🔒 **Store Administrator Dashboard**:
  - Real-time KPI metrics: Total Revenue ($), Total Orders, Active Products, Registered Customers.
  - Complete product CRUD (Add new digital assets, set price, upload format details, delete).
  - Centralized customer orders table with order status and items breakdown.
- ☁️ **Render Cloud Deployment**:
  - Includes `render.yaml` for 1-click automated Render Blueprint deployment.
  - Express serves the production-built Vite static frontend on a single port within Render's free tier.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
In the root directory or inside `client` and `server`:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables
Copy `.env.example` in the root:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `JWT_SECRET` | Secret key used for signing JWT auth tokens | Any string |
| `STRIPE_SECRET_KEY` | *(Optional)* Stripe secret key (starts with `sk_test_...`) | Empty (uses simulator mode) |
| `STRIPE_PUBLISHABLE_KEY` | *(Optional)* Stripe publishable key | Empty |
| `CLIENT_URL` | Frontend origin for Stripe redirects | `http://localhost:5173` |

### 3. Run the Development Servers
In two separate terminals:

**Terminal 1 (Backend API):**
```bash
cd server
node src/index.js
```
Runs at: `http://localhost:5000`

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
Runs at: `http://localhost:5173` (Vite proxies all `/api` calls directly to `http://localhost:5000`).

---

## 🔑 Pre-Seeded Demo Accounts (Click to Autofill)

On the **Sign In** page, quick-fill buttons are provided for instant testing:

| Role | Email | Password | What's Included |
| :--- | :--- | :--- | :--- |
| **Customer** | `alex@example.com` | `customer123` | Pre-purchased assets in download library, verified buyer status |
| **Admin** | `admin@store.com` | `admin123` | Full access to `/admin` dashboard, product CRUD & all orders |

---

## ☁️ How to Deploy to Render

### Method 1: Render Blueprint (Recommended - 1-Click)
1. Push this repository to **GitHub** or **GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** and select **Blueprint**.
4. Connect your repository.
5. Render reads `render.yaml` and sets up the Web Service with the correct build and start commands automatically.
6. Click **Apply**. Render will build the Vite app and launch the unified server!

---

### Method 2: Manual Web Service Setup on Render
1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your Git repository.
3. Configure the following settings:
   - **Name**: `devvault-store`
   - **Environment**: `Node`
   - **Region**: Any (e.g., Oregon, Frankfurt)
   - **Branch**: `main`
   - **Build Command**:
     ```bash
     npm --prefix client install && npm --prefix client run build && npm --prefix server install
     ```
   - **Start Command**:
     ```bash
     node server/src/index.js
     ```
   - **Plan**: `Free`
4. Add Environment Variables under the **Environment** tab:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(Generate a secure random string)*
   - `STRIPE_SECRET_KEY`: *(Optional - your Stripe secret key)*
   - `STRIPE_PUBLISHABLE_KEY`: *(Optional - your Stripe publishable key)*
5. Click **Deploy Web Service**.

Your online digital store will be live at `https://<your-service-name>.onrender.com`!

---

## 📁 Project Architecture

```
digital-store/
├── render.yaml               # Infrastructure-as-code for Render Blueprint
├── package.json              # Root build & start scripts
├── .env.example              # Environment variables template
├── server/
│   ├── package.json
│   └── src/
│       ├── index.js          # Express app, static serving for Render, health check
│       ├── middleware/       # Auth guards & admin permission checks
│       ├── routes/           # Auth, products, orders, reviews, checkout, admin
│       ├── data/             # Persistent JSON data store & pre-seeded products
│       └── storage/          # Secure download handler
└── client/
    ├── package.json
    ├── vite.config.js        # Vite config with /api proxy
    ├── tailwind.config.js
    └── src/
        ├── context/          # AuthContext & CartContext (cart persistence)
        ├── services/api.js   # API client for backend
        ├── components/       # Navbar, Footer, ProductCard, CartDrawer, Reviews
        └── pages/            # Home, Catalog, ProductDetail, Cart, Success, Account, Admin, Login
```

---

## 🏷️ Testing Discount Codes
During checkout, enter either of these codes:
- `WELCOME20` - **20% off** entire cart
- `SAVE10` - **10% off** entire cart
