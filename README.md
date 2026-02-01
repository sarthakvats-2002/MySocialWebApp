# 🔥 EchoConnect - Next-Generation Social Media Platform

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)

**A modern, feature-rich social networking platform with real-time capabilities**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Setup](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 🌟 Overview

EchoConnect is a next-generation social media platform built with the MERN stack (MongoDB, Express, React, Node.js) and enhanced with real-time features using Socket.io. It offers a modern, sleek interface with comprehensive social networking capabilities.

### ✨ What Makes EchoConnect Special?

- 💬 **Real-time Chat** - Instant messaging with typing indicators
- 🌙 **Dark Mode** - Beautiful dark theme with smooth transitions
- 📖 **Stories** - 24-hour disappearing stories like Instagram
- 💭 **Comments** - Rich commenting system on posts
- 🔔 **Live Notifications** - Real-time updates for all activities
- 🔍 **Smart Search** - Find users instantly as you type
- 🟢 **Presence System** - See who's online in real-time
- 🔒 **Secure** - JWT authentication with industry-standard security

---

## 🎯 Features

### Core Functionality
- ✅ User authentication (Register/Login/Logout)
- ✅ Create, edit, and delete posts with images
- ✅ Like and react to posts
- ✅ Comment on posts with real-time updates
- ✅ Follow/unfollow users
- ✅ Customizable user profiles with cover/profile pictures
- ✅ Timeline feed with posts from followed users
- ✅ User profile pages

### Real-time Features
- ✅ Instant messaging with Socket.io
- ✅ Online/offline status indicators
- ✅ Typing indicators in chat
- ✅ Real-time notifications
- ✅ Live presence tracking

### Modern UI/UX
- ✅ Dark mode with smooth transitions
- ✅ Glassmorphism design elements
- ✅ Smooth animations and micro-interactions
- ✅ Toast notifications for all actions
- ✅ Loading states and skeletons
- ✅ Fully responsive design

### Social Features
- ✅ 24-hour stories with image support
- ✅ Advanced user search
- ✅ Friend suggestions
- ✅ User activity feed
- ✅ Notification center

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **express-validator** - Input validation
- **Helmet** - Security middleware

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Socket.io-client** - Real-time client
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Material-UI** - Icons and components
- **React Hot Toast** - Toast notifications
- **timeago.js** - Relative time formatting

---

## 🚀 Quick Start

### Prerequisites
```bash
node >= 16.0.0
npm >= 8.0.0
MongoDB (local or Atlas)
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/MySocialWebApp.git
cd MySocialWebApp
```

2. **Setup Backend**
```bash
cd api
npm install
```

Create `.env` file in `api` directory:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=8800
NODE_ENV=development
```

Start backend:
```bash
npm start
```

3. **Setup Frontend**
```bash
cd client
npm install
```

Create `.env` file in `client` directory:
```env
REACT_APP_API_URL=http://localhost:8800/api
REACT_APP_SOCKET_URL=http://localhost:8800
REACT_APP_PUBLIC_FOLDER=/images/
```

Start frontend:
```bash
npm start
```

4. **Access the application**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8800`

---

## 📁 Project Structure

```
MySocialWebApp/
├── api/                    # Backend
│   ├── models/            # Database models
│   ├── routes/            # API endpoints
│   ├── middleware/        # Custom middleware
│   ├── public/images/     # Uploaded files
│   └── index.js           # Server entry point
│
├── client/                # Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context
│   │   └── apiCalls.js   # API utilities
│   └── public/
│
├── SETUP_GUIDE.md        # Detailed setup guide
└── TRANSFORMATION_SUMMARY.md  # Feature documentation
```

---

## 📚 Documentation

- [**Setup Guide**](./SETUP_GUIDE.md) - Detailed installation and configuration
- [**Transformation Summary**](./TRANSFORMATION_SUMMARY.md) - Complete feature list and changes
- **API Documentation** - See SETUP_GUIDE.md for all endpoints

---

## 🎨 Screenshots

### Modern UI with Dark Mode
![Dark Mode](https://via.placeholder.com/800x400?text=EchoConnect+Dark+Mode)

### Real-time Chat
![Chat Interface](https://via.placeholder.com/800x400?text=Real-time+Chat)

### Stories Feature
![Stories](https://via.placeholder.com/800x400?text=24-Hour+Stories)

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ Secure file uploads with type/size validation
- ✅ XSS protection
- ✅ HTTP security headers with Helmet

---

## 🎯 Use Cases

Perfect for:
- Learning full-stack development
- Building social networking features
- Understanding real-time web applications
- Portfolio projects
- Startup MVPs
- Social network for communities
- Internal company social platforms

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sarthak Vats**

- GitHub: [@sarthakvats](https://github.com/sarthakvats)

---

## 🙏 Acknowledgments

- Material-UI for beautiful icons
- Socket.io team for real-time capabilities
- React community for amazing tools
- MongoDB for flexible database
- All open-source contributors

---

## 📞 Support

For issues and questions:
- 🐛 [Report Bugs](https://github.com/yourusername/MySocialWebApp/issues)
- 💡 [Request Features](https://github.com/yourusername/MySocialWebApp/issues)
- 📧 Email: your.email@example.com

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️!

---

<div align="center">

**Built with ❤️ using MERN Stack**

[⬆ Back to Top](#-echoconnect---next-generation-social-media-platform)

</div>
