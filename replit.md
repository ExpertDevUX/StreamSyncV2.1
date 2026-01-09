# ConnectNow (StreamSync)

## Overview

StreamSync is a real-time video conferencing application built with Next.js. It enables users to create and join video meeting rooms with features including HD video calls, screen sharing, live chat, password-protected rooms, and live captions. The app uses WebRTC for peer-to-peer video communication and includes a companion Chrome extension for quick meeting access.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14+ with App Router
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **State Management**: React hooks and local state
- **Animations**: Framer Motion for UI animations
- **Real-time Communication**: WebRTC for peer-to-peer video/audio streaming

### Key Application Features
- **Video Rooms**: Dynamic room creation with unique slugs, password protection optional
- **Chat System**: Real-time messaging within rooms with emoji support and message translation
- **Screen Sharing**: Browser-based screen capture and sharing
- **Live Captions**: Web Speech API integration for real-time speech-to-text
- **Theme System**: Light, dark, and system theme modes via next-themes

### Backend Architecture
- **API Routes**: Next.js API routes for server-side logic
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Database Connection**: `server/db.ts` manages PostgreSQL connection pool

### Database Schema
Three main tables:
- **rooms**: Stores meeting room data (id, roomId, name, password, createdAt)
- **messages**: Chat messages per room (id, roomId, username, content, timestamp)
- **callHistory**: Meeting history tracking (id, roomId, username, duration, startTime, endTime)

### Chrome Extension
Located in `chrome-extension/` directory with:
- Background service worker for notifications
- Content scripts for page integration
- Popup interface for quick meeting access

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via DATABASE_URL environment variable)
- **Drizzle ORM**: Database toolkit for type-safe queries

### Third-Party Services
- **Vercel**: Deployment platform with analytics integration (@vercel/analytics)
- **Neon Database**: Serverless PostgreSQL (@neondatabase/serverless) as a database option

### Key NPM Packages
- **@radix-ui/\***: Accessible UI primitives for components
- **next-themes**: Theme management
- **framer-motion**: Animation library
- **zod**: Schema validation
- **drizzle-zod**: Drizzle-to-Zod schema generation

### Browser APIs Used
- **WebRTC**: Peer-to-peer video/audio streaming
- **Web Speech API**: Speech recognition for live captions
- **MediaDevices API**: Camera and microphone access
- **Screen Capture API**: Screen sharing functionality