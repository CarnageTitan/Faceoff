# Face Off Mobile - Complete Download Package

This is the complete React Native mobile application package for Face Off - The Ultimate Peer-to-Peer Challenge Platform.

## What's Included

### 📱 React Native Mobile App
- Complete iOS and Android mobile application
- Native UI components and navigation
- Authentication system
- Challenge management features
- Profile and social features
- AI-powered challenge descriptions

### 🚀 Backend Server
- Express.js REST API server
- User authentication and sessions
- Challenge CRUD operations
- AI integration with OpenAI
- PostgreSQL database support
- In-memory storage option for development

### 📋 Complete Documentation
- Setup instructions for both platforms
- App Store submission guides
- Development environment setup
- Production deployment instructions

## Quick Start

### 1. Download and Extract
```bash
# Extract the package
unzip face-off-mobile-complete.zip
cd face-off-mobile-complete
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the backend server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Mobile App Setup
```bash
# Navigate to mobile directory
cd mobile

# Install mobile dependencies
npm install

# iOS setup (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start
```

### 4. Run the App
```bash
# Android (in new terminal)
npm run android

# iOS (in new terminal, macOS only)
npm run ios
```

## File Structure

```
face-off-mobile-complete/
├── server/                 # Backend Express.js server
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── auth.ts            # Authentication system
│   ├── storage.ts         # Database interface
│   └── ai-service.ts      # OpenAI integration
├── mobile/                # React Native mobile app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── components/    # Reusable components
│   │   ├── navigation/    # Navigation setup
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   ├── android/           # Android project files
│   ├── ios/               # iOS project files
│   └── package.json       # Mobile dependencies
├── shared/                # Shared types and schemas
├── DEPLOYMENT.md          # Deployment instructions
├── README.md             # Main documentation
└── package.json          # Backend dependencies
```

## Development Requirements

### System Requirements
- **macOS** (required for iOS development)
- **Node.js 16+** and npm
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Xcode 14+** (for iOS)
- **Android Studio** (for Android)

### Optional Services
- **PostgreSQL** (for production database)
- **OpenAI API Key** (for AI features)

## Features

### 🎮 Challenge System
- Create challenges across multiple categories
- Gaming, Sports, Fitness, Trivia, and Casual challenges
- AI-powered challenge description generation
- Token-based wagering system
- Challenge lifecycle management (open → accepted → completed)

### 👤 User Management
- Secure authentication with username/password
- User profiles with statistics tracking
- Token system for challenge wagering
- Win/loss record tracking
- Achievement system

### 🤝 Social Features
- Friend system with pending/accepted status
- Challenge leagues for group competition
- Leaderboards and rankings
- Social challenge feeds

### 📱 Mobile Experience
- Native iOS and Android apps
- Bottom tab navigation
- Pull-to-refresh functionality
- Loading states and error handling
- Responsive design for all screen sizes

## App Store Deployment

### iOS App Store
1. **Requirements**: Apple Developer Account ($99/year)
2. **Build**: Use Xcode or Fastlane automation
3. **Assets**: App icons, screenshots, app store description
4. **Review**: Apple review process (24-48 hours typically)

### Google Play Store
1. **Requirements**: Google Play Console Account ($25 one-time)
2. **Build**: Generate signed APK/AAB files
3. **Assets**: App icons, screenshots, store listing
4. **Review**: Google review process (few hours to days)

## Production Hosting

### Backend Options
- **Heroku**: Easy deployment with PostgreSQL addon
- **Vercel**: Automatic deployments from Git
- **AWS/GCP**: Full control and scalability
- **Digital Ocean**: VPS hosting
- **Railway**: Modern platform-as-a-service

### Database Options
- **PostgreSQL**: Recommended for production
- **Neon**: Serverless PostgreSQL
- **PlanetScale**: MySQL-compatible serverless database
- **In-Memory**: Development/testing only

## Environment Configuration

### Required Variables
```bash
# Database connection
DATABASE_URL=postgresql://user:pass@localhost:5432/faceoff

# Session security
SESSION_SECRET=your-secure-random-string-here

# AI features (optional)
OPENAI_API_KEY=sk-your-openai-api-key

# Production settings
NODE_ENV=production
PORT=5000
```

### Mobile App Configuration
Update `mobile/src/services/api.ts` with your server URL:
```typescript
// Development
const API_BASE_URL = 'http://localhost:5000';

// Production
const API_BASE_URL = 'https://your-domain.com';
```

## Support

### Documentation
- `README.md` - Main setup instructions
- `DEPLOYMENT.md` - Complete deployment guide
- `mobile/README.md` - Mobile-specific documentation

### Common Issues
1. **Metro bundler fails**: `npx react-native start --reset-cache`
2. **Android build fails**: `cd android && ./gradlew clean`
3. **iOS build fails**: `cd ios && pod install`
4. **API connection issues**: Check backend server and network configuration

### Getting Help
- Check the troubleshooting sections in documentation
- Ensure all prerequisites are installed
- Verify environment variables are set correctly
- Test backend server separately before running mobile app

## License
MIT License - Feel free to modify and distribute as needed.

---

**Ready to launch your peer-to-peer challenge platform!** 🚀

This package contains everything needed to run Face Off locally, deploy to production servers, and submit to app stores. Follow the documentation step-by-step for a smooth deployment experience.