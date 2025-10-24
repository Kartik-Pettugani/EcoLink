# EcoLink - Community-Driven Item Exchange Platform

## 🌱 Project Overview

EcoLink is a sustainable web platform that enables local communities to share, exchange, and give away reusable items. By connecting people who have items to share with those who need them, we aim to reduce waste and promote a circular economy.

## ⭐ Core Features

### 🔐 User Authentication
- Secure signup/login with email & password
- JWT-based session management
- Protected routes and user authorization
- Profile customization with personal details

### 📦 Item Management
- Create, update, and delete item listings
- Multiple image uploads via Cloudinary
- Detailed item specifications (title, description, condition)
- Item status tracking (Available/Taken)

### 💬 Real-time Messaging
- Direct messaging between users
- Socket.io powered real-time chat
- Message history persistence
- Unread message notifications

### 👤 User Profiles
- Public profile pages
- Item listing history
- User ratings and reviews
- Profile customization options

## 🛠️ Technology Stack

### Frontend
- React.js with Vite
- Redux Toolkit for state management
- Socket.io-client for real-time features
- TailwindCSS for styling
- React Router for navigation

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Cloudinary for image storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ecolink.git
cd ecolink
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../Client
npm install
```

3. Set up environment variables:

Create `.env` in Server directory:
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Create `.env` in Client directory:
```env
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
```

4. Start the development servers
```bash
# Start backend server (from Server directory)
npm run dev

# Start frontend dev server (from Client directory)
npm run dev
```

## 📝 Project Structure

### Client
```
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── redux/          # Redux store and slices
│   ├── services/       # API and socket services
│   └── apiCalls/       # API integration
```

### Server
```
├── config/            # Configuration files
├── controllers/       # Request handlers
├── middlewares/      # Custom middlewares
├── models/           # MongoDB models
├── routes/           # API routes
└── services/         # Business logic services
```

## 🔒 Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Secure file upload handling


### 🚧 In Development
- Real-time messaging between users
- Advanced location-based filtering
- Enhanced environmental impact dashboard
- Image upload functionality
- Push notifications

## 🌟 Future Enhancements
- Map integration for item discovery
- Email notifications
- Mobile app version

## 👥 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.


**Let's build a more sustainable future together! 🌱♻️**
