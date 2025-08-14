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

const FluidFlowScreen = () => {
  const [showColorModal, setShowColorModal] = useState(false);
  const [showHydrationModal, setShowHydrationModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const addHealthLog = useStore((state) => state.addHealthLog);
  const addCredits = useStore((s) => s.addCredits);
  const healthLogs = useStore((state) => state.healthLogs.hydration);

  const colorOptions = [
    { id: 1, label: 'Usual yellow color', color: '#FEF3C7', interpretation: 'Normal hydration' },
    { id: 2, label: 'Darker than normal', color: '#F59E0B', interpretation: 'Mild dehydration - drink water' },
    { id: 3, label: 'Red or pink tint', color: '#EF4444', interpretation: 'See a doctor if persistent' },
    { id: 4, label: 'Foamy or cloudy', color: '#E5E7EB', interpretation: 'May indicate protein in urine' },
    { id: 5, label: "Didn't notice/unsure", color: '#9CA3AF', interpretation: 'Try to check next time' },
  ];
  const hydrationAmounts = [
    { amount: 4, label: '+4 oz' },
    { amount: 8, label: '+8 oz' },
    { amount: 16, label: '+16 oz' },
  ];

  const lastLogTime = useStore((s) => s.pet.lastLogTime);

  const [creditBurst, setCreditBurst] = useState(null);

  const handleColorLog = (option) => {
    addHealthLog('hydration', {
      type: 'color',
      value: option.id,
      label: option.label,
      interpretation: option.interpretation,
    });
    setShowColorModal(false);
    Alert.alert('Logged!', `${option.label} - ${option.interpretation}`);
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 20 : 10;
    addCredits(10, 'hydration:color', combo);
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const handleHydrationLog = (amount) => {
    addHealthLog('hydration', {
      type: 'intake',
      amount: amount,
      unit: 'oz',
    });
    Alert.alert('Great job!', `${amount}oz logged! Your garden is thriving.`);
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 20 : 10;
    addCredits(10, 'hydration:intake', combo);
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const getTodayLogs = () => {
    const today = new Date().toDateString();
    return healthLogs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );
  };

  const getTotalHydration = () => {
    const todayLogs = getTodayLogs();
    return todayLogs
      .filter(log => log.type === 'intake')
      .reduce((total, log) => total + log.amount, 0);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Vista tabName="fluidFlow" moduleType="fluid" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Module Header */}
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>Fluid Flow & Balance</Text>
          <Text style={styles.moduleDescription}>
            Track hydration and observe key signals related to fluid balance
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon name="water" size={24} color="#3B82F6" />
            <Text style={styles.statValue}>{getTotalHydration()} oz</Text>
            <Text style={styles.statLabel}>Today's Intake</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.statValue}>{getTodayLogs().length}</Text>
            <Text style={styles.statLabel}>Logs Today</Text>
          </View>
        </View>

        {/* Module 1: Color Assessment */}
        <View style={styles.moduleSection}>
          <View style={styles.moduleSwitchRow}>
            <Text style={styles.moduleSectionTitle}>Color Assessment</Text>
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
            onPress={() => setShowColorModal(true)}
          >
            <Icon name="color-palette" size={24} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Log Urine Color</Text>
          </TouchableOpacity>
        </View>

        {/* Module 2: Hydration Buddy */}
        <View style={styles.moduleSection}>
          <Text style={styles.moduleSectionTitle}>Hydration Buddy</Text>
          <Text style={styles.moduleSubtext}>
            Help your garden grow - log your water intake
          </Text>
          
          <View style={styles.hydrationButtons}>
            {hydrationAmounts.map((item) => (
              <TouchableOpacity
                key={item.amount}
                style={styles.hydrationButton}
                onPress={() => handleHydrationLog(item.amount)}
              >
                <Icon name="water" size={20} color="#3B82F6" />
                <Text style={styles.hydrationButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => setShowHydrationModal(true)}
          >
            <Icon name="add-circle" size={24} color="#6B7280" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Add Custom Amount
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
                <Text style={styles.tipTitle}>Morning Glass</Text>
                <Text style={styles.tipText}>Drink 8oz of water within 10 minutes of waking</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>Pre-Meal Hydration</Text>
                <Text style={styles.tipText}>Sip a full glass before meals to support digestion</Text>
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

      {/* Color Assessment Modal */}
      <Modal
        visible={showColorModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowColorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notice any difference in your urine?</Text>
            
            {colorOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.colorOption}
                onPress={() => handleColorLog(option)}
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
              onPress={() => setShowColorModal(false)}
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
    backgroundColor: '#3B82F6',
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
    backgroundColor: '#EFF6FF',
    paddingVertical: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  hydrationButtonText: {
    color: '#3B82F6',
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
});

export default FluidFlowScreen;