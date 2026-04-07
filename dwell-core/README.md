# 🏢 Dwell Core — Smart Apartment Management System

> **Apartment Maintenance Management System for Efficient Community Living**

A full-stack web application built with **Node.js (Express)**, **MongoDB**, and **EJS** featuring role-based access control, real-time notifications, and a modern colorful dashboard UI.

---

## ✨ Features

### 👑 Admin
- Modern analytics dashboard with Chart.js graphs
- Manage residents (Add / View / Delete)
- Handle complaints (Update status, add notes)
- Generate and manage bills (Maintenance + Water + Power)
- View all payments and revenue tracking
- Post notices to all residents
- Monthly revenue bar chart + complaint/bill doughnut charts

### 🏠 Resident
- Personal dashboard with flat details
- Raise & track complaints with priority levels
- View and pay bills (card UI with breakdown)
- Payment history with transaction IDs
- Browse notice board
- Profile management + password change
- Real-time notifications for complaints, bills, payments

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Templating | EJS |
| Auth | bcryptjs + express-session + connect-mongo |
| Uploads | multer |
| UI | Custom CSS + Bootstrap icons + Chart.js |
| Flash | connect-flash |
| Forms | method-override (PUT/DELETE) |

---

## 📁 Project Structure

```
dwell-core/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Login / Register / Logout
│   ├── dashboardController.js # Admin + Resident dashboards
│   ├── residentController.js  # Resident CRUD (admin)
│   ├── complaintController.js # Complaint management
│   ├── billController.js      # Bills + Payments
│   ├── noticeController.js    # Notice board
│   └── userController.js      # Profile + Notifications
├── middleware/
│   └── auth.js                # isAuthenticated, isAdmin, setLocals
├── models/
│   ├── User.js                # User schema (admin + resident)
│   ├── Complaint.js           # Complaint schema
│   ├── Bill.js                # Bill schema (auto-calc total)
│   ├── Payment.js             # Payment records
│   ├── Notice.js              # Notice board
│   └── Notification.js        # In-app notifications
├── routes/
│   ├── auth.js                # /auth/*
│   ├── dashboard.js           # /dashboard
│   ├── admin.js               # /admin/*
│   └── user.js                # /complaints, /bills, etc.
├── views/
│   ├── partials/
│   │   ├── header.ejs         # Sidebar + topnav
│   │   └── footer.ejs         # Scripts
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── residents.ejs
│   │   ├── addResident.ejs
│   │   ├── residentDetail.ejs
│   │   ├── complaints.ejs
│   │   ├── bills.ejs
│   │   ├── addBill.ejs
│   │   ├── payments.ejs
│   │   ├── notices.ejs
│   │   └── addNotice.ejs
│   ├── resident/
│   │   ├── dashboard.ejs
│   │   ├── complaints.ejs
│   │   ├── addComplaint.ejs
│   │   ├── bills.ejs
│   │   └── payments.ejs
│   ├── notices.ejs
│   ├── profile.ejs
│   └── notifications.ejs
├── public/
│   └── css/
│       └── style.css
├── uploads/                   # multer uploads
├── seed.js                    # Demo data seeder
├── server.js                  # App entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/dwell-core.git
cd dwell-core
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/dwellcore?retryWrites=true&w=majority
SESSION_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

### 4. Set Up MongoDB Atlas
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user with read/write access
4. Whitelist your IP (or `0.0.0.0/0` for development)
5. Copy the connection string and paste it in `.env`

### 5. Seed Demo Data (Optional)
```bash
node seed.js
```

This creates:
- 1 Admin account
- 6 Resident accounts  
- Sample complaints, bills, notices, and notifications

### 6. Start the Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Visit: **http://localhost:3000**

---

## 🔐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@dwellcore.com | admin123 |
| 🏠 Resident | resident@dwellcore.com | resident123 |
| 🏠 Resident | arjun@dwellcore.com | resident123 |

---

## 📊 API Routes Overview

### Auth Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/auth/login` | Login page |
| POST | `/auth/login` | Process login |
| GET | `/auth/register` | Register page |
| POST | `/auth/register` | Process registration |
| GET | `/auth/logout` | Logout |

### Dashboard
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard` | Admin or Resident dashboard |

### Admin Routes (`/admin/*`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/admin/residents` | All residents |
| GET/POST | `/admin/residents/add` | Add resident |
| DELETE | `/admin/residents/:id` | Delete resident |
| GET | `/admin/complaints` | All complaints |
| PUT | `/admin/complaints/:id` | Update status |
| DELETE | `/admin/complaints/:id` | Delete complaint |
| GET | `/admin/bills` | All bills |
| GET/POST | `/admin/bills/add` | Generate bill |
| DELETE | `/admin/bills/:id` | Delete bill |
| GET | `/admin/payments` | All payments |
| GET | `/admin/notices` | All notices |
| GET/POST | `/admin/notices/add` | Post notice |
| DELETE | `/admin/notices/:id` | Delete notice |

### Resident Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/complaints/new` | Raise complaint |
| GET | `/complaints` | My complaints |
| GET | `/bills` | My bills |
| POST | `/bills/:id/pay` | Pay a bill |
| GET | `/payments` | Payment history |
| GET | `/notices` | Notice board |
| GET/POST | `/profile` | View/update profile |
| POST | `/profile/password` | Change password |
| GET | `/notifications` | View notifications |
| POST | `/notifications/clear` | Clear all |

---

## 🎨 UI Highlights

- **Sidebar navigation** with role-aware menu items
- **Hero banners** with gradient backgrounds per page
- **Stat cards** with icons and live data
- **Chart.js** — Revenue bar chart, complaint doughnut, bill doughnut
- **Bill cards** with breakdown (Maintenance + Water + Power)
- **Notification badge** with unread count
- **Modal** for complaint status update (admin)
- **Responsive** — works on mobile and desktop
- **Flash alerts** with auto-dismiss

---

## 📤 GitHub Upload Steps

```bash
# Initialize git
git init
git add .
git commit -m "feat: initial Dwell Core project"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/dwell-core.git
git branch -M main
git push -u origin main
```

> ⚠️ Make sure `.env` is in `.gitignore` (it already is)

---

## 📦 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `SESSION_SECRET` | Secret key for sessions | `random_string_here` |
| `NODE_ENV` | Environment | `development` or `production` |

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- Session stored in MongoDB (expires in 24h)
- Route-level auth guards (`isAuthenticated`, `isAdmin`)
- Method override for secure DELETE/PUT from HTML forms
- Flash messages prevent sensitive error leakage
- `httpOnly` session cookies

---

## 📄 License

MIT License — Free to use for educational and commercial projects.

---

**Built with ❤️ for Dwell Core — Smart Apartment Management**
