import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { useStore } from './src/store/useStore';

export default function App() {
  const initializeApp = useStore((state) => state.initializeApp);

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}