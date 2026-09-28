
Imagify

Imagify is a full-stack AI image generation web application where users can generate images from text prompts and purchase additional credits.

✨ Features

User Registration & Login

JWT Authentication

AI Image Generation using ClipDrop API

Credit-based image generation

Razorpay payment integration

MongoDB database

Responsive React UI

Protected backend APIs

🛠 Tech Stack

Frontend: React, Vite, Axios, React Router, Tailwind CSS
Backend: Node.js, Express.js, Mongoose, JWT, bcrypt
Database: MongoDB Atlas
APIs: ClipDrop, Razorpay
Deployment: Vercel + Render

📁 Project Structure

Imagify/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

🚀 Local Setup

Backend

cd Backend
npm install
node server.js

Frontend

cd Frontend
npm install
npm run dev

Create .env files with your required MongoDB, JWT, ClipDrop and Razorpay credentials.

🔄 How It Works

User Login
    ↓
Enter Prompt
    ↓
Backend verifies JWT
    ↓
Check Credits
    ↓
ClipDrop generates image
    ↓
1 Credit Deducted
    ↓
Image shown to User

For purchasing credits:

Select Plan
    ↓
Razorpay Order
    ↓
Payment
    ↓
Backend Verification
    ↓
Credits Added

🌐 Deployment

Recommended setup:

Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
Payment  → Razorpay

For production, keep all secret keys in environment variables and never commit .env to GitHub.

🔐 Security

Never expose or commit:

MONGO_URI
JWT_SECRET
CLIPDROP_API
RAZORPAY_KEY_SECRET

Use only the Razorpay Key ID on the frontend.

👨‍💻 Author

Mayank Gupta

MERN Stack / Full Stack Developer
