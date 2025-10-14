# A-Z Accommodation 🏠

Welcome to **A-Z Accommodation** – your one-stop solution for discovering and renting rooms with ease!  
This project is a fully-featured room rental website built using **Node.js**, **Express**, **MongoDB**, **EJS**, and **CSS**.

---

## 🌟 Live Demo

[Visit the Site](https://a-z-accommodation.onrender.com/home)

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS (Embedded JavaScript Templates), CSS
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** Express-session, MongoDB
- **Other:** MVC architecture

---

## 🗂️ Project Structure

```
A-Z-Accomadation/
│
├── middleware/      # Custom Express middlewares
├── models/          # Mongoose models (User, Room, Booking, etc.)
├── public/          # Static assets (CSS, images, JS)
├── routes/          # Express route handlers
├── utils/           # Utility/helper functions
├── views/           # EJS templates
│   ├── partials/    # Header, footer, navbar, etc.
│   └── pages/       # Main views (Home, Room detail, Booking, etc.)
├── app.js           # Main Express application
├── package.json     # Project metadata and dependencies
├── .gitignore       # Git ignored files
└── README.md        # Project documentation
```

---

## 🚀 Features

- **Room Listings:** Browse rooms available for rent with photos, prices, and details.
- **Room Details:** View detailed info for each room, including amenities, owner, and location.
- **Booking System:** Users can book rooms directly from the website.
- **Authentication:** Secure login and registration for users.
- **User Dashboard:** Manage bookings, edit profile, and view rental history.
- **Admin Panel:** (If applicable) Manage listings, users, and bookings.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rahulbhattsd/A-Z-Accomadation.git
   cd A-Z-Accomadation
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following:
     ```
     MONGODB_URI=your_mongodb_connection_string
     SESSION_SECRET=your_secret_key
     ```
4. **Run MongoDB locally or connect to Atlas.**

5. **Start the server:**
   ```bash
   npm start
   ```
6. **Visit:** `http://localhost:3000` in your browser.

---

## 📝 Usage Instructions

1. **Sign Up / Log In:** Create an account or log in to access booking features.
2. **Browse Rooms:** View available rooms and their details.
3. **Book a Room:** Select your preferred room and complete the booking process.
4. **Manage Bookings:** Access your dashboard to view or cancel bookings.
5. **(Admin) Manage Listings:** Add, edit, or remove room listings.

---

## 🧩 Folder-by-Folder Guide

- **middleware/**: Contains custom middleware for authentication, error handling, etc.
- **models/**: All database models (e.g., User, Room, Booking).
- **public/**: Static files (CSS, images, client-side JS).
- **routes/**: Defines all main routes for the app (user, room, booking, admin).
- **utils/**: Helper functions and utilities.
- **views/**: EJS templates for all pages and UI components.

---

## 📚 Useful Commands

- `npm start` – Start the server
- `npm run dev` – Start server with nodemon (if configured)
- `npm install` – Install dependencies

---

## 🏗️ Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes
4. Commit and push (`git commit -am 'Add feature'`)
5. Open a Pull Request

---

## ❓ FAQ

- **Where can I get support?**  
  Open an issue in this repo or contact [rahulbhattsd](https://github.com/rahulbhattsd).

- **Can I use this project commercially?**  
  Please check the license section below.

---

## 📄 License

This project is licensed under the MIT License.

---


## 👤 Developer
**Rahul Bhatt**  
[LinkedIn](https://www.linkedin.com/in/rahulbhatt-developer)


---




