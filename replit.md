# Quran Study Application - Replit Migration

## Project Overview
A comprehensive Quran study application with advanced features including:
- Interactive Surah browser with 114 Surahs and complete metadata
- Audio playback system for Quran recitations
- RSS feed integration for recent content
- Customizable background themes with upload capability
- Advanced filtering system (by type, length, themes, usage)
- Favorites and completion tracking
- Modern UI with Tailwind CSS and Radix UI components

## Recent Changes
- **Migration from Lovable to Replit (January 2025)**
  - Replaced react-router-dom with wouter for routing compatibility
  - Fixed TypeScript type issues across components
  - Installed missing dependencies (react-router-dom, sonner)
  - Maintained all existing functionality during migration
  - Application successfully running on Replit platform

## Project Architecture
- **Frontend**: React with TypeScript, Vite build system
- **Backend**: Express.js server with in-memory storage
- **Routing**: Wouter (lightweight React router)
- **UI Framework**: Tailwind CSS + Radix UI (shadcn/ui components)
- **State Management**: React hooks (useState, useRef)
- **Data Fetching**: TanStack Query
- **Build System**: Vite with Express middleware

## Key Components
- `Index.tsx`: Main application component with Surah browser and audio player
- `NotFound.tsx`: 404 error page
- `useRSSFeed.ts`: Custom hook for RSS feed parsing
- Background management system with custom upload capability
- Filter and search functionality for Surahs

## User Preferences
- Modern, clean interface preferred
- Comprehensive feature set for Islamic study
- Audio integration capabilities
- RSS feed support for latest content

## Development Setup
- Node.js 20 with Express server on port 5000
- Vite development server with HMR
- TypeScript configuration for type safety
- Package management via npm

## Security & Performance
- Client-server separation maintained
- CORS proxy for RSS feeds
- In-memory storage for development
- Responsive design for all devices