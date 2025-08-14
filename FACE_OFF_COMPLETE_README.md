# Face Off - Complete Challenge Platform

## Overview
Face Off is a complete peer-to-peer challenge tracking platform with social features, friend invitations, leagues, and comprehensive challenge management.

## Key Features Implemented

### Challenge System
- **Minimum 2 Participants**: Every challenge requires at least 2 people (creator + invitees)
- **Head-to-Head Challenges**: Regular challenges allow inviting 1 friend for competition
- **Multiplayer Challenges**: Support for 3-20 participant challenges
- **Challenge Invitations**: Complete invitation system with accept/decline functionality
- **Real-time Notifications**: Toast notifications and invitation management

### Friend Invitation System
- **Create Challenge Invitations**: Select friends during challenge creation
- **Challenge Screen Invitations**: Invite users directly from existing challenge cards
- **Smart Selection Limits**: Single challenges = 1 friend, multiplayer = multiple friends
- **Invitation Tracking**: Full backend storage and notification system

### Social Features
- **Friend System**: Add and manage friends with pending/accepted status
- **Player Discovery**: Search and find other players to add as friends
- **League System**: Create and join competitive leagues with member management
- **Profile Management**: Complete user profiles with stats and achievements

### Technical Implementation
- **Frontend**: React with TypeScript, Tailwind CSS, Radix UI components
- **Backend**: Express.js with TypeScript, session-based authentication
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **State Management**: TanStack Query for server state and caching
- **Form Handling**: React Hook Form with Zod validation

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment**
   - Copy `.env.example` to `.env`
   - Configure database connection string
   - Add any required API keys (optional)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Open http://localhost:5000
   - Create an account or use sample users:
     - Username: `Ashlall`, Password: `password`
     - Username: `SportsFanatic`, Password: `password`

## Core Workflows

### Creating Challenges with Friend Invitations
1. Navigate to "Create Challenge" page
2. Fill in challenge details (title, description, type)
3. Toggle "Multiplayer" for 3+ participants (optional)
4. Select friends from the "Invite Friends" section
5. Submit to create challenge and send invitations automatically

### Managing Challenge Invitations
1. View pending invitations on the home page
2. Accept or decline invitations with full participant tracking
3. Invite additional users from challenge cards for open challenges
4. Track all participants and invitation status

### Friend Management
1. Search for players in the Profile section
2. Send friend requests to other users
3. Accept/decline incoming friend requests
4. View friends list for challenge invitations

## File Structure
```
client/src/
├── components/
│   ├── challenge-card.tsx         # Challenge display with invite functionality
│   ├── challenge-invitations.tsx  # Invitation notifications component  
│   ├── challenge-invite.tsx       # Friend selection and invitation UI
│   └── navigation.tsx             # Main navigation component
├── pages/
│   ├── create-challenge.tsx       # Challenge creation with friend selection
│   ├── home-page.tsx             # Main dashboard with invitations
│   ├── profile.tsx               # User profile and friend management
│   └── leagues.tsx               # League management and joining
server/
├── routes.ts                     # API routes with invitation endpoints
├── storage.ts                    # Database operations and invitation logic
└── index.ts                      # Server setup and configuration
shared/
└── schema.ts                     # Database schema with invitation tables
```

## Database Schema
- **users**: User profiles and statistics
- **challenges**: Challenge information and status
- **challenge_invitations**: Invitation tracking with status
- **challenge_participants**: Multiplayer participant management
- **friendships**: Friend relationships and requests
- **leagues**: League management and membership

## Recent Updates (Latest)
- ✅ Complete friend invitation system during challenge creation
- ✅ Challenge card invitation functionality for existing challenges
- ✅ Backend invitation processing and notification storage
- ✅ Smart invitation limits (1 for head-to-head, multiple for multiplayer)
- ✅ Real-time invitation management with accept/decline functionality
- ✅ Comprehensive challenge participant tracking
- ✅ Integration with existing friend and league systems

## Deployment Ready
The application is fully configured for deployment with:
- Production build scripts
- Environment variable configuration
- Database migration system
- Static asset optimization
- PWA capabilities for mobile installation

## Support
For questions or issues, refer to the replit.md file for technical architecture details and implementation notes.