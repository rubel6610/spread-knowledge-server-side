# Deployment Notes - Production Checklist

## 🚀 Pre-Deployment Checklist

### Backend (Server)

#### Environment Variables
```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
JWT_SECRET=your_strong_jwt_secret
PORT=3000
```

#### CORS Configuration
**In index.js, update CORS origins for production:**
```javascript
// Current configuration
origin: ["http://localhost:5173", "https://knowledge-spread.netlify.app"]

// For production, keep only:
origin: ["https://knowledge-spread.netlify.app", "https://your-custom-domain.com"]
```

#### Vercel Deployment
The `vercel.json` is already configured, but note:
- ⚠️ **Socket.IO on Vercel**: Vercel serverless functions have limitations with WebSocket
- **Recommended**: Deploy backend to a platform with persistent connections:
  - Railway.app
  - Render.com
  - DigitalOcean App Platform
  - Heroku
  - AWS EC2 / ECS

**Why?** Socket.IO requires long-lived connections that serverless functions don't support well.

### Frontend (Client)

#### Environment Variables
```env
VITE_BASEURL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Netlify Deployment
Already configured for Netlify. Update:
1. Set environment variables in Netlify dashboard
2. Update `VITE_BASEURL` to point to production backend
3. Deploy from Git repository

---

## 🔧 Alternative Deployment Strategies

### Option 1: Recommended for Socket.IO

**Backend:** Railway.app or Render.com
**Frontend:** Netlify (current)

**Steps:**
1. Create account on Railway/Render
2. Connect GitHub repository
3. Set environment variables
4. Deploy
5. Update frontend `VITE_BASEURL` with new backend URL

### Option 2: All-in-One Platform

**Both Backend & Frontend:** Render.com

**Steps:**
1. Create two services on Render:
   - Web Service (for backend)
   - Static Site (for frontend)
2. Configure environment variables
3. Deploy both

### Option 3: Self-Hosted

**VPS (DigitalOcean, Linode, etc.)**

**Requirements:**
- Ubuntu/Debian server
- Nginx as reverse proxy
- PM2 for process management
- SSL certificate (Let's Encrypt)

---

## 📝 Post-Deployment Configuration

### 1. Update CORS
```javascript
// index.js
const io = new Server(server, {
  cors: {
    origin: ["https://your-production-frontend.com"],
    credentials: true,
    methods: ["GET", "POST"]
  }
});
```

### 2. Update Frontend Socket Connection
```javascript
// SocketProvider.jsx
const newSocket = io(import.meta.env.VITE_BASEURL || 'https://your-backend.com', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});
```

### 3. Database Indexes (Performance)
Run in MongoDB:
```javascript
// Create indexes for better performance
db.messages.createIndex({ conversationId: 1, timestamp: 1 });
db.conversations.createIndex({ participants: 1 });
db.conversations.createIndex({ lastMessageTime: -1 });
db.articles.createIndex({ authorEmail: 1 });
```

---

## 🔒 Security Hardening

### Backend
1. **Rate Limiting** (Add express-rate-limit)
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

2. **Helmet.js** (Security headers)
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

3. **Environment Variables**
- Never commit `.env` to Git
- Use platform-specific secret management
- Rotate JWT secrets periodically

### Frontend
1. **API Key Security**
- Firebase API keys are safe in frontend (restricted by domain)
- Never expose backend API keys

2. **Content Security Policy**
- Configure in build settings if needed

---

## 📊 Monitoring & Logging

### Recommended Tools

1. **Error Tracking**
   - Sentry.io
   - LogRocket
   - Bugsnag

2. **Performance Monitoring**
   - New Relic
   - Datadog
   - Google Analytics

3. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom
   - StatusCake

### Basic Logging Setup

**Backend:**
```javascript
// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

---

## 🔄 Database Backup Strategy

### MongoDB Atlas (Recommended)
- Automatic backups enabled by default
- Point-in-time recovery available
- Export important collections regularly

### Manual Backup
```bash
# Using mongodump
mongodump --uri="your_mongodb_uri" --out=/backup/location

# Restore
mongorestore --uri="your_mongodb_uri" /backup/location
```

---

## 🚨 Known Limitations & Solutions

### 1. Vercel + Socket.IO Issue
**Problem:** Vercel serverless functions disconnect WebSocket connections
**Solution:** Deploy backend to Railway, Render, or VPS

### 2. Socket.IO Connection Timeouts
**Problem:** Connection drops after inactivity
**Solution:** Implement heartbeat mechanism
```javascript
// Already handled by Socket.IO ping/pong
// Configure timeout if needed:
const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000
});
```

### 3. Message Scalability
**Problem:** Large message histories load slowly
**Solution:** Implement pagination
```javascript
// Future enhancement
app.get('/messages/:conversationId', async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;
  
  const messages = await messagesCollections
    .find({ conversationId })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
    
  res.send(messages);
});
```

---

## 🎯 Performance Optimization

### Backend
1. **Connection Pooling** (MongoDB)
   - Already configured in MongoClient
   - Default pool size: 100

2. **Compression**
```bash
npm install compression
```
```javascript
const compression = require('compression');
app.use(compression());
```

3. **Caching** (For future)
```bash
npm install redis
```

### Frontend
1. **Code Splitting** (Vite handles this)
2. **Lazy Loading Routes**
```javascript
// Future optimization
const UserDashboard = lazy(() => import('./Pages/UserDashboard'));
```

3. **Image Optimization**
- Use WebP format
- Lazy load images
- Use CDN for static assets

---

## 📱 Mobile Considerations

### Progressive Web App (PWA)
**Future Enhancement:**
1. Add service worker
2. Create manifest.json
3. Enable offline support
4. Add to home screen functionality

### Responsive Design
✅ Already implemented
- Dashboard works on mobile
- Chat interface is mobile-friendly
- Analytics charts are responsive

---

## 🧪 Testing Recommendations

### Backend Testing
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Create tests
# tests/api.test.js
# tests/socket.test.js
```

### Frontend Testing
```bash
# Install testing libraries
npm install --save-dev @testing-library/react vitest

# Create tests
# src/__tests__/Dashboard.test.jsx
# src/__tests__/Chat.test.jsx
```

### Load Testing
Use tools like:
- Apache JMeter
- k6.io
- Artillery

---

## 📈 Scaling Strategy

### Phase 1: Current (1-100 users)
✅ Single server deployment
✅ MongoDB Atlas (M0 free tier)
✅ Netlify frontend

### Phase 2: Growth (100-1000 users)
- Upgrade MongoDB Atlas tier
- Use Redis for Socket.IO adapter
- CDN for static assets
- Database read replicas

### Phase 3: Scale (1000+ users)
- Load balancer
- Multiple backend instances
- Redis cluster
- Microservices architecture
- Message queue (RabbitMQ/Kafka)

---

## 🔐 Compliance & Privacy

### GDPR Considerations
- Add privacy policy
- Implement data export
- Add account deletion
- Cookie consent banner

### Data Retention
- Define message retention policy
- Archive old conversations
- Clean up inactive users

---

## 📞 Incident Response Plan

### When Things Break

1. **Check Monitoring**
   - Error rates
   - Response times
   - Socket connections

2. **Common Issues**
   - Database connection lost → Check MongoDB Atlas
   - Socket.IO not connecting → Check CORS, backend URL
   - High error rates → Check logs

3. **Rollback Plan**
   - Git tags for versions
   - Database backups ready
   - Quick rollback to previous deploy

---

## ✅ Final Pre-Launch Checklist

- [ ] Environment variables set
- [ ] CORS configured for production domains
- [ ] Database indexes created
- [ ] SSL certificates installed
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Rate limiting enabled
- [ ] Security headers added
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on incident response

---

## 🎉 Launch Day

1. Deploy backend first
2. Update frontend env vars
3. Deploy frontend
4. Test all features
5. Monitor logs closely
6. Be ready for quick fixes

---

## 📚 Useful Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Performance Best Practices](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/)
- [React Production Build](https://react.dev/learn/start-a-new-react-project)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app/)

---

**Prepared:** 2025-10-21
**Status:** Ready for Production Deployment 🚀
