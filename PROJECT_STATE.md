# Project State - DetecTogether App

## Current Project
- Name: DetecTogether App
- Type: React Native Mobile App (Expo) with web-ready scaffolding
- Size: ~5,000+ lines
- Status: Core Features Complete (Phase 1 Done!)

## Tech Stack
- Frontend: React Native with Expo
- State Management: Zustand
- Navigation: React Navigation (Bottom Tabs)
- UI Components: Custom components with React Native Vector Icons
- Styling: StyleSheet API
- Storage: AsyncStorage for persistence
- Animations: React Native Reanimated 2 (PetCharacter integrated)

## Recent Sessions
- Session 1: Project initialization and structure setup
- Session 2: Core navigation and screens created
- Session 3: Vista component and Fluid Flow module implemented
- Session 4: Completed ALL 5 health modules + enhanced home dashboard
- Session 5: PetCharacter animations integrated into Vista
- Session 6: Onboarding flow with pet selection + naming
- Session 7: Achievements system (badges, screen, store)
- Session 8: Expo notifications (service, settings, smart scheduling)
- Last Updated: 2025-08-13

## Progress Tracking
- [x] Project setup
- [x] Basic structure
- [x] Navigation system
- [x] Vista component
- [x] Home screen (Enhanced with dashboard)
- [x] Fluid Flow & Balance screen
- [x] Vitality Compass screen
- [x] Gut Intelligence screen
- [x] Mind's Radar screen
- [x] Dermal Map screen
- [x] Account screen (Basic version)
- [x] Onboarding flow
- [x] Pet selection and animation (baseline: emojis + reanimated states)
- [x] Push notifications (Expo) with settings
- [x] Achievement system (badges, progress, notifications)
- [ ] Photo capture/analysis
- [ ] Backend API integration
- [ ] Testing
- [ ] Deployment

## Current Features Implemented
1. **Navigation**: 8-tab bottom navigation with icons (includes Achievements, Notifications)
2. **Vista System**: Dynamic gradient backgrounds that change based on health status
3. **State Management**: Zustand store with user, pet, health logs, achievements, notifications
4. **All Health Modules Complete**:
   - Fluid Flow & Balance (hydration tracking)
   - Vitality Compass (energy & caffeine)
   - Gut Intelligence (gut health & meals)
   - Mind's Radar (stress & mood)
   - Dermal Map (skin observations)
5. **Home Dashboard**: 
   - Health snapshot from all modules
   - Quick action buttons
   - Daily goal tracking
   - Recent activity feed
   - Needs attention alerts
   - Achievement toast modal
6. **Pet System**: `PetCharacter` with reanimated states (happy/normal/sad/critical/celebrating) integrated in `Vista`
7. **Onboarding**: Welcome, benefits, pet selection carousel, name pet, gating in `App.js`
8. **Achievements**: Definitions, badge UI, progress + unlocks, points, Achievements screen
9. **Notifications**: Expo service, smart scheduling, settings screen, morning/hydration/streak/achievement types
10. **Data Persistence**: AsyncStorage integration

## Next Steps
1. Refine notifications
   - Module-specific reminders tied to in-module toggles
   - Deeper response handling (deep link to target module)
   - Improve smart scheduling windows
2. Trends & charts
   - 7/30-day views per module, streak visualizations
3. Camera & media (Phase 3)
   - Skin and meal photos; local storage and simple galleries
4. Backend sync (Phase 4)
   - Auth + cloud sync (Supabase/Firebase), push token storage
5. Pet & UX polish
   - More pet moods (sleeping/idle), richer visuals than emojis
   - Unify Notification Settings under Account stack
6. Testing & analytics
   - Unit/integration/E2E; Sentry + analytics

## 🎯 PHASE 2: Pet & Gamification (Current Focus)

### Step 1: Pet Animation System (2-3 hours)
**Tool**: Cursor
**Command**: "Add pet animations using React Native Reanimated 2"
- [x] Create PetCharacter.js component
- [x] Add 5 pet types (dog, cat, bird, bunny, dragon)
- [x] Implement mood-based animations:
  - Happy: bounce/wiggle
  - Normal: gentle float
  - Sad: droop/shrink
  - Critical: shrink/fade
  - Celebrating: spin
- [x] Connect animations to health score
- [x] Add pet selection to store
- [ ] Add sleeping/idle variants and richer art

### Step 2: Onboarding Flow (2 hours)
**Tool**: Cursor
**Command**: "Create onboarding screens with pet selection"
- [x] Welcome screen with app benefits
- [x] Pet selection carousel
- [x] Name your pet screen
- [x] Notification permissions (requested after onboarding)
- [ ] Quick tutorial (5 swipeable cards)
- [ ] Set initial health baseline

### Step 3: Achievement System (2 hours)
**Tool**: Cursor
**Command**: "Build achievement/badge system"
- [x] Create achievements data structure
- [x] Badge components (locked/unlocked states)
- [x] Achievement categories (Streaks, Mastery, Balance, Explorer, Special)
- [x] Achievement notifications
- [x] Progress tracking in store

### Step 4: Push Notifications (1-2 hours)
**Tool**: Cursor + Expo docs
**Command**: "Set up Expo push notifications"
- [x] Install expo-notifications
- [x] Create notification service
- [x] Implement notification types:
  - Morning check-in (8am)
  - Hydration reminders (every 2 hours)
  - Module-specific (based on settings)
  - Streak maintenance
  - Achievement unlocked
- [x] Smart scheduling based on user patterns
- [x] Notification preferences screen

## 🎯 PHASE 3: Advanced Features

### Step 5: Camera Integration (2 hours)
**Tool**: Cursor
**Command**: "Add camera for skin/food photos"
- [ ] Install expo-camera
- [ ] Create CameraScreen component
- [ ] Add photo capture to:
  - Dermal Map (skin photos)
  - Gut Intelligence (meal photos)
- [ ] Store photos locally
- [ ] Photo gallery in each module
- [ ] Basic ML-ready structure (for future)

### Step 6: Social Features Prep (2 hours)
**Tool**: Cursor
**Command**: "Build social challenge infrastructure"
- [ ] Challenge data structure
- [ ] Friend system (local for now)
- [ ] Weekly challenges UI
- [ ] Leaderboard component
- [ ] Share achievement cards
- [ ] Privacy settings

### Step 7: Data Visualization (2 hours)
**Tool**: Cursor
**Command**: "Add health trends visualization"
- [ ] Install victory-native charts
- [ ] Weekly trends for each module
- [ ] Monthly overview dashboard
- [ ] Correlation insights
- [ ] Export data feature

## 🎯 PHASE 4: Backend & Deployment

### Step 8: Backend API (4-6 hours)
**Tool**: Augment (if needed) or stay in Cursor
**Options**:
1. **Supabase** (Recommended - easiest)
   - Auth, database, real-time sync
   - 500MB free tier perfect for MVP
2. **Firebase**
   - Similar features, Google ecosystem
3. **Custom Node.js + PostgreSQL**
   - More control, more work

**Features**:
- [ ] User authentication
- [ ] Data sync across devices
- [ ] Social features backend
- [ ] Push notification management
- [ ] Photo storage

### Step 9: Testing & Polish (2-3 hours)
**Tool**: Claude Code
- [ ] Unit tests for critical functions
- [ ] Integration tests for user flows
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Final UI polish

### Step 10: Deployment (2-3 hours)
**Tool**: Expo + EAS Build
- [ ] App Store assets (screenshots, description)
- [ ] Privacy policy & terms
- [ ] TestFlight beta testing
- [ ] Play Store internal testing
- [ ] Production deployment

## 📊 Time Estimate
- **Phase 2**: 6-8 hours (Pet & Gamification)
- **Phase 3**: 6-8 hours (Advanced Features)
- **Phase 4**: 8-14 hours (Backend & Deployment)
- **Total**: 20-30 hours to production

## 🚀 Quick Win Order (If Limited Time)
1. Pet polish (sleeping/idle + art)
2. Notifications refinements (engagement)
3. Achievements deepening (retention)
4. Backend Sync (critical for launch)
5. Trends/charts

## 💡 Development Tips
- Test on real devices early
- Use Expo Go for rapid testing
- Keep animations under 60fps
- Batch state updates for performance
- Use React.memo for heavy components

## Known Issues
- Pet visuals are emoji placeholders; richer art desired
- Notification Settings temporarily exposed as a tab (to move under Account stack)
- Camera functionality not implemented - PHASE 3
- No backend connection - PHASE 4
- Trends/visualizations pending - PHASE 3

## File Structure
```
detectogether-app/
├── App.js
├── src/
│   ├── components/
│   │   ├── Vista.js
│   │   ├── PetCharacter.js
│   │   ├── AchievementBadge.js
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── Modal.js
│   ├── navigation/
│   │   └── MainTabNavigator.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── FluidFlowScreen.js
│   │   ├── VitalityScreen.js
│   │   ├── GutScreen.js
│   │   ├── MindRadarScreen.js
│   │   ├── DermalMapScreen.js
│   │   ├── AchievementsScreen.js
│   │   ├── NotificationSettingsScreen.js
│   │   └── OnboardingScreen.js
│   ├── services/
│   │   └── NotificationService.js
│   ├── store/
│   │   └── useStore.js
│   ├── styles/
│   │   └── theme.js
│   └── utils/
│       └── achievements.js
└── package.json
```

## Development Notes
- The app follows the specification document closely
- Vista system is implemented as a reusable component
- Each health module follows a consistent structure
- Gamification and notifications are integrated in the store
- Ready for UI polish, charts, and animation enhancements