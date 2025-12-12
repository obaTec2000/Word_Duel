# Draw Your Sword - Bible Mastery Training App

## Overview
Draw Your Sword is a gamified Bible mastery training app designed to help Christians master Bible navigation with speed, accuracy, and confidence. The app replicates real-world Bible sword drill competitions while tracking user progress and providing engaging challenges.

## Target Audience
- Church youth groups
- Bible competition participants
- Sunday School teachers
- Families seeking interactive Bible study
- Individual believers wanting deeper Bible familiarity

## Current State
MVP implementation complete with core sword drill functionality.

## Features Implemented
- **Main Dashboard**: Daily verse widget, progress summary, quick action buttons
- **Training Modes**: Timed Sword Drill, Speed Mastery, Category Mastery, Marathon Mode, Practice Mode
- **Leaderboard**: Global, Church, and Friends rankings with podium display
- **Profile Screen**: Stats overview, achievements gallery, settings
- **Sword Drill Game**: Timed challenge to identify Bible book locations with haptic feedback and score tracking
- **Progress System**: XP, levels (1-60), streaks, accuracy tracking
- **Achievement Badges**: First Steps, On Fire, Dedicated, Sharp Shooter, Rising Star, Scholar
- **Data Persistence**: AsyncStorage for offline progress and drill history

## Project Architecture

### Frontend (React Native + Expo)
- `/client/` - Expo React Native application
  - `/screens/` - Screen components (HomeScreen, TrainScreen, CompeteScreen, ProfileScreen, DrillScreen)
  - `/components/` - Reusable UI components (Button, Card, ThemedText, ThemedView, etc.)
  - `/navigation/` - React Navigation setup with tab and stack navigators
  - `/constants/theme.ts` - Design system (colors, spacing, typography)
  - `/lib/bible-data.ts` - Bible books data and utility functions
  - `/lib/storage.ts` - AsyncStorage utilities for progress and settings

### Backend (Express.js)
- `/server/` - Express server for future API endpoints
  - `/routes.ts` - API route definitions
  - `/storage.ts` - Data storage interface

### Shared
- `/shared/schema.ts` - Drizzle ORM schema definitions

## Design System (Warrior Theme)
- **Primary Dark**: #2C3E50 (Midnight Blue)
- **Accent Red**: #C0392B (Crimson)
- **Gold**: #F1C40F (Excellence/Reward)
- **Success Green**: #27AE60 (Growth/Achievement)
- **Sky Blue**: #3498DB (Divine Guidance)

## Development Commands
- `npm run all:dev` - Start both Expo and Express servers
- `npm run expo:dev` - Start Expo development server only
- `npm run server:dev` - Start Express server only

## Future Enhancements (Next Phase)
- Firebase/Supabase backend integration for cloud sync
- Real-time multiplayer 1v1 battles
- Church group system with internal leaderboards
- Competition Simulation modes
- Speed Mastery Survival mode with power-ups
- Push notifications for training reminders
- Interactive learning lessons
- Spaced repetition memory verse system

## Recent Changes
- December 12, 2025: Initial MVP implementation
  - Created 4-tab navigation (Home, Train, Compete, Profile)
  - Implemented sword drill game with timed challenges
  - Added progress tracking with XP and level system
  - Created leaderboard UI with podium display
  - Added achievement badge system
  - Integrated haptic feedback for drill interactions
