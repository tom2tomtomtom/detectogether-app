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
import HacksSection from '../components/HacksSection';

const DermalMapScreen = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [skincareNotificationsEnabled, setSkincareNotificationsEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const addHealthLog = useStore((state) => state.addHealthLog);
  const addCredits = useStore((s) => s.addCredits);
  const skinLogs = useStore((state) => state.healthLogs.skin);
  const lastLogTime = useStore((s) => s.pet.lastLogTime);
  const [creditBurst, setCreditBurst] = useState(null);

  const skinStatusOptions = [
    { id: 1, label: 'Inflamed', color: '#EF4444', interpretation: 'Irritated – consider calming care' },
    { id: 2, label: 'Irritated', color: '#F59E0B', interpretation: 'A bit reactive – go gentle' },
    { id: 3, label: 'Normal', color: '#FDE68A', interpretation: 'Baseline – maintain routine' },
    { id: 4, label: 'Clear', color: '#A7F3D0', interpretation: 'Feeling good – keep it up' },
    { id: 5, label: 'Radiant', color: '#FACC15', interpretation: 'Glowing – sunshine state' },
  ];

  const timeQuickOptions = [
    { id: 'morning', label: 'Morning check' },
    { id: 'midday', label: 'Midday update' },
    { id: 'evening', label: 'Evening review' },
  ];

  const skinAreas = ['Face', 'Body', 'Hands', 'Other'];
  const skinConditionOptions = ['Dry', 'Oily', 'Clear', 'Breakout', 'Sensitive'];

  const handleStatusLog = (option) => {
    addHealthLog('skin', {
      type: 'status',
      value: option.id,
      label: option.label,
      interpretation: option.interpretation,
    });
    setShowStatusModal(false);
    Alert.alert('Logged!', `${option.label} - ${option.interpretation}`);
    addCredits(25, 'skin:status');
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 50 : 25;
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const handleObservationQuickLog = (item) => {
    addHealthLog('skin', {
      type: 'observation',
      time: item.id,
    });
    Alert.alert('Noted!', `${item.label}`);
    addCredits(15, 'skin:observation');
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 30 : 15;
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const openObservationModal = () => {
    setSelectedTime(null);
    setSelectedArea(null);
    setShowObservationModal(true);
  };

  const handleObservationWithDetails = (condition) => {
    if (!selectedTime) {
      Alert.alert('Choose time', 'Select a time first.');
      return;
    }
    if (!selectedArea) {
      Alert.alert('Choose area', 'Select an area first.');
      return;
    }
    addHealthLog('skin', {
      type: 'observation',
      time: selectedTime.id,
      area: selectedArea,
      condition: condition,
    });
    setShowObservationModal(false);
    setSelectedTime(null);
    setSelectedArea(null);
    Alert.alert('Logged!', `${selectedTime.label} • ${selectedArea} • ${condition}`);
    addCredits(20, 'skin:observation+details');
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 40 : 20;
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const getTodayLogs = () => {
    const today = new Date().toDateString();
    return skinLogs.filter((log) => new Date(log.timestamp).toDateString() === today);
  };

  const getSkinStatusLogsToday = () => {
    const todayLogs = getTodayLogs();
    return todayLogs.filter((log) => log.type === 'status').length;
  };

  const getObservationsToday = () => {
    const todayLogs = getTodayLogs();
    return todayLogs.filter((log) => log.type === 'observation').length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Vista tabName="dermalMap" moduleType="skin" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Module Header */}
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>Dermal Map</Text>
          <Text style={styles.moduleDescription}>
            Seasonal skin check reminders and tracking
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon name="color-palette" size={24} color="#EC4899" />
            <Text style={styles.statValue}>{getSkinStatusLogsToday()}</Text>
            <Text style={styles.statLabel}>Skin Logs Today</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.statValue}>{getObservationsToday()}</Text>
            <Text style={styles.statLabel}>Observations Today</Text>
          </View>
        </View>

        {/* Module 1: Skin Status */}
        <View style={styles.moduleSection}>
          <Text style={styles.moduleSectionTitle}>Skin Status</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowStatusModal(true)}
          >
            <Icon name="color-palette" size={24} color="#EC4899" />
            <Text style={styles.actionButtonText}>Log Skin Status</Text>
          </TouchableOpacity>
        </View>

        {/* Module 2: Skin Observations */}
        <View style={styles.moduleSection}>
          <View style={styles.moduleSwitchRow}>
            <Text style={styles.moduleSectionTitle}>Skin Observations</Text>
            <TouchableOpacity
              style={[styles.switchButton, skincareNotificationsEnabled && styles.switchButtonActive]}
              onPress={() => setSkincareNotificationsEnabled(!skincareNotificationsEnabled)}
            >
              <Text style={styles.switchText}>
                {skincareNotificationsEnabled ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.moduleSubtext}>
            Track areas and note skin conditions
          </Text>

          <View style={styles.hydrationButtons}>
            {timeQuickOptions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.hydrationButton}
                onPress={() => handleObservationQuickLog(item)}
              >
                <Icon name="time" size={20} color="#EC4899" />
                <Text style={styles.hydrationButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={openObservationModal}
          >
            <Icon name="add-circle" size={24} color="#6B7280" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Add Observation + Details
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
                <Text style={styles.tipTitle}>SPF Daily</Text>
                <Text style={styles.tipText}>Apply broad-spectrum sunscreen every morning</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>Gentle Cleanse</Text>
                <Text style={styles.tipText}>Use a mild cleanser to protect the skin barrier</Text>
              </View>
            </ScrollView>
          </View>
        </View>
        <HacksSection moduleType="dermal" />
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

      {/* Skin Status Modal */}
      <Modal
        visible={showStatusModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How is your skin right now?</Text>

            {skinStatusOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.colorOption}
                onPress={() => handleStatusLog(option)}
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
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Skin Observations Modal */}
      <Modal
        visible={showObservationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowObservationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Observation + Details</Text>

            <Text style={[styles.moduleSubtext, { marginBottom: 10 }]}>Time:</Text>
            <View style={styles.hydrationButtons}>
              {timeQuickOptions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.hydrationButton,
                    selectedTime && selectedTime.id === item.id ? { borderColor: '#EC4899', backgroundColor: '#FCE7F3' } : null,
                  ]}
                  onPress={() => setSelectedTime(item)}
                >
                  <Icon name="time" size={20} color="#EC4899" />
                  <Text style={styles.hydrationButtonText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.moduleSubtext, { marginBottom: 10 }]}>Area:</Text>
            <View style={styles.feelingsWrap}>
              {skinAreas.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={[styles.feelingTag, selectedArea === area ? { backgroundColor: '#FCE7F3' } : null]}
                  onPress={() => setSelectedArea(area)}
                >
                  <Text style={styles.feelingTagText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.moduleSubtext, { marginTop: 10, marginBottom: 10 }]}>How's your skin?</Text>
            <View style={styles.feelingsWrap}>
              {skinConditionOptions.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={styles.feelingTag}
                  onPress={() => handleObservationWithDetails(condition)}
                >
                  <Text style={styles.feelingTagText}>{condition}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowObservationModal(false)}
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
    backgroundColor: '#EC4899',
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
    backgroundColor: '#FCE7F3',
    paddingVertical: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EC4899',
  },
  hydrationButtonText: {
    color: '#EC4899',
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

export default DermalMapScreen;