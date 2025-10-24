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

## 🌟 Future Enhancements
- Map integration for item discovery
- Advanced search and filtering
- Impact tracking dashboard
- Email notifications
- Mobile app version

## 👥 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License. - The Circular Economy Platform

🌱 **EcoLink** is a community-driven web platform that promotes sustainable living by enabling users to share, exchange, and reuse items locally. Built with the MERN stack, it helps reduce waste, lower carbon footprints, and build stronger communities.

## 🎯 Features

### ✅ Completed Features
- **User Authentication**: Secure signup/signin with JWT tokens
- **User Profiles**: Complete profile management with location and environmental impact tracking
- **Item Management**: Post, browse, and manage items with full CRUD operations
- **Environmental Impact**: Track CO₂ savings and waste diversion
- **Location-based**: Items are organized by location for local sharing
- **Responsive UI**: Beautiful, modern interface built with Tailwind CSS

### 🚧 In Development
- Real-time messaging between users
- Advanced location-based filtering
- Enhanced environmental impact dashboard
- Image upload functionality
- Push notifications

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **React 19** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcoLink
   ```

2. **Install server dependencies**
   ```bash
   cd Server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../Client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the Server directory:
   ```env
   # Database
   dbUrl=mongodb://localhost:27017/ecolink
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Server Port
   PORT=8000
   ```

5. **Start the development servers**
   
   In the Server directory:
   ```bash
   npm run dev
   ```
   
   In the Client directory (new terminal):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
EcoLink/
├── Client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   └── apiCalls/      # API integration
│   └── package.json
├── Server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   └── config/           # Configuration files
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### User Management
- `GET /api/user/current` - Get current user
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/location` - Update location
- `GET /api/user/stats` - Get user statistics

### Item Management
- `GET /api/items` - Get all items (with filters)
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/items/:id/interest` - Express interest in item

## 🌍 Environmental Impact

EcoLink calculates environmental impact based on:
- **Item Category**: Different categories have different CO₂ production factors
- **Item Condition**: Better condition = higher impact (more waste diverted)
- **Item Weight**: Used to calculate total environmental savings

### Impact Categories
- Electronics: 15kg CO₂ per kg
- Furniture: 8kg CO₂ per kg
- Clothing: 12kg CO₂ per kg
- Books: 3kg CO₂ per kg
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the environment
- Inspired by the circular economy movement
- Thanks to all contributors and the open-source community

---

**Let's build a more sustainable future together! 🌱♻️**
