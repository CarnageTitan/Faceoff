# Face Off - Peer-to-Peer Challenge Platform

## Overview

Face Off is a completely free skill-based peer-to-peer challenge tracking platform that allows users to create and participate in friendly competitions across various categories. Users can challenge each other, earn achievements, form leagues, and manage friendships within the platform. The application combines React frontend with Express backend, using PostgreSQL for data persistence and AI-powered challenge description generation using Google Gemini API.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Custom components built with Radix UI primitives and Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Passport.js with local strategy using scrypt for password hashing
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API for challenge description generation
- **Development**: TSX for TypeScript execution

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Provider**: Neon Database (@neondatabase/serverless)
- **Migration**: Drizzle Kit for schema management
- **Session Store**: PostgreSQL-based session storage using connect-pg-simple

## Key Components

### Authentication System
- Local authentication strategy using username/password
- Secure password hashing with Node.js crypto scrypt
- Session-based authentication with PostgreSQL session store
- Protected routes enforcing authentication requirements

### Challenge Management
- Create challenges across multiple categories (sports, gaming, fitness, casual, education, food, social)
- AI-powered challenge description generation with OpenAI integration
- Challenge lifecycle: open → accepted → completed
- Token-based wagering system with automatic distribution

### User Management
- User profiles with tokens, wins, and losses tracking
- Achievement system for milestone recognition
- Friend system with pending/accepted status management
- User statistics and leaderboard functionality

### League System
- Create and join competitive leagues
- League member management
- Separate league statistics and challenges

### Data Models
- **Users**: Profile data, tokens, win/loss records
- **Challenges**: Challenge details, status tracking, participant management
- **Achievements**: User milestone tracking
- **Friendships**: Social connection management
- **Leagues**: Group competition management

## Data Flow

### Challenge Creation Flow
1. User fills challenge form with title, description, type, and token stake
2. Optional AI description generation via OpenAI API
3. Challenge stored in database with "open" status
4. Challenge appears in public feed for other users

### Challenge Acceptance Flow
1. User views open challenges and selects one to accept
2. System validates user has sufficient tokens
3. Challenge status updated to "accepted"
4. Both participants can track challenge progress

### Challenge Completion Flow
1. Challenge participants report outcomes
2. System validates completion and determines winner
3. Tokens transferred from loser to winner
4. User statistics updated (wins/losses)
5. Achievement checks performed

### Authentication Flow
1. User submits credentials via login form
2. Passport.js validates against database
3. Session created and stored in PostgreSQL
4. User redirected to protected application areas

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL via Neon Database
- **AI Service**: OpenAI API for description generation
- **UI Library**: Radix UI primitives for accessible components
- **Form Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full TypeScript support across frontend and backend
- **CSS Framework**: Tailwind CSS with PostCSS processing

### Optional Services
- OpenAI API key (falls back to predefined templates if unavailable)
- Environment-specific session secrets

## Deployment Strategy

### Platform
- **Target**: Google Cloud Run (configured in .replit)
- **Port Configuration**: Internal port 5000, external port 80
- **Build Process**: Vite build for frontend, esbuild for backend bundling

### Environment Setup
- Node.js 20 runtime environment
- PostgreSQL database provisioning required
- Environment variables for database URL and API keys
- Session secret configuration for production security

### Development Workflow
- Hot reload development server via Vite
- Database schema management via Drizzle migrations
- TypeScript compilation checking
- Integrated development environment in Replit

## Changelog

- August 13, 2025: Complete shop system removal and application simplification
  - Removed entire shop system per user request for completely free platform
  - Cleaned up database schema removing items, inventory, and shop-related tables
  - Simplified avatar system to use basic appearance options without purchasable items
  - Removed all shop routes, components, and navigation references
  - Updated storage interface removing all shop/inventory/item management methods
  - Fixed all LSP errors and cleaned up codebase for better maintainability
  - Maintained AI-powered challenge system with Google Gemini API integration
  - Preserved core features: challenges, friends, leagues, leaderboards, and trophies
- August 12, 2025: Enhanced AI-powered challenge system with friend selection implemented
  - Switched to free Google Gemini API for transforming user descriptions into detailed challenges
  - Enhanced database schema with AI-generated fields (originalPrompt, rules, scoringSystem, maxParticipants)
  - Built comprehensive friend selection interface for both single (1 friend) and multiplayer (3-20 participants) challenges
  - Created dual challenge creation system: AI-enhanced challenges with generated rules/scoring and standard challenges
  - Implemented smart selection limits and graceful fallback when AI API is unavailable
  - Updated challenge creation UI with enhanced friend invitation system and multiplayer support
  - Fixed authentication issues and created working test accounts (demo/demo123, testuser/test123)
- August 10, 2025: Complete friend invitation system implemented
  - Added friend selection UI to challenge creation with smart limits (1 for head-to-head, multiple for multiplayer)
  - Implemented challenge card invitation functionality for existing open challenges  
  - Created comprehensive backend invitation processing with automatic notification sending
  - Built challenge invitation management system with accept/decline functionality
  - Added real-time invitation notifications on home page with participant tracking
  - Cleaned up unused files and created optimized download package (14MB tar.gz)
  - Fixed challenge minimum requirements (2 people minimum, multiplayer 3-20 participants)
  - Integrated invitation system with existing friend management and league functionality
- January 24, 2025: Enhanced PWA with shop improvements and friend system
  - Replaced shop items with realistic golden nametags and premium clothing/accessories with product images
  - Implemented real player search functionality for finding and adding friends
  - Made app PWA-capable with manifest.json, service worker, and mobile optimization
  - Added comprehensive player discovery with enhanced friend request system
  - Updated shop categories: nametags (bronze/silver/platinum/golden), designer clothing, luxury accessories
  - Fixed authentication session management for better user experience
- June 26, 2025: Complete React Native mobile app package created
  - Finalized React Native app for iOS App Store and Google Play Store
  - Created comprehensive download package with all necessary files
  - Added complete deployment documentation for app store submission
  - Configured production build settings for both Android and iOS
  - Added environment configuration and hosting setup guides
  - Integrated purple Face Off logo branding throughout app
  - Created optimized ZIP download package (complete.zip, 21MB with 445 files)
  - Updated web app navigation with custom logo component
  - Separated documentation into DOCUMENTATION_PACKAGE.md for easy reference
- June 25, 2025: React Native mobile app conversion completed
  - Created complete React Native project structure
  - Implemented mobile-specific UI components and navigation
  - Added authentication context and API integration
  - Built main screens: Home, Create Challenge, My Challenges, Profile
  - Configured Android build system and development setup
  - Added comprehensive setup documentation
- June 25, 2025: Initial web application setup

## User Preferences

Preferred communication style: Simple, everyday language.