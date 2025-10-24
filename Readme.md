# Spread Knowledge - Server Side

[![Github Server Side](https://img.shields.io/badge/Github-Repository-green)](https://github.com/rubel6610/spread-knowledge-server-side)
[![Client Side](https://img.shields.io/badge/Client-Repository-blue)](https://github.com/rubel6610/spread-knowledge-client-side)
[![Live Site](https://img.shields.io/badge/Live-Site-brightgreen)](https://knowledge-spread.netlify.app)

## 📝 Project Overview

**Spread Knowledge** is a powerful backend server built with Node.js and Express.js that powers a full-stack knowledge-sharing platform. The server handles user authentication, article management, real-time chat functionality, and analytics for a seamless content sharing experience.

---

## 🔗 Important Links

- **Live Server**: [https://spread-knowledge-server.vercel.app](https://spread-knowledge-server.vercel.app)
- **Client Repository**: [https://github.com/rubel6610/spread-knowledge-client-side](https://github.com/rubel6610/spread-knowledge-client-side)
- **Live Website**: [https://knowledge-spread.netlify.app](https://knowledge-spread.netlify.app)

---

## ✨ Key Features

### Authentication & Security
- 🔐 **JWT Token Authentication** - Secure API endpoints with token verification
- 🔒 **Email Verification Middleware** - Ensures users can only access their own data
- 🚫 **Protected Routes** - Authorization checks for sensitive operations

### Article Management
- 📝 **CRUD Operations** - Create, Read, Update, Delete articles
- 🏷️ **Category Filtering** - Filter articles by Technology, Education, Health, Business
- 🔍 **Search Functionality** - Search articles by title, author, or content
- ❤️ **Like System** - Track and update article likes
- 💬 **Comment System** - User comments on articles

### Real-time Chat
- 💬 **Socket.IO Integration** - Real-time messaging between users
- 🟢 **Online Status** - Track online/offline users
- ⌨️ **Typing Indicators** - Show when users are typing
- 📩 **Conversation Management** - Store and retrieve chat histories

### Analytics & Insights
- 📊 **User Analytics** - Track total articles, likes, and comments per user
- 🏆 **Top Contributors** - Leaderboard of most active writers
- 🎯 **Editor's Choice** - Featured articles selection
- 📈 **Category Statistics** - Article distribution by category

### User Management
- 👤 **User Profiles** - Create and update user information
- 🖼️ **Photo & Bio** - Customizable user profiles
- 🔄 **Real-time Updates** - Sync user data across messages and articles

---

## 🛠️ Technologies Used

### Core Technologies
- **Node.js** - JavaScript runtime
- **Express.js v5.1.0** - Web application framework
- **MongoDB v6.17.0** - NoSQL database

### Authentication & Security
- **jsonwebtoken v9.0.2** - JWT token generation and verification
- **firebase-admin v13.4.0** - Firebase authentication
- **cors** - Cross-origin resource sharing

### Real-time Communication
- **socket.io v4.8.1** - WebSocket library for real-time chat

### Development Tools
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload

---

## 📦 NPM Packages

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "firebase-admin": "^13.4.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.17.0",
    "nodemon": "^3.1.10",
    "socket.io": "^4.8.1"
  }
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Firebase project credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rubel6610/spread-knowledge-server-side.git
cd spread-knowledge-server
```

2. **Install dependencies**
```bash
npm install
```



3. **Run the server**
```bash
npm start
```

The server will start on `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication
```
POST   /jwt                    - Generate JWT token
```

### User Management
```
POST   /user                   - Create new user
GET    /user/:email            - Get user by email (Protected)
PUT    /user/:email            - Update user profile (Protected)
GET    /users                  - Get all users (Protected)
```

### Articles
```
GET    /articles               - Get all articles
GET    /articles/:id           - Get article by ID
POST   /articles               - Create new article (Protected)
PATCH  /articles/:id           - Update article likes (Protected)
PUT    /updatearticles/:id     - Update article (Protected)
DELETE /myarticles/:id         - Delete article (Protected)
GET    /myarticles             - Get user's articles (Protected)
GET    /category/:category     - Get articles by category
GET    /editorchoice           - Get editor's choice articles
GET    /topcontributors        - Get top contributors
```

### Comments
```
POST   /comments               - Post a comment (Protected)
GET    /comments/:id           - Get comments for article
```

### Analytics
```
GET    /analytics/:email       - Get user analytics (Protected)
```

### Chat & Conversations
```
GET    /conversations          - Get user conversations (Protected)
POST   /conversations          - Create new conversation (Protected)
GET    /messages/:conversationId - Get conversation messages (Protected)
```

### Socket.IO Events
```
user_connected      - User comes online
send_message        - Send a chat message
receive_message     - Receive a chat message
typing              - User is typing
stop_typing         - User stopped typing
disconnect          - User goes offline
```

---


## 🚀 Future Enhancements

- [ ] Article bookmarking system
- [ ] Notification system
- [ ] Email notifications
- [ ] Article versioning
- [ ] Advanced search with filters
- [ ] Rate limiting
- [ ] API documentation with Swagger

---

**Happy Coding! 🚀**
