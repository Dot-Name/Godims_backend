# 🚀 Godims Backend

This is the **backend API** for the **Godims** project built using:

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication (httpOnly Cookies)
* Google OAuth
* OTP Login System
* Nodemailer (SMTP Email Service)
* CORS (Multiple Client Support)
* Helmet & Security Middleware

---

## 📁 Project Structure

```
backend/
│── config/
│── controllers/
│── middleware/
│── models/
│── routes/
│── utils/
│── server.js
│── .env
│── package.json
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env` File

Create a `.env` file in the backend root and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# SMTP (Email)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@godims.in
SMTP_PASS=your_email_password

# Frontend URLs (Multiple Allowed Origins)
CLIENT_URLS=http://localhost:5173,https://godims.in,https://test.godims.in

NODE_ENV=development
```

---

## ▶️ Run Project

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

---

## 🔐 Authentication Features

* Google Login
* OTP Login
* JWT stored in **httpOnly cookies**
* Secure cookie settings for production

---

## 📩 Email System

Uses **Nodemailer with SMTP** to:

* Send OTP
* Send notifications

Make sure SMTP credentials are correct in `.env`.

---

## 🌍 CORS Configuration

Supports multiple frontend domains using:

```js
CLIENT_URLS=http://localhost:5173,https://godims.in
```

---

## 🛡 Security

* Helmet
* CORS with credentials
* Cookie security
* Environment variables

---

## 🚀 Deployment

Recommended hosting:

* Backend: Render / Railway / VPS
* Frontend: Hostinger / Vercel / Netlify

If using production:

```env
NODE_ENV=production
```

---

## 👨‍💻 Author

Godims Project

---

## 📌 Notes

* Do NOT upload `.env` to GitHub.
* Add `.env` and `node_modules` to `.gitignore`.
* Always use environment variables in production.

```
```
