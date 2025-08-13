import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MainStack from './src/navigation/MainTabNavigator';
import { useStore } from './src/store/useStore';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { View } from 'react-native';
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

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navRef}>
        <StatusBar style="auto" />
        {onboardingComplete ? (
          <MainStack />
        ) : (
          <OnboardingScreen />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}