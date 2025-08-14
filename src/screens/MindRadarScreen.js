import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import Vista from '../components/Vista';
import { useStore } from '../store/useStore';
import Icon from 'react-native-vector-icons/Ionicons';
import CreditAnimation from '../components/CreditAnimation';

const MindRadarScreen = () => {
  const [showStressModal, setShowStressModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [mindfulnessNotificationsEnabled, setMindfulnessNotificationsEnabled] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);

  const addHealthLog = useStore((state) => state.addHealthLog);
  const addCredits = useStore((s) => s.addCredits);
  const mindLogs = useStore((state) => state.healthLogs.headVision);
  const lastLogTime = useStore((s) => s.pet.lastLogTime);
  const [creditBurst, setCreditBurst] = useState(null);

  const stressOptions = [
    { id: 1, label: 'Overwhelmed', color: '#5B21B6', interpretation: 'High stress – pause and breathe' },
    { id: 2, label: 'Tense', color: '#EF4444', interpretation: 'Elevated – take a short break' },
    { id: 3, label: 'Moderate', color: '#F59E0B', interpretation: 'Manageable – keep steady' },
    { id: 4, label: 'Relaxed', color: '#E0F2FE', interpretation: 'Easing – maintain balance' },
    { id: 5, label: 'Zen', color: '#1E3A8A', interpretation: 'Calm – clear skies' },
  ];

  const checkinQuickOptions = [
    { id: 'morning', label: 'Morning mood' },
    { id: 'afternoon', label: 'Afternoon check' },
    { id: 'evening', label: 'Evening reflection' },
  ];

  const mindFeelingOptions = [
    'Anxious',
    'Calm',
    'Focused',
    'Scattered',
    'Peaceful',
  ];

  const handleStressLog = (option) => {
    addHealthLog('headVision', {
      type: 'status',
      value: option.id,
      label: option.label,
      interpretation: option.interpretation,
    });
    setShowStressModal(false);
    Alert.alert('Logged!', `${option.label} - ${option.interpretation}`);
    addCredits(10, 'mind:status');
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 20 : 10;
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const handleCheckinQuickLog = (item) => {
    addHealthLog('headVision', {
      type: 'checkin',
      time: item.id,
    });
    Alert.alert('Noted!', `${item.label}`);
    addCredits(10, 'mind:checkin');
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 20 : 10;
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const openCheckinModal = () => {
    setSelectedCheckin(null);
    setShowCheckinModal(true);
  };

  const handleCheckinWithFeeling = (feeling) => {
    if (!selectedCheckin) {
      Alert.alert('Choose check-in time', 'Select a time first.');
      return;
    }
    addHealthLog('headVision', {
      type: 'checkin',
      time: selectedCheckin.id,
      feeling: feeling,
    });
    setShowCheckinModal(false);
    setSelectedCheckin(null);
    Alert.alert('Logged!', `${selectedCheckin.label} • Mind: ${feeling}`);
    addCredits(10, 'mind:checkin+feeling');
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 20 : 10;
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const getTodayLogs = () => {
    const today = new Date().toDateString();
    return mindLogs.filter((log) => new Date(log.timestamp).toDateString() === today);
  };

  const getMoodLogsToday = () => {
    const todayLogs = getTodayLogs();
    return todayLogs.filter((log) => log.type === 'status').length;
  };

  const getCheckinsToday = () => {
    const todayLogs = getTodayLogs();
    return todayLogs.filter((log) => log.type === 'checkin').length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Vista tabName="mindRadar" moduleType="mind" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Module Header */}
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>Mind's Radar</Text>
          <Text style={styles.moduleDescription}>
            Track stress, mood, and mindfulness check-ins
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon name="happy" size={24} color="#8B5CF6" />
            <Text style={styles.statValue}>{getMoodLogsToday()}</Text>
            <Text style={styles.statLabel}>Mood Logs Today</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.statValue}>{getCheckinsToday()}</Text>
            <Text style={styles.statLabel}>Check-ins Today</Text>
          </View>
        </View>

        {/* Module 1: Stress Level */}
        <View style={styles.moduleSection}>
          <Text style={styles.moduleSectionTitle}>Stress Level</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowStressModal(true)}
          >
            <Icon name="speedometer" size={24} color="#8B5CF6" />
            <Text style={styles.actionButtonText}>Log Stress Level</Text>
          </TouchableOpacity>
        </View>

        {/* Module 2: Mood & Mindfulness */}
        <View style={styles.moduleSection}>
          <View style={styles.moduleSwitchRow}>
            <Text style={styles.moduleSectionTitle}>Mood & Mindfulness</Text>
            <TouchableOpacity
              style={[styles.switchButton, mindfulnessNotificationsEnabled && styles.switchButtonActive]}
              onPress={() => setMindfulnessNotificationsEnabled(!mindfulnessNotificationsEnabled)}
            >
              <Text style={styles.switchText}>
                {mindfulnessNotificationsEnabled ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.moduleSubtext}>
            Quick check-ins to center your day
          </Text>

          <View style={styles.hydrationButtons}>
            {checkinQuickOptions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.hydrationButton}
                onPress={() => handleCheckinQuickLog(item)}
              >
                <Icon name="time" size={20} color="#8B5CF6" />
                <Text style={styles.hydrationButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={openCheckinModal}
          >
            <Icon name="add-circle" size={24} color="#6B7280" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Add Check-in + Mind
            </Text>
          </TouchableOpacity>
        </View>

        {/* Module 3: Hacks */}
        <View style={styles.moduleSection}>
          <Text style={styles.moduleSectionTitle}>Hacks</Text>

          {/* Tips & Tricks */}
          <View style={styles.hacksCard}>
            <Text style={styles.hacksCardTitle}>Tips & Tricks</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>Box Breathing</Text>
                <Text style={styles.tipText}>Inhale 4s, hold 4s, exhale 4s, hold 4s – 3 rounds</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>Micro Break</Text>
                <Text style={styles.tipText}>Stand up and stretch for 60 seconds to reset focus</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      {creditBurst && (
        <CreditAnimation
          amount={creditBurst.amount}
          x={creditBurst.x}
          y={creditBurst.y}
          combo={creditBurst.combo}
          onEnd={() => setCreditBurst(null)}
        />
      )}

      {/* Stress Level Modal */}
      <Modal
        visible={showStressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Where is your stress right now?</Text>

            {stressOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.colorOption}
                onPress={() => handleStressLog(option)}
              >
                <View style={[styles.colorSample, { backgroundColor: option.color }]} />
                <View style={styles.colorOptionText}>
                  <Text style={styles.colorLabel}>{option.label}</Text>
                  <Text style={styles.colorInterpretation}>{option.interpretation}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowStressModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Mood & Mindfulness Modal */}
      <Modal
        visible={showCheckinModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCheckinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Check-in + Mind</Text>

            <Text style={[styles.moduleSubtext, { marginBottom: 10 }]}>Time:</Text>
            <View style={styles.hydrationButtons}>
              {checkinQuickOptions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.hydrationButton,
                    selectedCheckin && selectedCheckin.id === item.id ? { borderColor: '#8B5CF6', backgroundColor: '#F5F3FF' } : null,
                  ]}
                  onPress={() => setSelectedCheckin(item)}
                >
                  <Icon name="time" size={20} color="#8B5CF6" />
                  <Text style={styles.hydrationButtonText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.moduleSubtext, { marginTop: 10, marginBottom: 10 }]}>How's your mind?</Text>
            <View style={styles.feelingsWrap}>
              {mindFeelingOptions.map((feeling) => (
                <TouchableOpacity
                  key={feeling}
                  style={styles.feelingTag}
                  onPress={() => handleCheckinWithFeeling(feeling)}
                >
                  <Text style={styles.feelingTagText}>{feeling}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCheckinModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  moduleHeader: {
    marginBottom: 20,
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },  moduleDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },  moduleSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  moduleSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  moduleSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  switchButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  switchButtonActive: {
    backgroundColor: '#3B82F6',
  },  switchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  moduleSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#6B7280',
  },  hydrationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  hydrationButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingVertical: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  hydrationButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  hacksCard: {
    marginBottom: 15,
  },
  hacksCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  tipCard: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    width: 220,
  },  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  colorSample: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
  },
  colorOptionText: {
    flex: 1,
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 3,
  },
  colorInterpretation: {
    fontSize: 13,
    color: '#6B7280',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  feelingsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feelingTag: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  feelingTagText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MindRadarScreen;