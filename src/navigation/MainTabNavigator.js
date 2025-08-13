import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TrackingHubScreen from '../screens/TrackingHubScreen';
import StatsScreen from '../screens/StatsScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const iconMap = {
    Home: 'home',
    Track: 'fitness',
    Stats: 'stats-chart',
    Profile: 'person',
  };
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };
        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
            <Icon
              name={iconMap[route.name]}
              size={24}
              color={isFocused ? colors.primary : colors.textSecondary}
            />
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Floating Action Button component
const QuickLogFAB = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('Track')}
      activeOpacity={0.9}
    >
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.fabGradient}>
        <Icon name="add" size={28} color={colors.textWhite} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const FabOverlay = () => {
  const navigation = useNavigation();
  return <QuickLogFAB navigation={navigation} />;
};

const MainTabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Track" component={TrackingHubScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Profile" component={AccountScreen} />
      </Tab.Navigator>
      <FabOverlay />
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
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    ...shadows.lg,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainTabNavigator;