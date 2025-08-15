# Production Deployment Notes

## 🚨 Critical Demo vs Production Differences

### Current State: DEMO OPTIMIZED
The app is currently configured for client demonstrations with aggressive settings for immediate visual feedback.

## 🔥 URGENT Changes Required for Production

### 1. Health Decay System
**File:** `src/store/useStore.js` - `updatePetHealthOnFocus()` function

#### Current Demo Settings:
```javascript
// HomeScreen.js - Line 36-44
const interval = setInterval(() => {
  updatePetHealthOnFocus();
}, 10000); // 10 seconds - DEMO ONLY

// useStore.js - Line 185-186
if (minutesSinceReset > 0.5) { // 30 seconds grace - DEMO ONLY
  const naturalDecay = Math.min(70, Math.floor(minutesSinceReset * 2)); // 2% per minute - DEMO ONLY
```

#### Required Production Settings:
```javascript
// HomeScreen.js
const interval = setInterval(() => {
  updatePetHealthOnFocus();
}, 3600000); // 1 hour - PRODUCTION

// useStore.js
if (minutesSinceReset > 1440) { // 24 hours grace - PRODUCTION
  const naturalDecay = Math.min(50, Math.floor((minutesSinceReset - 1440) / 1440 * 2)); // 2% per day - PRODUCTION
```

### 2. App Configuration Variables
**Create:** `src/config/environment.js`

```javascript
const isDemoMode = __DEV__ && process.env.DEMO_MODE === 'true';

export const CONFIG = {
  HEALTH_UPDATE_INTERVAL: isDemoMode ? 10000 : 3600000, // 10s vs 1hr
  DECAY_RATE_PER_MINUTE: isDemoMode ? 2 : 0.0014, // 2% vs 0.0014% (2% per day)
  GRACE_PERIOD_MINUTES: isDemoMode ? 0.5 : 1440, // 30s vs 24hr
  MAX_DECAY_PERCENT: isDemoMode ? 70 : 50,
  RECENT_ACTIVITY_BOOST: 5, // Same for both
  RECENT_ACTIVITY_WINDOW_HOURS: 2 // Same for both
};
```

### 3. Tutorial System
**File:** `App.js` and `src/screens/HomeScreen.js`

#### Current: Tutorial Overlay Only
- No onboarding flow
- Tutorial cards show on home screen

#### Production: Full Onboarding Flow
- Pet selection screen
- Name input
- Health module introduction
- Tutorial completion before main app

### 4. Backend Integration Required

#### Current: Local Only
```javascript
// All data stored in AsyncStorage
const userData = await AsyncStorage.getItem('userData');
```

#### Production: Cloud Sync
```javascript
// Add backend services
import { syncUserData, backupHealthLogs } from '../services/backend';

// Implement data synchronization
await syncUserData(userData);
await backupHealthLogs(healthLogs);
```

## 📱 App Store Preparation

### 1. App.json Updates
```json
{
  "expo": {
    "name": "DetecTogether",
    "slug": "detectogether-health",
    "version": "1.0.0",
    "privacy": "public",
    "ios": {
      "bundleIdentifier": "com.detectogether.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.detectogether.app",
      "versionCode": 1
    }
  }
}
```

### 2. Privacy Policy Requirements
**Create:** Legal documentation
- Health data usage disclosure
- Photo storage and processing
- Third-party service integration
- Data retention policies

### 3. Medical Disclaimers
**Add to:** App startup and health modules
```javascript
const MEDICAL_DISCLAIMER = `
DetecTogether is not a medical device and is not intended to diagnose, 
treat, cure, or prevent any disease. Always consult with healthcare 
professionals for medical advice.
`;
```

## 🔧 Technical Optimizations

### 1. Performance
```javascript
// Current: Aggressive updates for demo
// Production: Battery-optimized background processing

// Add background task management
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
```

### 2. Analytics
```javascript
// Add user behavior tracking
import { Analytics } from 'expo-analytics';

// Track key metrics
Analytics.track('health_log_added', { module: 'hydration' });
Analytics.track('pet_accessory_purchased', { item: 'crown' });
```

### 3. Error Reporting
```javascript
// Add crash reporting
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});
```

## 🎯 Environment Configuration

### Development Setup
```bash
# .env.development
DEMO_MODE=true
DECAY_INTERVAL=10000
API_URL=http://localhost:3000

# .env.production  
DEMO_MODE=false
DECAY_INTERVAL=3600000
API_URL=https://api.detectogether.com
```

### Build Commands
```bash
# Demo build (current)
DEMO_MODE=true expo build:ios

# Production build
DEMO_MODE=false expo build:ios --release-channel production
```

## 📊 Monitoring & Analytics

### Production Metrics to Track
- Daily active users
- Health logging frequency
- Pet interaction rates
- Module usage patterns
- App performance metrics
- Crash rates
- User retention

### Health Data Insights
- Average health scores
- Most used modules
- Time between logs
- Correlation patterns
- User engagement trends

## 🔒 Security Considerations

### Health Data Protection
- Encrypt sensitive health photos
- Implement secure cloud storage
- Add data export functionality
- Ensure HIPAA compliance considerations
- Implement secure user authentication

### Privacy Features
- Photo auto-deletion options
- Data anonymization
- Opt-out mechanisms
- Clear consent flows

## 🚀 Deployment Checklist

### Pre-Production
- [ ] Update decay intervals to production values
- [ ] Implement full onboarding flow
- [ ] Add backend API integration
- [ ] Include medical disclaimers
- [ ] Add crash reporting and analytics
- [ ] Implement privacy policy screens
- [ ] Add environment configuration
- [ ] Performance testing and optimization

### App Store Submission
- [ ] Complete app.json configuration
- [ ] Generate app icons and screenshots
- [ ] Write app store descriptions
- [ ] Submit privacy policy
- [ ] Complete Apple/Google developer requirements
- [ ] Beta testing with TestFlight/Play Console

### Post-Launch
- [ ] Monitor crash reports
- [ ] Track user engagement metrics
- [ ] Collect user feedback
- [ ] Plan feature updates
- [ ] Maintain backend infrastructure

---

**⚠️ IMPORTANT:** The current demo configuration will drain device batteries and overwhelm users in production. The health decay system MUST be adjusted before any public release.
