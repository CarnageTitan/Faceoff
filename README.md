Face Off - Complete Documentation Package
Project Overview
Face Off is a peer-to-peer betting and challenge platform built as a React Native mobile application for iOS App Store and Google Play Store distribution. Users can create, accept, and settle wagers with friends using virtual tokens, featuring secure authentication, AI-assisted challenge descriptions, social features, and dispute resolution.

Package Contents
Your download package contains:

Complete React Native mobile app for iOS and Android
Express.js backend server with all APIs
Purple Face Off logo and branding integrated throughout
App store submission documentation
Automated setup scripts
Environment configuration files
Quick Start Guide
Prerequisites
Node.js 18 or higher
React Native development environment
iOS/Android development tools (Xcode/Android Studio)
Installation Steps
Extract the ZIP file to your desired location
Run chmod +x setup.sh to make setup script executable
Run ./setup.sh to install dependencies and configure the project
Follow the platform-specific setup instructions below
Mobile App Setup
Android Setup
Install Android Studio and Android SDK
Configure environment variables:
export ANDROID_HOME=/path/to/android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
Create a virtual device in Android Studio
Run npx react-native run-android from the mobile directory
iOS Setup (Mac only)
Install Xcode from the Mac App Store
Install CocoaPods: sudo gem install cocoapods
Navigate to mobile/ios and run pod install
Open mobile/ios/FaceOff.xcworkspace in Xcode
Select a simulator and click Run
Backend Server Setup
Navigate to the root directory
Install dependencies: npm install
Start the development server: npm run dev
Server will run on http://localhost:5000
Environment Configuration
Create a .env file with:

OPENAI_API_KEY=your_openai_key_here
SESSION_SECRET=your_session_secret_here
DATABASE_URL=your_database_url_here
App Store Deployment
iOS App Store Submission
Configure signing certificates in Xcode
Update version and build numbers
Create App Store Connect record
Build and upload using Xcode Archive
Submit for review
Google Play Store Submission
Generate signed APK: cd mobile/android && ./gradlew assembleRelease
Create Google Play Console account
Upload APK and configure store listing
Submit for review
Features Included
Core Features
User authentication and profiles
Challenge creation across multiple categories
Token-based wagering system
Real-time challenge tracking
Achievement system
Friend management
League competitions
AI-powered challenge descriptions
Technical Features
React Native cross-platform mobile app
Express.js REST API backend
PostgreSQL database with Drizzle ORM
Session-based authentication
OpenAI integration for AI features
Purple branding throughout
Support and Troubleshooting
Common Issues
Metro bundler fails: Clear cache with npx react-native start --reset-cache
iOS build fails: Clean build folder in Xcode (Cmd+Shift+K)
Android emulator issues: Ensure ANDROID_HOME is set correctly
Server won't start: Check that port 5000 is available
Development Credentials
Username: Ashlall
Password: password123
File Structure
face-off/
├── mobile/                 # React Native mobile app
│   ├── src/               # App source code
│   ├── android/           # Android configuration
│   ├── ios/              # iOS configuration
│   └── package.json      # Mobile dependencies
├── server/               # Express.js backend
├── client/              # Web application
├── shared/              # Shared schemas and types
├── package.json         # Main project dependencies
└── setup.sh            # Automated setup script
License and Usage
This is a complete, ready-to-deploy application package. You have full rights to modify, distribute, and monetize the application as needed.

Version Information
React Native: 0.72+
Node.js: 18+
Database: PostgreSQL
Build Date: June 26, 2025
Package Version: 1.0.0
