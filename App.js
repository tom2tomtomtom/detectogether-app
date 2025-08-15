import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MainStack from './src/navigation/MainTabNavigator';
import { useStore } from './src/store/useStore';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { View, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/services/NotificationService';

export default function App() {
  const initializeApp = useStore((state) => state.initializeApp);
  const onboardingComplete = useStore((state) => state.user?.onboardingComplete || false);
  const navRef = useRef(null);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    (async () => {
      if (onboardingComplete) {
        try {
          await registerForPushNotificationsAsync();
        } catch (error) {
          console.log('Notification registration error:', error);
        }
      }
    })();

    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      // Could navigate based on response.notification.request.content.data
      // Placeholder: no-op for now
    });
    return () => sub.remove();
  }, [onboardingComplete]);

  // Update pet health when app returns to foreground
  const updatePetHealthOnFocus = useStore((s) => s.updatePetHealthOnFocus);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') updatePetHealthOnFocus();
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navRef}>
        <StatusBar style="auto" />
        {/* Skip onboarding entirely - tutorial cards will show on home screen for new users */}
        <MainStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}