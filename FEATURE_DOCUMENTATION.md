# Spread Knowledge - Full-Stack Application with Chat Feature

## 🚀 New Features Added

### 1. **Real-Time Chat System**
- Users can chat with each other in real-time using Socket.IO
- Online/Offline status indicators
- Typing indicators
- Message history persistence
- Beautiful chat UI with user avatars

### 2. **User Dashboard**
- **Analytics Tab**: Visual analytics with charts showing:
  - Total articles published
  - Total likes received
  - Total comments
  - Articles distribution by category (Pie & Bar charts)
  - Recent articles list
- **My Articles Tab**: Manage your published articles
- **Post Article Tab**: Create new articles directly from dashboard
- **Chat Tab**: Real-time messaging with other users

### 3. **Backend Enhancements**
- Socket.IO integration for real-time communication
- New MongoDB collections: `messages` and `conversations`
- Analytics API endpoints
- Chat-related API endpoints
- User listing API (excluding current user)

## 📦 Installation & Setup

### Backend Setup

1. Navigate to the server directory:
```bash
cd spread-knowledge-server
```

2. Install dependencies (Socket.IO already installed):
```bash
npm install
```

3. Make sure your `.env` file contains:
```
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd spread-knowledge-client
```

2. Install dependencies (Socket.IO client and Recharts already installed):
```bash
npm install
```

3. Make sure your `.env` file contains:
```
VITE_BASEURL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## 🎯 Features Overview

### Dashboard Features
1. **Analytics**
   - Visual representation of user statistics
   - Pie chart and bar chart for category distribution
   - Recent articles table
   - Total counts for articles, likes, and comments

2. **Chat System**
   - Real-time messaging
   - User online status
   - Typing indicators
   - Message history
   - User list with avatars
   - Responsive design for mobile and desktop

3. **Article Management**
   - Post new articles
   - View and edit your articles
   - Delete articles
   - All from within the dashboard

## 🔧 Technical Implementation

### Backend Technologies
- **Node.js** with Express
- **Socket.IO** for real-time communication
- **MongoDB** for data persistence
- **JWT** for authentication

### Frontend Technologies
- **React** with React Router
- **Socket.IO Client** for real-time features
- **Recharts** for analytics visualization
- **TailwindCSS** and **DaisyUI** for styling
- **React Icons** for icons

### Key Components Created

#### Backend Files
- `index.js` - Updated with Socket.IO integration and new endpoints

#### Frontend Files
- `src/Provider/SocketProvider.jsx` - Socket.IO context provider
- `src/Components/Analytics.jsx` - Analytics dashboard with charts
- `src/Components/Chat.jsx` - Real-time chat interface
- `src/Pages/UserDashboard.jsx` - Main dashboard with tabs
- `src/Hooks/useSocket.jsx` - Custom hook for socket context
- Updated `src/Router/Routes.jsx` - Added dashboard route
- Updated `src/Components/Navbar.jsx` - Added dashboard link
- Updated `src/main.jsx` - Wrapped app with SocketProvider

## 📱 Usage Guide

### Accessing the Dashboard
1. Log in to your account
2. Click on "Dashboard" in the navigation menu
3. You'll see four tabs:
   - **Analytics**: View your statistics and charts
   - **My Articles**: Manage your articles
   - **Post Article**: Create new articles
   - **Chat**: Message other users

### Using the Chat Feature
1. Go to Dashboard → Chat tab
2. You'll see a list of all users on the left
3. Click on a user to start chatting
4. Type your message and press Enter or click Send
5. Online users will have a green indicator
6. You'll see typing indicators when the other person is typing

### Viewing Analytics
1. Go to Dashboard → Analytics tab
2. View your statistics cards showing:
   - Total articles
   - Total likes
   - Total comments
3. See visual charts for category distribution
4. Check your recent articles list

## 🔐 Security Features
- JWT token authentication for all protected routes
- Socket.IO secured with CORS configuration
- Email verification middleware
- Protected API endpoints

## 🌐 CORS Configuration
Both frontend URLs are whitelisted:
- `http://localhost:5173` (development)
- `https://knowledge-spread.netlify.app` (production)

## 📊 Database Collections

### New Collections
1. **messages**
   - conversationId
   - sender
   - receiver
   - message
   - senderName
   - senderPhoto
   - timestamp
   - read

2. **conversations**
   - participants (array)
   - lastMessage
   - lastMessageTime
   - createdAt

### Existing Collections
- users
- articles
- comments

## 🎨 Design Highlights
- Fully responsive design
- Dark/Light theme support
- Smooth animations and transitions
- Modern UI with gradient cards
- Interactive charts and visualizations
- Mobile-friendly chat interface

## 🐛 Troubleshooting

### Socket Connection Issues
- Ensure both backend and frontend are running
- Check CORS configuration in backend
- Verify VITE_BASEURL in frontend .env

### Chart Not Displaying
- Ensure you have published articles
- Check browser console for errors
- Verify analytics API is working

### Chat Messages Not Sending
- Check Socket.IO connection in browser console
- Verify JWT token is valid
- Ensure recipient user exists

## 📝 Notes
- Make sure to start the backend server before the frontend
- Users need to be logged in to access dashboard features
- The chat feature requires both users to have accounts
- Analytics will only show data for articles you've created

## 🚀 Deployment Considerations

### For Production
1. Update CORS origins in backend `index.js`
2. Use environment variables for all sensitive data
3. Consider using Redis for Socket.IO scaling
4. Implement message pagination for large chat histories
5. Add image upload for chat messages (future enhancement)

## 💡 Future Enhancements
- File sharing in chat
- Group chat functionality
- Message read receipts
- Push notifications
- Video/Audio calls
- Message search functionality
- Chat emoji reactions

---

## ✨ Enjoy the enhanced Spread Knowledge platform with real-time chat and analytics!
