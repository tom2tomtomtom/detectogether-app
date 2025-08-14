import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '../styles/theme';
import { useNavigation, getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import TrackingHubScreen from '../screens/TrackingHubScreen';
import StatsScreen from '../screens/StatsScreen';
import AccountScreen from '../screens/AccountScreen';
import FluidFlowScreen from '../screens/FluidFlowScreen';
import VitalityScreen from '../screens/VitalityScreen';
import GutScreen from '../screens/GutScreen';
import MindRadarScreen from '../screens/MindRadarScreen';
import DermalMapScreen from '../screens/DermalMapScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import PetStoreScreen from '../screens/PetStoreScreen';
import MissionsScreen from '../screens/MissionsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const TrackStack = createStackNavigator();
const StatsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const iconMap = { Home: 'home', Track: 'fitness', Stats: 'stats-chart', Profile: 'person' };
  const onLongPressTrack = () => descriptors[state.routes[1].key]?.navigation?.navigate('Track');
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => !isFocused && navigation.navigate(route.name);
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            onLongPress={route.name === 'Track' ? onLongPressTrack : undefined}
            style={styles.tab}
          >
            <Icon name={iconMap[route.name]} size={24} color={isFocused ? colors.primary : colors.textSecondary} />
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// FAB
const QuickLogFAB = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Track')} activeOpacity={0.9}>
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.fabGradient}>
        <Icon name="add" size={28} color={colors.textWhite} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Stacks
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
  </HomeStack.Navigator>
);

const TrackStackScreen = () => (
  <TrackStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.background, elevation: 0, shadowOpacity: 0 },
      headerTintColor: colors.primary,
      headerTitleStyle: { fontWeight: '600' },
    }}
  >
    <TrackStack.Screen name="TrackingHub" component={TrackingHubScreen} options={{ headerShown: false }} />
    <TrackStack.Screen name="FluidFlow" component={FluidFlowScreen} options={{ title: 'Fluid Flow & Balance' }} />
    <TrackStack.Screen name="Vitality" component={VitalityScreen} options={{ title: 'Vitality Compass' }} />
    <TrackStack.Screen name="Gut" component={GutScreen} options={{ title: 'Gut Intelligence' }} />
    <TrackStack.Screen name="MindRadar" component={MindRadarScreen} options={{ title: "Mind's Radar" }} />
    <TrackStack.Screen name="DermalMap" component={DermalMapScreen} options={{ title: 'Dermal Map' }} />
  </TrackStack.Navigator>
);

const StatsStackScreen = () => (
  <StatsStack.Navigator screenOptions={{ headerShown: false }}>
    <StatsStack.Screen name="StatsScreen" component={StatsScreen} />
    <StatsStack.Screen name="Achievements" component={AchievementsScreen} options={{ headerShown: true, title: 'Achievements' }} />
    <StatsStack.Screen name="Missions" component={MissionsScreen} options={{ headerShown: true, title: 'Weekly Missions' }} />
  </StatsStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileScreen" component={AccountScreen} />
    <ProfileStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ headerShown: true, title: 'Notification Settings' }} />
    <ProfileStack.Screen name="PetStore" component={PetStoreScreen} options={{ headerShown: true, title: 'Pet Store' }} />
  </ProfileStack.Navigator>
);

// Tabs persistent
const MainTabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Track" component={TrackStackScreen} />
        <Tab.Screen name="Stats" component={StatsStackScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
      <QuickLogFAB />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingBottom: 34,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.md,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  activeIndicator: { position: 'absolute', bottom: -12, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary },
  fab: { position: 'absolute', bottom: 80, alignSelf: 'center', ...shadows.lg },
  fabGradient: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});

export default MainTabNavigator;