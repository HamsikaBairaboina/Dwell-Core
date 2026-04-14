# 🏢 Dwell Core – Apartment Management System

## 📌 Overview

**Dwell Core** is a full-stack apartment/community management system designed to simplify the management of residential societies. It provides role-based access for **admins** and **residents**, enabling efficient handling of complaints, notices, bills, payments, and notifications.

---

## 🚀 Features

### 👤 Authentication & Authorization

* User registration & login system
* Admin registration support
* Role-based access control (Admin / Resident)
* Secure authentication middleware

### 🏠 Resident Features

* View dashboard with key updates
* Raise and track complaints
* View notices and notifications
* Check bills and payment status
* Manage profile

### 🛠️ Admin Features

* Add/manage residents
* Create and manage notices
* Handle complaints
* Generate and manage bills
* Track payments
* View system dashboard

### 🔔 Notifications

* Real-time notification system for residents
* Updates on complaints, bills, and notices

---

## 🏗️ Project Structure

```
dwell-core/
│
├── config/               # Database configuration
├── controllers/          # Business logic controllers
├── middleware/           # Authentication middleware
├── models/               # Mongoose models (MongoDB)
├── routes/               # Application routes
├── views/                # EJS templates (Frontend)
│   ├── admin/
│   ├── resident/
│   ├── auth/
│   └── partials/
├── public/               # Static assets (CSS, JS, Images)
├── uploads/              # Uploaded files
├── server.js             # Entry point
├── seed.js               # Database seeding script
├── package.json          # Dependencies
└── .env.example          # Environment variables template
```

---

## ⚙️ Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** EJS (Embedded JavaScript Templates)
* **Database:** MongoDB with Mongoose
* **Authentication:** Session-based / Middleware
* **Styling:** CSS

---

## 🧑‍💻 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/HamsikaBairaboina/Dwell-Core.git
cd dwell-core
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file using `.env.example`:

```
PORT=3000
MONGO_URI= mongodb://localhost:27017/dwellcore
```

  
SESSION_SECRET= dwellcore_secret_key_2024

  

### 4️⃣ Seed the database (optional)

```bash
node seed.js
```

### 5️⃣ Run the application

```bash
npm start
```

App will run on:

```
http://localhost:3000
```

---

## 🔑 Default Roles

| Role     | Access                                    |
| -------- | ----------------------------------------- |
| Admin    | Full system control                       |
| Resident | Limited access (personal data & services) |

---

## 📡 API Routes Overview

### Auth Routes

* `/auth/login`
* `/auth/register`
* `/auth/register-admin`

### Admin Routes

* `/admin/dashboard`
* `/admin/residents`
* `/admin/complaints`
* `/admin/bills`
* `/admin/notices`

### Resident Routes

* `/resident/dashboard`
* `/resident/complaints`
* `/resident/bills`
* `/resident/payments`

---

## 📷 Views

* **Admin Panel**

  * Manage residents, complaints, bills, notices
* **Resident Panel**

  * Dashboard, complaints, payments, profile
* **Auth Pages**

  * Login, Register

---

## 🔐 Middleware

* `auth.js`

  * Protects routes
  * Ensures role-based access

---

## 🗄️ Database Models

* **User**
* **Complaint**
* **Bill**
* **Notice**
* **Notification**

---

## 🧪 Future Improvements

* Online payment integration
* Email/SMS notifications
* Mobile app version
* Real-time updates using WebSockets
* Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

Developed by **B. Hamsika**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
