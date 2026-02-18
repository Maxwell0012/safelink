# 🛡️ SafeLink - Secure URL Shortener

SafeLink is a professional full-stack application designed to shorten URLs while prioritizing user safety. Unlike standard shorteners, SafeLink integrates with the **Google Safe Browsing API** to scan every link for malware, phishing, and social engineering threats before processing.

---

## 🚀 Key Features

* [cite_start]**🔍 Virus Scanning:** Real-time threat detection via Google Cloud. [cite: 3, 4]
* [cite_start]**🔗 Secure Shortening:** Generates unique 6-character IDs for long URLs. [cite: 4]
* [cite_start]**🔥 Click Tracking:** Real-time counter to track how many times a link is used. [cite: 4]
* [cite_start]**📱 QR Code Generator:** Auto-generates downloadable SVG QR codes for every safe link. [cite: 4]
* [cite_start]**📊 History Dashboard:** A clean UI to view your past links and their performance. [cite: 4]
* [cite_start]**🛡️ Rate Limiting:** Built-in protection to prevent spam and API abuse. [cite: 4]

---

## 🛠️ Tech Stack

### Frontend
- [cite_start]**React (Vite)**: For a fast, responsive user interface. [cite: 4]
- [cite_start]**QRCode.react**: SVG-based QR code generation. [cite: 4]
- [cite_start]**CSS3**: Custom styling for a clean, modern look. [cite: 4]

### Backend
- [cite_start]**Node.js & Express**: High-performance API routing. [cite: 4]
- [cite_start]**Firebase Admin SDK**: Secure, server-side database management. [cite: 4]
- [cite_start]**Google Safe Browsing API**: Enterprise-grade URL security scanning. [cite: 4]
- [cite_start]**Axios**: For communicating with external security services. [cite: 4]

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
* Node.js installed on your system.
* A Google Cloud Project with the **Safe Browsing API** enabled.
* A Firebase Project with **Firestore** enabled.

### 2. Backend Configuration
1.  Navigate to the `backend` folder.
2.  Create a `.env` file and add your Google API Key:
    [cite_start]`GOOGLE_API_KEY=your_key_here` [cite: 2, 4]
3.  [cite_start]Place your Firebase `serviceAccountKey.json` file in the `backend/` directory. [cite: 4]
4.  Run:
    ```bash
    npm install
    node index.js
    ```
    *Server runs on: `http://localhost:8080`*

### 3. Frontend Configuration
1.  Navigate to the `frontend` folder.
2.  Run:
    ```bash
    npm install
    npm run dev
    ```
    *App runs on: `http://localhost:5173`*

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/shorten` | `POST` | Checks for threats and returns a short URL. |
| `/:shortId` | `GET` | Redirects to original URL and increments click count. |
| `/stats/:shortId` | `GET` | Returns current click statistics for a link. |

---

## 🛡️ Security Protocol
- [cite_start]**Lockdown Rules**: Firestore is configured to deny all public requests; only the authorized Node.js backend can write to the database. [cite: 4]
- [cite_start]**Git Safety**: All sensitive credentials (`.env`, `serviceAccountKey.json`) are strictly excluded from version control via `.gitignore`. [cite: 1, 5]

---