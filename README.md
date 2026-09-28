Imagify -- AI Image Generation Platform

Imagify is a full-stack AI image generation web application built with
React, Vite, Node.js, Express.js, MongoDB, and ClipDrop API. Users
can create an account, receive free image-generation credits, generate
AI images from text prompts, purchase additional credits through
Razorpay, and manage their credit balance.

Project Status: Full-stack application with authentication, AI
image generation, credit management, and Razorpay payment integration.

📌 Table of Contents

Features

Tech Stack

Project Architecture

Project Structure

How the Application Works

Authentication Flow

AI Image Generation Flow

Credit System

Payment Flow

API Documentation

Environment Variables

Local Setup

Running the Project

Deployment

Security Notes

Common Problems

Future Improvements

Author

✨ Features

👤 User Authentication

User registration

User login

Password hashing using bcrypt

JWT-based authentication

Protected API routes

Persistent login using browser localStorage

Logout functionality

🎨 AI Image Generation

Generate images from text prompts

Uses the ClipDrop Text-to-Image API

Returns generated images as Base64 data URLs

One credit is consumed for each successful image generation

Prevents image generation when the user has no credits

💳 Credit System

Every newly registered user receives:

5 free credits

Credits are deducted after successful image generation.

Example:

Initial credits: 5
Generate image:  -1
Remaining:       4

💰 Credit Purchase

Users can purchase additional credits using Razorpay.

Available plans:

Plan       Credits   Price

Basic      100       ₹10
Advanced   500       ₹50
Business   5000      ₹250

Prices and plans are controlled by the backend. Do not trust prices
sent from the frontend.

📱 Responsive UI

The frontend is built using React and can be styled with Tailwind
CSS/CSS for responsive layouts across different screen sizes.

🛠 Tech Stack

Frontend

React.js

Vite

React Router

Axios

React Toastify

Tailwind CSS / CSS

JavaScript (ES Modules)

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

Axios

FormData

CORS

dotenv

APIs / Services

ClipDrop Text-to-Image API

Razorpay Payment Gateway

MongoDB Atlas

Deployment

Recommended production setup:

Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
Payment  → Razorpay Live Mode

🏗 Project Architecture

                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ React + Vite        │
                         │     Frontend        │
                         └──────────┬──────────┘
                                    │
                         HTTP / Axios Requests
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Node.js + Express   │
                         │      Backend        │
                         └──────┬──────┬───────┘
                                │      │
                    ┌───────────┘      └────────────┐
                    ▼                              ▼
           ┌────────────────┐             ┌────────────────┐
           │ MongoDB Atlas  │             │   ClipDrop API │
           │ Users/Payments │             │ AI Image Gen.  │
           └────────────────┘             └────────────────┘
                                │
                                ▼
                         ┌────────────────┐
                         │    Razorpay    │
                         │    Payments    │
                         └────────────────┘

📁 Project Structure

Imagify/
│
├── Backend/
│   │
│   ├── config/
│   │   └── mongodb.js
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── imageController.js
│   │   └── paymentController.js
│   │
│   ├── middlewares/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   └── transactionModel.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── imageRoutes.js
│   │   └── paymentRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md

🔄 How the Application Works

The application follows this basic flow:

1. User opens website
        ↓
2. User registers / logs in
        ↓
3. Backend creates JWT token
        ↓
4. Frontend stores token
        ↓
5. Frontend requests user's credit balance
        ↓
6. User enters an image prompt
        ↓
7. Frontend sends prompt + JWT
        ↓
8. Backend verifies JWT
        ↓
9. Backend checks user's credits
        ↓
10. Backend calls ClipDrop API
        ↓
11. AI image is generated
        ↓
12. Backend deducts 1 credit
        ↓
13. Image is returned to frontend

🔐 Authentication Flow

Imagify uses JWT (JSON Web Token) authentication.

Registration

Frontend sends:

POST /api/user/register

Request body:

{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}

Backend:

Checks whether the email already exists.

Hashes the password using bcrypt.

Creates the user.

Assigns default credits.

Creates a JWT.

Returns the token.

The frontend stores the token in:

localStorage

Login

POST /api/user/login

Request:

{
  "email": "john@example.com",
  "password": "password123"
}

The backend verifies the password and returns a JWT.

Protected Routes

Protected requests send the token in the header:

token: YOUR_JWT_TOKEN

The authentication middleware:

Request
   ↓
Check token
   ↓
jwt.verify()
   ↓
Extract user ID
   ↓
req.userId = tokenDecode.id
   ↓
next()

🎨 AI Image Generation Flow

Endpoint:

POST /api/image/generate-image

Request body:

{
  "prompt": "A futuristic city at sunset"
}

Header:

token: YOUR_JWT_TOKEN

The backend:

Gets userId from authentication middleware.

Finds the user.

Checks the prompt.

Checks available credits.

Sends the prompt to ClipDrop.

Receives the generated image.

Converts the image to Base64.

Deducts one credit.

Returns the image.

Response:

{
  "success": true,
  "message": "Image Generated",
  "creditBalance": 4,
  "resultImage": "data:image/png;base64,..."
}

💳 Credit System

The user model contains:

creditBalance: {
  type: Number,
  default: 5
}

When an image is successfully generated:

creditBalance: user.creditBalance - 1

If the user's balance is zero:

{
  "success": false,
  "message": "No Credit Balance",
  "creditBalance": 0
}

The frontend can then redirect the user to the credit purchase page.

💰 Payment Flow

Imagify uses Razorpay for credit purchases.

Step 1 -- Select Plan

User selects a plan such as:

Basic
Advanced
Business

Frontend sends:

POST /api/user/pay-razor

Request:

{
  "planId": "Basic"
}

Step 2 -- Backend Creates Transaction

The backend determines:

Plan
Credits
Amount
User ID
Date

The transaction is stored in MongoDB.

Step 3 -- Razorpay Order

The backend creates a Razorpay order.

Razorpay amount is specified in the smallest currency unit.

For INR:

₹10 = 1000 paise

Therefore:

amount: amount * 100

Step 4 -- Razorpay Checkout

The frontend opens the Razorpay checkout window using the returned
order.

The Razorpay checkout script is included in:

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

Step 5 -- Payment Verification

After successful payment, Razorpay returns payment information to the
frontend.

Frontend sends the payment information to:

POST /api/user/verify-razor

The backend verifies the order/payment and checks the corresponding
transaction.

Step 6 -- Add Credits

After successful verification:

Current Credits
       +
Purchased Credits
       =
New Credit Balance

The transaction is marked as processed to prevent duplicate credit
allocation.

🌐 API Documentation

Base URL for local development:

http://localhost:4000

Production base URL:

https://your-backend-url.onrender.com

User APIs

Register

POST /api/user/register

Body:

{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}

Login

POST /api/user/login

Body:

{
  "email": "john@example.com",
  "password": "password123"
}

Get Credits

GET /api/user/credits

Header:

token: JWT_TOKEN

🖼 Image API

Generate Image

POST /api/image/generate-image

Header:

token: JWT_TOKEN

Body:

{
  "prompt": "A flying dog in a futuristic city"
}

💵 Payment APIs

Create Razorpay Order

POST /api/user/pay-razor

Header:

token: JWT_TOKEN

Body:

{
  "planId": "Basic"
}

Verify Razorpay Payment

POST /api/user/verify-razor

Header:

token: JWT_TOKEN

Body contains Razorpay payment response.

⚙️ Environment Variables

Backend .env

Create:

PORT=4000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIPDROP_API=your_clipdrop_api_key

CURRENCY=INR

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

Production Razorpay

For real payments, use Live credentials:

RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

Never expose the Razorpay secret to the frontend.

Frontend .env

For local development:

VITE_BACKEND_URL=http://localhost:4000

VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx

For production:

VITE_BACKEND_URL=https://your-backend-url.onrender.com

VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx

Vite exposes variables prefixed with VITE_ to frontend code.
Therefore, never put secrets such as RAZORPAY_KEY_SECRET, database
passwords, or JWT secrets in frontend environment variables.

💻 Local Setup

Prerequisites

Install:

Node.js

npm

MongoDB Atlas account

Git

GitHub account

Optional:

Postman

VS Code

Clone Repository

git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

Move into the project:

cd Imagify

🔧 Backend Setup

cd Backend

Install dependencies:

npm install

Create .env:

PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIPDROP_API=your_clipdrop_api_key
CURRENCY=INR
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

Start backend:

node server.js

Expected output:

Server Running at PORT : 4000
Database Connected

Test:

http://localhost:4000/

Expected response:

API working

🎨 Frontend Setup

Open a new terminal:

cd Frontend

Install dependencies:

npm install

Create .env:

VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key

Start development server:

npm run dev

Vite will provide a local URL similar to:

http://localhost:5173

🚀 Running Both Servers

You need two terminals.

Terminal 1 -- Backend

cd Backend
node server.js

Terminal 2 -- Frontend

cd Frontend
npm run dev

Then open the frontend URL shown by Vite.

☁️ Deployment

Recommended production architecture:

GitHub
  │
  ├── Backend ──→ Render
  │                  │
  │                  ├── MongoDB Atlas
  │                  ├── ClipDrop API
  │                  └── Razorpay
  │
  └── Frontend ─→ Vercel

Backend Deployment -- Render

Set:

Root Directory:
Backend

Build command:

npm install

Start command:

node server.js

Do not use:

npm run build

unless a build script actually exists in the backend package.json.

Add backend environment variables in the Render dashboard.

Frontend Deployment -- Vercel

Set:

Root Directory:
Frontend

Build command:

npm run build

Output directory:

dist

Add:

VITE_BACKEND_URL=https://your-backend-url.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_live_key

After changing Vite environment variables, create a new deployment.

🔒 Security Notes

Never commit .env

Add this to .gitignore:

.env
node_modules
dist

Never upload:

MONGO_URI
JWT_SECRET
CLIPDROP_API
RAZORPAY_KEY_SECRET

to GitHub.

Razorpay Secret

Only the backend should contain:

RAZORPAY_KEY_SECRET

The frontend should only use:

VITE_RAZORPAY_KEY_ID

Authentication

Protected APIs should use the authentication middleware.

Example:

imageRouter.post(
  "/generate-image",
  userAuth,
  generateImage
);

This prevents unauthenticated users from directly accessing protected
functionality.

🐛 Common Problems

1. Render: Missing script "build"

Error:

npm error Missing script: "build"

For the Node.js backend, use:

Build Command:
npm install

Start Command:
node server.js

Do not use npm run build unless your backend defines that script.

2. MongoDB Connection Error

Check:

MongoDB connection string

MongoDB Atlas Network Access

Database user/password

Environment variable name

Internet/network connectivity

3. CORS Error

Backend should allow requests from the frontend.

Development:

app.use(cors());

Production can restrict the origin:

app.use(cors({
  origin: "https://your-frontend.vercel.app"
}));

4. window.Razorpay is undefined

Make sure index.html contains:

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

5. Razorpay Test Mode Appears

Test Mode uses sandbox credentials.

For real payments:

Activate the Razorpay account.

Complete required verification/KYC.

Switch to Live Mode.

Generate Live API keys.

Update backend and frontend environment variables.

Redeploy/restart the application.

6. Frontend Still Calls localhost

Check:

VITE_BACKEND_URL

Production should use the deployed backend URL:

VITE_BACKEND_URL=https://your-backend-url.onrender.com

🧪 Testing Checklist

Before considering the application production-ready, test:

Authentication

Register a new user

Duplicate email handling

Login with correct password

Login with incorrect password

Logout

Protected route without token

Image Generation

Generate image with valid prompt

Check credit deduction

Try generation with zero credits

Check invalid/missing prompt

Check ClipDrop API failure handling

Payments

Create order

Open Razorpay checkout

Complete test payment

Verify payment

Check credits after payment

Prevent duplicate transaction processing

Deployment

Backend deployed

Frontend deployed

MongoDB accessible

CORS configured

Production environment variables configured

Razorpay Live credentials configured when going live

.env not committed to GitHub

🔮 Future Improvements

Possible improvements for future versions:

Image history

Download generated images

Delete generated images

User profile page

Password reset

Email verification

Google authentication

Better prompt suggestions

Multiple AI image-generation models

Image storage using Cloudinary or object storage

Payment history page

Admin dashboard

Usage analytics

Rate limiting

Server-side Razorpay signature verification

Improved transaction/order reconciliation

Automated testing

CI/CD pipeline

📚 Learning Outcomes

This project demonstrates practical experience with:

React component development

React Context API

React Router

REST APIs

Axios

Node.js

Express.js

MongoDB

Mongoose

JWT authentication

Password hashing

Middleware

Environment variables

Third-party API integration

AI image generation API

Payment gateway integration

Razorpay orders and payments

CORS

Git/GitHub

Vercel deployment

Render deployment

Production environment configuration

👨‍💻 Author

Mayank Gupta

Full Stack Developer / MERN Stack Learner

Technologies

HTML
CSS
JavaScript
React
Vite
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Axios
Razorpay
ClipDrop API
Git
GitHub

⭐ Project

If you found this project useful, consider giving the repository a ⭐ on
GitHub.

⚠️ Disclaimer

This project is intended for learning and demonstration purposes. API
keys, payment credentials, database credentials, and other secrets must
be stored securely using environment variables and must never be
committed to source control.
