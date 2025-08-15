import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import Icon from 'react-native-vector-icons/Ionicons';

const AccountScreen = ({ navigation }) => {
  const user = useStore((state) => state.user);
  const pet = useStore((state) => state.pet);

  const resetAppData = useStore((s) => s.resetAppData);
  const setPetData = useStore((s) => s.setPetData);

  const handleResetAppData = async () => {
    Alert.alert(
      'Reset App Data',
      'This will clear all data and restart with demo-ready pet stats (75% health for decay demonstration). Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: async () => {
            console.log('🔴 DEMO RESET: Resetting entire app to demo-ready state');
            await resetAppData();
            // Set demo-ready state with timestamp for decay
            setPetData({ lastResetTime: Date.now() });
            console.log('✅ DEMO RESET: Complete - app reset with demo decay timer');
          }
        }
      ]
    );
  };

  const settingsOptions = [
    { icon: 'notifications', label: 'Notification Settings', onPress: () => navigation && navigation.navigate && navigation.navigate('NotificationSettings') },
    { icon: 'cart', label: 'Pet Store', onPress: () => navigation && navigation.navigate && navigation.navigate('PetStore') },
    { icon: 'person', label: 'Personal Information', onPress: () => {} },
    { icon: 'paw', label: 'Pet Information', onPress: () => {} },
    { icon: 'lock-closed', label: 'Privacy & Data', onPress: () => {} },
    { icon: 'people', label: 'Social Settings', onPress: () => {} },
    { icon: 'help-circle', label: 'Support & Info', onPress: () => {} },
    { icon: 'warning', label: 'Reset App Data', onPress: handleResetAppData },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileIcon}>
            <Icon name="person-circle" size={80} color="#3B82F6" />
          </View>
          <Text style={styles.userName}>{user.name || 'Guest User'}</Text>
          <Text style={styles.petInfo}>
            Pet: {pet.petName || 'Not set'} • Level {pet.level}
          </Text>
        </View>
        <View style={styles.settingsList}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              onPress={option.onPress}
            >
              <View style={styles.settingItemLeft}>
                <Icon name={option.icon} size={24} color="#6B7280" />
                <Text style={styles.settingLabel}>{option.label}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  petInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 15,
  },
});

export default AccountScreen;