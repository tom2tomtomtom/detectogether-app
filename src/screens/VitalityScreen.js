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
} from 'react-native';
import Vista from '../components/Vista';
import { useStore } from '../store/useStore';
import Icon from 'react-native-vector-icons/Ionicons';

const VitalityScreen = () => {
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [showBrewModal, setShowBrewModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedBrew, setSelectedBrew] = useState(null);

  const addHealthLog = useStore((state) => state.addHealthLog);
  const healthLogs = useStore((state) => state.healthLogs.energy);

  const energyOptions = [
    { id: 1, label: 'Drained', color: '#9CA3AF', interpretation: 'Running on empty – consider rest + gentle movement' },
    { id: 2, label: 'Sluggish', color: '#E0F2FE', interpretation: 'Low power – hydrate and take a short walk' },
    { id: 3, label: 'Just okay', color: '#FDE68A', interpretation: 'Holding steady – maintain steady habits' },
    { id: 4, label: 'Lightly charged', color: '#FDBA74', interpretation: 'Good charge – keep the flow' },
    { id: 5, label: 'Fully Charged', color: '#F97316', interpretation: 'High power – use it wisely' },
  ];

  const brewQuickOptions = [
    { id: 'usual', label: 'Yes - usual amount', caffeinated: true },
    { id: 'more', label: 'Yes - more than usual', caffeinated: true },
    { id: 'none', label: 'Nope - caffeine free', caffeinated: false },
  ];

  const feelingOptions = [
    'Calm',
    'Focused',
    'Jittery',
    'Anxious',
    'Sleepy',
    'No change',
  ];

  const handleEnergyLog = (option) => {
    addHealthLog('energy', {
      type: 'status',
      value: option.id,
      label: option.label,
      interpretation: option.interpretation,
    });
    setShowEnergyModal(false);
    Alert.alert('Logged!', `${option.label} - ${option.interpretation}`);
  };

  const handleBrewQuickLog = (opt) => {
    addHealthLog('energy', {
      type: 'brew',
      brew: opt.id,
      caffeinated: opt.caffeinated,
    });
    Alert.alert('Noted!', `${opt.label}`);
  };

  const handleOpenBrewModal = () => {
    setSelectedBrew(null);
    setShowBrewModal(true);
  };

  const handleBrewWithFeeling = (feeling) => {
    if (!selectedBrew) {
      Alert.alert('Choose brew amount', 'Select one of the brew options first.');
      return;
    }
    addHealthLog('energy', {
      type: 'brew',
      brew: selectedBrew.id,
      caffeinated: selectedBrew.caffeinated,
      feeling: feeling,
    });
    setShowBrewModal(false);
    setSelectedBrew(null);
    Alert.alert('Logged!', `${selectedBrew.label} • Feeling: ${feeling}`);
  };

  const getTodayLogs = () => {
    const today = new Date().toDateString();
    return healthLogs.filter((log) => new Date(log.timestamp).toDateString() === today);
  };

  const getCaffeineCountToday = () => {
    const todayLogs = getTodayLogs();
    return todayLogs.filter((log) => log.type === 'brew' && log.caffeinated).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Vista tabName="vitality" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Module Header */}
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>Vitality Compass</Text>
          <Text style={styles.moduleDescription}>
            Track your energy patterns and caffeine intake
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon name="cafe" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{getCaffeineCountToday()}</Text>
            <Text style={styles.statLabel}>Caffeine Today</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.statValue}>{getTodayLogs().length}</Text>
            <Text style={styles.statLabel}>Logs Today</Text>
          </View>
        </View>

        {/* Module 1: Energy Status */}
        <View style={styles.moduleSection}>
          <View style={styles.moduleSwitchRow}>
            <Text style={styles.moduleSectionTitle}>Energy Status</Text>
            <TouchableOpacity
              style={[styles.switchButton, notificationsEnabled && styles.switchButtonActive]}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <Text style={styles.switchText}>
                {notificationsEnabled ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowEnergyModal(true)}
          >
            <Icon name="flash" size={24} color="#F59E0B" />
            <Text style={styles.actionButtonText}>Log Energy Status</Text>
          </TouchableOpacity>
        </View>

        {/* Module 2: Brew Tracker */}
        <View style={styles.moduleSection}>
          <Text style={styles.moduleSectionTitle}>Brew Tracker</Text>
          <Text style={styles.moduleSubtext}>
            Log caffeine and notice how your body responds
          </Text>

          <View style={styles.hydrationButtons}>
            {brewQuickOptions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.hydrationButton}
                onPress={() => handleBrewQuickLog(item)}
              >
                <Icon name="cafe" size={20} color="#F59E0B" />
                <Text style={styles.hydrationButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleOpenBrewModal}
          >
            <Icon name="add-circle" size={24} color="#6B7280" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Add Brew + Feeling
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
                <Text style={styles.tipTitle}>Caffeine Cutoff</Text>
                <Text style={styles.tipText}>Stop caffeine at least 8 hours before bed for deeper sleep</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>Midday Reset</Text>
                <Text style={styles.tipText}>Try 5 minutes of daylight + a short walk instead of a late coffee</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Energy Status Modal */}
      <Modal
        visible={showEnergyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEnergyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What's your energy like right now?</Text>

            {energyOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.colorOption}
                onPress={() => handleEnergyLog(option)}
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
              onPress={() => setShowEnergyModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Brew Tracker Modal */}
      <Modal
        visible={showBrewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBrewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Brew + Feeling</Text>

            <Text style={[styles.moduleSubtext, { marginBottom: 10 }]}>Choose what you had:</Text>
            <View style={styles.hydrationButtons}>
              {brewQuickOptions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.hydrationButton,
                    selectedBrew && selectedBrew.id === item.id ? { borderColor: '#F59E0B', backgroundColor: '#FFF7ED' } : null,
                  ]}
                  onPress={() => setSelectedBrew(item)}
                >
                  <Icon name="cafe" size={20} color="#F59E0B" />
                  <Text style={styles.hydrationButtonText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.moduleSubtext, { marginTop: 10, marginBottom: 10 }]}>How's your body feeling?</Text>
            <View style={styles.feelingsWrap}>
              {feelingOptions.map((feeling) => (
                <TouchableOpacity
                  key={feeling}
                  style={styles.feelingTag}
                  onPress={() => handleBrewWithFeeling(feeling)}
                >
                  <Text style={styles.feelingTagText}>{feeling}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowBrewModal(false)}
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
    backgroundColor: '#F59E0B',
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
    backgroundColor: '#FFF7ED',
    paddingVertical: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  hydrationButtonText: {
    color: '#F59E0B',
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
    width: 200,
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

export default VitalityScreen;