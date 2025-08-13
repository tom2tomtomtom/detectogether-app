import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import Icon from 'react-native-vector-icons/Ionicons';
import { scheduleMorningCheckIn, scheduleHydrationReminders, maybeSendSmartNotification } from '../services/NotificationService';

const Row = ({ label, children }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <View style={{ flex: 1 }} />
    {children}
  </View>
);

const NotificationSettingsScreen = () => {
  const notifications = useStore((s) => s.notifications);
  const setPref = useStore((s) => s.setNotificationPreference);

  const [morningTime, setMorningTime] = useState(notifications.morningCheckIn.time);
  const [hydrationFreq, setHydrationFreq] = useState(String(notifications.hydration.frequencyHours));

  const onSave = async () => {
    setPref('morningCheckIn.time', morningTime);
    setPref('hydration.frequencyHours', parseInt(hydrationFreq, 10) || 2);
    if (notifications.morningCheckIn.enabled) await scheduleMorningCheckIn(morningTime);
    if (notifications.hydration.enabled) await scheduleHydrationReminders();
    Alert.alert('Saved', 'Notification preferences updated.');
  };

  const onTest = async () => {
    await maybeSendSmartNotification({ type: 'morning', store: { getState: useStore.getState } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Notification Settings</Text>

        <View style={styles.card}>
          <Row label="Enable Notifications">
            <Switch value={notifications.enabled} onValueChange={(v) => setPref('enabled', v)} />
          </Row>
          <Row label="Morning Check-in">
            <Switch value={notifications.morningCheckIn.enabled} onValueChange={(v) => setPref('morningCheckIn.enabled', v)} />
          </Row>
          <View style={styles.inlineControls}>
            <Icon name="time" size={18} color="#6B7280" />
            <TextInput
              style={styles.input}
              value={morningTime}
              onChangeText={setMorningTime}
              placeholder="08:00"
            />
          </View>
          <Row label="Hydration Reminders">
            <Switch value={notifications.hydration.enabled} onValueChange={(v) => setPref('hydration.enabled', v)} />
          </Row>
          <View style={styles.inlineControls}>
            <Icon name="water" size={18} color="#3B82F6" />
            <Text style={styles.inlineLabel}>Every</Text>
            <TextInput
              style={[styles.input, { width: 60 }]}
              value={hydrationFreq}
              onChangeText={setHydrationFreq}
              keyboardType="numeric"
            />
            <Text style={styles.inlineLabel}>hours</Text>
          </View>
          <Row label="Achievement Alerts">
            <Switch value={notifications.achievements.enabled} onValueChange={(v) => setPref('achievements.enabled', v)} />
          </Row>
          <Row label="Streak Reminders">
            <Switch value={notifications.streaks.enabled} onValueChange={(v) => setPref('streaks.enabled', v)} />
          </Row>
          <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
            <Text style={styles.primaryButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryButton, styles.secondaryButton]} onPress={onTest}>
            <Text style={[styles.primaryButtonText, styles.secondaryText]}>Send Test</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  rowLabel: { fontSize: 16, color: '#1F2937' },
  inlineControls: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  inlineLabel: { marginHorizontal: 8, color: '#6B7280' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: '#1F2937', marginLeft: 8 },
  primaryButton: { backgroundColor: '#3B82F6', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondaryButton: { backgroundColor: '#F3F4F6' },
  secondaryText: { color: '#374151' },
});

export default NotificationSettingsScreen;
