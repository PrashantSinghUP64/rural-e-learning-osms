# 🚀 Rural E-Learning 

A comprehensive offline-first e-learning platform designed specifically for rural communities, featuring multi-language support, adaptive learning, and innovative educational tools.

## ✨ Key Features

### 🎯 Core Features
- **Offline-First Architecture** - Works without internet connection
- **Multi-Language Support** - English and Punjabi interface
- **Adaptive Learning** - Personalized learning paths
- **Digital Tutor** - AI-powered hints and guidance
- **Virtual Classroom** - Lightweight audio-first experience
- **AR/VR Labs** - Low-cost immersive learning
- **Skill-to-Earning Path** - Practical skills for income generation
- **Gamification** - Rewards, badges, and progress tracking

### 👥 User Roles
- **Students** - Access content, track progress, join classrooms
- **Teachers** - Create content, manage classrooms, assign work
- **Parents** - Monitor child progress, view reports
- **Admins** - Platform management and content approval

### 📱 Technical Features
- **Service Workers** - Offline content caching
- **IndexedDB** - Local data storage
- **WebRTC** - Peer-to-peer communication
- **JWT Authentication** - Secure user sessions
- **Real-time Updates** - Socket.IO integration
- **Responsive Design** - Mobile-first approach

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Multer** - File uploads

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **Socket.IO Client** - Real-time features
- **i18next** - Internationalization

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rural-e-learning-osms
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend
   cd ../backend
   cp config.env.example .env
   # Edit .env with your configuration
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 📁 Project Structure

```
rural-e-learning-osms/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── uploads/         # File uploads
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── modules/             # Feature modules
    ├── adaptive-learning/
    ├── ar-vr-labs/
    ├── calling/
    ├── contextual/
    ├── digital-tutor/
    ├── offline-lectures/
    ├── skill-path/
    └── virtual-classroom/
```

## 🔧 Configuration

### Backend Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/rural-elearning
JWT_SECRET=your_super_secret_jwt_key_here
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration
- Proxy configured to backend at `http://localhost:4000`
- Tailwind CSS with custom theme
- i18next for multi-language support

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Content Endpoints
- `GET /api/content` - Get content with filters
- `GET /api/content/offline` - Get offline-optimized content
- `POST /api/content` - Create new content
- `PUT /api/content/:id` - Update content

### Progress Endpoints
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update progress
- `POST /api/progress/quiz` - Submit quiz

### Classroom Endpoints
- `GET /api/classroom` - Get user classrooms
- `POST /api/classroom` - Create classroom
- `POST /api/classroom/:id/join` - Join classroom

## 🌐 Multi-Language Support

The platform supports English and Punjabi languages with:
- Dynamic language switching
- RTL support for Punjabi
- Localized content and UI
- Language-specific fonts (Noto Sans Gurmukhi)

## 📱 Offline-First Features

### Service Worker
- Caches static assets and API responses
- Provides offline functionality
- Background sync for data updates

### IndexedDB Storage
- Stores content for offline access
- Manages user progress locally
- Queues actions for sync when online

### Content Management
- Compressed media files (≤5MB)
- Progressive download
- Smart caching strategies

## 🎮 Gamification System

### Points and Rewards
- Content completion points
- Quiz performance bonuses
- Streak rewards
- Achievement badges

### Progress Tracking
- Visual progress indicators
- Learning analytics
- Performance insights
- Goal setting

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting
- Input validation
- File upload security
- CORS configuration

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set secure JWT secret
- Configure file upload limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Roadmap

### Phase 2: AI Mentor + P2P Sync
- Advanced AI tutoring system
- Peer-to-peer data synchronization
- Local content sharing

### Phase 3: AR Labs + Skill-to-Earning
- AR experiment modules
- Freelance skill training
- Portfolio building tools

---

**Built with ❤️ for rural education empowerment**
