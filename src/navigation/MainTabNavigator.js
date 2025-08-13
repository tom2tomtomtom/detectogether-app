import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, borderRadius } from '../styles/theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import FluidFlowScreen from '../screens/FluidFlowScreen';
import VitalityScreen from '../screens/VitalityScreen';
import GutScreen from '../screens/GutScreen';
import MindRadarScreen from '../screens/MindRadarScreen';
import DermalMapScreen from '../screens/DermalMapScreen';
import AccountScreen from '../screens/AccountScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: 'home',
  FluidFlow: 'water',
  Vitality: 'flash',
  Gut: 'nutrition',
  MindRadar: 'eye',
  DermalMap: 'body',
  Achievements: 'trophy',
  Notifications: 'notifications',
  Account: 'person',
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = tabIcons[route.name] || 'help-circle';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarActiveBackgroundColor: colors.primaryLight,
        headerShown: false,
      })}
    ><Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="FluidFlow" 
        component={FluidFlowScreen}
        options={{ tabBarLabel: 'Fluid Flow' }}
      />
      <Tab.Screen 
        name="Vitality" 
        component={VitalityScreen}
        options={{ tabBarLabel: 'Vitality' }}
      />
      <Tab.Screen 
        name="Gut" 
        component={GutScreen}
        options={{ tabBarLabel: 'Gut' }}
      />
      <Tab.Screen 
        name="MindRadar" 
        component={MindRadarScreen}
        options={{ tabBarLabel: "Mind's Radar" }}
      />
      <Tab.Screen 
        name="DermalMap" 
        component={DermalMapScreen}
        options={{ tabBarLabel: 'Dermal Map' }}
      />
      <Tab.Screen 
        name="Achievements" 
        component={AchievementsScreen}
        options={{ tabBarLabel: 'Achievements' }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationSettingsScreen}
        options={{ tabBarLabel: 'Notifications' }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{ tabBarLabel: 'Account' }}
      /></Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 6,
    paddingTop: 6,
    height: 64,
  },
  tabBarItem: {
    marginHorizontal: 6,
    borderRadius: 16,
  },
  tabBarLabel: {
    fontSize: 10,
    marginBottom: 3,
  },
});

export default MainTabNavigator;