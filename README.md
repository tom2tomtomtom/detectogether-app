# DetecTogether App

A gamified health tracking app that uses behavioral science to help users build self-awareness around their bodies through a virtual pet companion.

## Overview

DetecTogether transforms health tracking into an emotionally rewarding experience by linking user health habits to the well-being of a virtual pet. Every health action you log helps your pet thrive in their evolving world.

## Features

### 🎮 Gamification System
- **Virtual Pet Companion**: Choose a dog or cat that responds to your health habits
- **Dynamic Vista**: Visual feedback system at the top of each screen
- **Care Credits**: Points earned for healthy behaviors
- **Pet Evolution**: Your pet's world grows as you maintain healthy habits
- **Community Features**: See neighborhood pets and participate in group challenges

### 📱 Health Modules

1. **Fluid Flow & Balance** 
   - Track hydration intake
   - Monitor urine color for health signals
   - Visual garden that responds to hydration levels

2. **Vitality Compass**
   - Energy level tracking
   - Caffeine intake monitoring
   - Energy pattern insights

3. **Gut Intelligence**
   - Digestive health logging
   - Pattern recognition
   - Dietary correlation tracking

4. **Mind's Radar**
   - Headache tracking
   - Eye strain monitoring
   - Screen time awareness

5. **Dermal Map**
   - Seasonal skin check reminders
   - Visual mapping of skin changes
   - Photo documentation (with privacy features)

6. **Account Settings**
   - Personal profile management
   - Pet customization
   - Privacy controls

## Tech Stack

- **Framework**: React Native with Expo
- **State Management**: Zustand
- **Navigation**: React Navigation
- **UI/UX**: Custom components with React Native Vector Icons
- **Animations**: React Native Reanimated 2
- **Storage**: AsyncStorage for local persistence

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository
```bash
cd detectogether-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on your preferred platform
```bash
npm run ios     # For iOS
npm run android # For Android
npm run web     # For web browser
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── store/          # State management
├── styles/         # Global styles
└── utils/          # Helper functions
```

## Development Status

### ✅ Demo Complete - Client Ready
- ✅ All 5 health tracking modules fully implemented
- ✅ Tamagotchi-style pet system with natural decay
- ✅ Multi-accessory pet customization system
- ✅ Continuous blinking animations and mood states
- ✅ Real-time health module cards with dynamic data
- ✅ Demo-optimized 10-second decay intervals
- ✅ Tutorial overlay system for new users
- ✅ Fixed navigation with proper back button flow
- ✅ Pet store with credits and purchasing system
- ✅ Achievement and streak tracking
- ✅ Community neighborhood features
- ✅ Photo analysis with health warnings
- ✅ Toast notification system for health alerts

### 🎯 Demo Features
- **Immediate Visual Feedback**: Health decays every 10 seconds
- **Natural Pet Behavior**: Continuous blinking and mood changes
- **Complete Reset**: Account settings reset for multiple demos
- **Professional UI**: Clean, polished interface
- **Real Health Data**: Dynamic module summaries

### 🚀 Production Ready Features
- All core health tracking functionality
- Complete gamification system
- Photo capture and analysis
- State management with persistence
- Professional UI/UX design

## Contributing

This is a private project in active development. 

## Privacy & Health Data

DetecTogether is designed with privacy in mind:
- Health photos are automatically blurred
- Data is stored locally by default
- No health information is shared without explicit consent
- All social features are opt-in

## License

Proprietary - All rights reserved