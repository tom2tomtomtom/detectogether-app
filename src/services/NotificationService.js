import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useStore } from '../store/useStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Push notification permissions not granted');
        return null;
      }
      
      // Safer token retrieval
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        token = tokenData.data;
      } catch (e) {
        console.log('Error getting push token:', e);
        return null;
      }
    } else {
      console.log('Must use physical device for push notifications');
      return null;
    }
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }

  return token;
}

export function isQuietHours(now = new Date()) {
  const hour = now.getHours();
  return hour >= 22 || hour < 7;
}

export function hasRecentActivity(healthLogs, minutes = 45) {
  const cutoff = Date.now() - minutes * 60000;
  return Object.values(healthLogs || {}).some((arr) => (arr || []).some((l) => new Date(l.timestamp).getTime() >= cutoff));
}

export async function scheduleMorningCheckIn(time = '08:00') {
  const [h, m] = time.split(':').map((x) => parseInt(x, 10));
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Good morning!', body: 'How are you feeling today?' },
    trigger: { hour: h, minute: m, repeats: true },
  });
}

// Evening reminder if no logs today
export async function schedulePetNeedsCare() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your pet misses you! 🥺',
      body: "They haven't been fed today. Quick check-in?",
      data: { type: 'pet_care' },
    },
    trigger: { hour: 20, minute: 0, repeats: true },
  });
}

export async function scheduleHydrationReminders() {
  // 9am to 7pm every 2 hours
  for (let hour = 9; hour <= 19; hour += 2) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Time for a water break! 💧' },
      trigger: { hour, minute: 0, repeats: true },
    });
  }
}

export async function sendInstantAchievement(title) {
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Achievement unlocked!', body: title },
    trigger: null,
  });
}

export async function maybeSendSmartNotification({ type, store }) {
  const state = store.getState();
  const { notifications } = state;
  if (!notifications?.enabled) return;
  if (isQuietHours()) return;
  if (hasRecentActivity(state.healthLogs)) return;

  const contentByType = {
    morning: { title: 'Good morning!', body: 'How are you feeling today?' },
    hydration: { title: 'Time for a water break! 💧' },
    streak: { title: `Keep your ${state.achievements?.streakDays || 0}-day streak going!` },
  };
  const content = contentByType[type];
  if (!content) return;

  await Notifications.scheduleNotificationAsync({ content, trigger: null });
}
