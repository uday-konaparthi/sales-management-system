# 🛒 Sales Management System

A full-stack sales management web application built for a medium-scale shopping mall. Handles product inventory, real-time sales recording, barcode scanning, invoice generation, and dashboard analytics — all behind a secure JWT-based authentication system.

**Live Demo:** [sales-management-system-lac.vercel.app](https://sales-management-system-lac.vercel.app)

---

## ✨ Features

- 🔐 **Auth** — Register/Login with JWT (httpOnly cookies) + bcrypt password hashing, auto-login on revisit
- 📦 **Product Management** — Add, edit, delete products; track stock levels; low-stock alerts
- 🔍 **Barcode Scanning** — Scan product barcodes via webcam or image upload to auto-fill product info at checkout
- 🏷️ **Barcode Generation** — Generate and print barcodes for any product (bwip-js)
- 💰 **Sales Recording** — Record sales transactions with quantity, selling price, and automatic profit calculation
- 🧾 **Invoice Generation** — Print-ready invoices for every sale (react-to-print)
- 📊 **Dashboard Analytics** — View total revenue, profit, sales count, and inventory overview
- 🌙 **Dark/Light Mode** — Theme toggle across the entire app
- 🔒 **Protected Routes** — All pages gated behind authentication; unauthenticated users redirected to login

---

## 🛠️ Tech Stack

### Frontend
| Tech | Usage |
|------|-------|
| React 19 + Vite | UI framework & build tool |
| Redux Toolkit | Global state management |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Radix UI + shadcn/ui | Accessible UI components |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Webcam | Camera access for barcode scanning |
| bwip-js | Barcode rendering |
| @zxing/browser | Barcode decoding |
| react-to-print | Invoice printing |
| React Toastify | Notifications |

### Backend
| Tech | Usage |
|------|-------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| cookie-parser | httpOnly cookie handling |
| bwip-js | Server-side barcode generation |
| dotenv | Environment config |
| nodemon | Dev server |

---

## 📁 Project Structure

```
sales-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, logout, auto-login
│   │   ├── productController.js   # CRUD + search + low-stock + barcode lookup
│   │   └── salesController.js     # Record sales, fetch sales history
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── errorMiddleware.js     # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Sale.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── salesRoutes.js
│   │   └── barcodeRoutes.js
│   ├── utils/
│   │   └── barcodeGenerator.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── invoice/           # Invoice print component
        │   ├── ui/                # Reusable UI components (shadcn/ui)
        │   ├── prodsList.jsx
        │   └── prodEdit.jsx
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── ProductsPage.jsx
        │   └── SalesPage.jsx
        ├── utils/
        │   ├── barcode/           # Barcode scanner (webcam + file)
        │   ├── ProtectedRouting.jsx
        │   └── logoutFunc.jsx
        └── App.jsx
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + set cookie |
| GET | `/api/auth/me` | Auto-login from cookie |
| POST | `/api/auth/logout` | Clear cookie |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (owner scoped) |
| POST | `/api/products` | Add new product |
| PUT | `/api/products/:id` | Edit product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/search` | Search products by name |
| GET | `/api/products/low-stock` | Get low stock products |
| GET | `/api/products/barcode/:barcode` | Lookup product by barcode |

### Sales
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sales` | Record a sale |
| GET | `/api/sales` | Get sales history (filterable by date) |

### Barcode
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/barcode/generate` | Generate barcode image |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/uday-konaparthi/sales-management-system.git
cd sales-management-system
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
NODE_ENV=development
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` · Backend on `http://localhost:5000`

---

## 🚀 Deployment

- **Frontend** → [Vercel](https://vercel.com) (set `VITE_API_URL` env variable to your backend URL)
- **Backend** → [Render](https://render.com) / Railway (set all `.env` variables in the dashboard)

> ⚠️ Never commit your `.env` file. Always use environment variables provided by your hosting platform.

---

## 🔮 Roadmap

- [ ] Role-based access (Admin / Cashier / Manager)
- [ ] Multi-vendor / multi-shop support
- [ ] PDF invoice download
- [ ] Sales reports (weekly/monthly export)
- [ ] Cloud backup & data export
- [ ] Mobile-responsive checkout UI for tablet/POS use

---

## 👨‍💻 Author

**Uday Konaparthi**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/uday-konaparthi-4824a2329)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/uday-konaparthi)
[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=flat-square&logo=leetcode&logoColor=black)](https://leetcode.com/u/udaykonaparthi/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
