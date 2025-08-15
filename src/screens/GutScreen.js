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
import Toast from '../components/Toast';
import HacksSection from '../components/HacksSection';
import PhotoCapture from '../components/PhotoCapture';
import PhotoGallery from '../components/PhotoGallery';
import { analyzeStoolType } from '../utils/ColorAnalyzer';

const GutScreen = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [mealNotificationsEnabled, setMealNotificationsEnabled] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);

  const addHealthLog = useStore((state) => state.addHealthLog);
  const addCredits = useStore((s) => s.addCredits);
  const addPhotoLog = useStore((state) => state.addPhotoLog);
  const gutLogs = useStore((state) => state.healthLogs.gut);
  const lastLogTime = useStore((s) => s.pet.lastLogTime);
  const [creditBurst, setCreditBurst] = useState(null);
  const [toast, setToast] = useState(null);

  const gutStatusOptions = [
    { id: 1, label: 'Upset', color: '#EF4444', interpretation: 'Troubled digestion – rest and hydrate' },
    { id: 2, label: 'Unsettled', color: '#F59E0B', interpretation: 'Slight discomfort – consider simple foods' },
    { id: 3, label: 'Neutral', color: '#FDE68A', interpretation: 'Baseline – notice changes after meals' },
    { id: 4, label: 'Content', color: '#A7F3D0', interpretation: 'Comfortable – keep supportive habits' },
    { id: 5, label: 'Harmonious', color: '#22C55E', interpretation: 'Thriving – great balance' },
  ];

  const mealQuickOptions = [
    { id: 'before', label: 'Before meal' },
    { id: 'after', label: 'After meal' },
    { id: 'snack', label: 'Snack' },
  ];

  const gutFeelingOptions = [
    'Bloated',
    'Comfortable',
    'Energized',
    'Heavy',
    'Light',
  ];

  const handleStatusLog = (option) => {
    addHealthLog('gut', {
      type: 'status',
      value: option.id,
      label: option.label,
      interpretation: option.interpretation,
    });
    setShowStatusModal(false);
    Alert.alert('Logged!', `${option.label} - ${option.interpretation}`);
    addCredits(15, 'gut:status');
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 30 : 15;
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const handleMealQuickLog = (meal) => {
    addHealthLog('gut', {
      type: 'meal',
      timing: meal.id,
    });
    Alert.alert('Noted!', `${meal.label}`);
    addCredits(15, 'gut:meal');
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 30 : 15;
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const openMealModal = () => {
    setSelectedMealType(null);
    setShowMealModal(true);
  };

  const handleMealWithFeeling = (feeling) => {
    if (!selectedMealType) {
      Alert.alert('Choose meal timing', 'Select a meal timing first.');
      return;
    }
    addHealthLog('gut', {
      type: 'meal',
      timing: selectedMealType.id,
      feeling: feeling,
    });
    setShowMealModal(false);
    setSelectedMealType(null);
    Alert.alert('Logged!', `${selectedMealType.label} • Feeling: ${feeling}`);
    addCredits(20, 'gut:meal+feeling');
    const now = Date.now();
    const combo = lastLogTime && now - lastLogTime <= 5 * 60 * 1000;
    const earned = combo ? 40 : 20;
    const { width } = Dimensions.get('window');
    setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo });
  };

  const handlePhotoCapture = async (photoData) => {
    try {
      // Analyze the photo
      const analysis = analyzeStoolType(photoData.uri);
      
      // Save photo with analysis and auto-delete after 10 minutes
      const photoId = addPhotoLog('gut', {
        ...photoData,
        analysis,
        autoDelete: true,
        blurred: true // Auto-blur for privacy
      });

      // Log the health data based on analysis
      addHealthLog('gut', {
        type: 'stool_photo',
        bristolType: analysis.bristolType,
        label: `Photo Analysis: ${analysis.typeDescription}`,
        interpretation: analysis.recommendation,
        photoId,
        confidence: analysis.confidence
      });

      setShowPhotoCapture(false);
      const gutWarning = (analysis.bristolType === 1 || analysis.bristolType === 7) || /medical|doctor|seek|attention|consult/i.test(analysis.recommendation || '');
      if (gutWarning) {
        setToast('Warning! Possible issue detected. Seek medical advice if symptoms persist.');
      } else {
        Alert.alert(
          'Photo Analyzed!', 
          `Bristol Type ${analysis.bristolType}: ${analysis.typeDescription}\n${analysis.recommendation}\nConfidence: ${Math.round(analysis.confidence * 100)}%\n\nNote: Photo will auto-delete in 10 minutes for privacy.`
        );
      }

      // Visual credit burst
      const earned = 25; // Bonus for photo analysis
      const { width } = Dimensions.get('window');
      setCreditBurst({ amount: earned, x: width / 2 - 10, y: 120, combo: false });
    } catch (error) {
      setShowPhotoCapture(false);
      Alert.alert('Error', 'Failed to analyze photo. Please try again.');
    }
  };

  const getTodayLogs = () => {
    const today = new Date().toDateString();
    return gutLogs.filter((log) => new Date(log.timestamp).toDateString() === today);
  };

  const getMealsToday = () => {
    const todayLogs = getTodayLogs();
    return todayLogs.filter((log) => log.type === 'meal').length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Vista tabName="gut" moduleType="gut" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Module Header */}
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>Gut Intelligence</Text>
          <Text style={styles.moduleDescription}>
            Monitor digestive health and track patterns
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon name="restaurant" size={24} color="#10B981" />
            <Text style={styles.statValue}>{getMealsToday()}</Text>
            <Text style={styles.statLabel}>Meals Today</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.statValue}>{getTodayLogs().length}</Text>
            <Text style={styles.statLabel}>Logs Today</Text>
          </View>
        </View>

        {/* Module 1: Gut Status */}
        <View style={styles.moduleSection}>
          <Text style={styles.moduleSectionTitle}>Gut Status</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowStatusModal(true)}
          >
            <Icon name="nutrition" size={24} color="#10B981" />
            <Text style={styles.actionButtonText}>Log Gut Status</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.photoButton]}
            onPress={() => setShowPhotoCapture(true)}
          >
            <Icon name="camera" size={24} color="#8B5CF6" />
            <Text style={[styles.actionButtonText, styles.photoButtonText]}>Add Photo Analysis</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => setShowPhotoGallery(true)}
          >
            <Icon name="images" size={24} color="#6B7280" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>View Photo History</Text>
          </TouchableOpacity>
        </View>

        {/* Module 2: Food & Digestion */}
        <View style={styles.moduleSection}>
          <View style={styles.moduleSwitchRow}>
            <Text style={styles.moduleSectionTitle}>Food & Digestion</Text>
            <TouchableOpacity
              style={[styles.switchButton, mealNotificationsEnabled && styles.switchButtonActive]}
              onPress={() => setMealNotificationsEnabled(!mealNotificationsEnabled)}
            >
              <Text style={styles.switchText}>
                {mealNotificationsEnabled ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.moduleSubtext}>
            Track meal timing and how your gut responds
          </Text>

          <View style={styles.hydrationButtons}>
            {mealQuickOptions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.hydrationButton}
                onPress={() => handleMealQuickLog(item)}
              >
                <Icon name="time" size={20} color="#10B981" />
                <Text style={styles.hydrationButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={openMealModal}
          >
            <Icon name="add-circle" size={24} color="#6B7280" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Add Meal + Feeling
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
                <Text style={styles.tipTitle}>Chew Thoroughly</Text>
                <Text style={styles.tipText}>Take time to chew well to support digestion</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>Gentle Walk</Text>
                <Text style={styles.tipText}>A short walk after meals can ease digestion</Text>
              </View>
            </ScrollView>
          </View>
        </View>
        <HacksSection moduleType="gut" />
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
      <Toast
        visible={!!toast}
        message={toast}
        type="warning"
        actionLabel="Learn more"
        onAction={() => {
          setToast(null);
          Alert.alert('Gut Warning', 'If you notice severe constipation or diarrhea persisting, along with pain, blood, or fever, contact a healthcare provider.');
        }}
        onHide={() => setToast(null)}
      />

      {/* Gut Status Modal */}
      <Modal
        visible={showStatusModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How is your gut feeling right now?</Text>

            {gutStatusOptions.map((option) => (
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

      {/* Food & Digestion Modal */}
      <Modal
        visible={showMealModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMealModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Meal + Gut Feeling</Text>

            <Text style={[styles.moduleSubtext, { marginBottom: 10 }]}>Meal timing:</Text>
            <View style={styles.hydrationButtons}>
              {mealQuickOptions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.hydrationButton,
                    selectedMealType && selectedMealType.id === item.id ? { borderColor: '#10B981', backgroundColor: '#ECFDF5' } : null,
                  ]}
                  onPress={() => setSelectedMealType(item)}
                >
                  <Icon name="time" size={20} color="#10B981" />
                  <Text style={styles.hydrationButtonText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.moduleSubtext, { marginTop: 10, marginBottom: 10 }]}>How's your gut feeling?</Text>
            <View style={styles.feelingsWrap}>
              {gutFeelingOptions.map((feeling) => (
                <TouchableOpacity
                  key={feeling}
                  style={styles.feelingTag}
                  onPress={() => handleMealWithFeeling(feeling)}
                >
                  <Text style={styles.feelingTagText}>{feeling}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowMealModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Photo Capture Modal */}
      {showPhotoCapture && (
        <PhotoCapture
          analysisType="stool"
          onCapture={handlePhotoCapture}
          onClose={() => setShowPhotoCapture(false)}
          autoBlur={true}
        />
      )}

      {/* Photo Gallery Modal */}
      {showPhotoGallery && (
        <Modal animationType="slide" presentationStyle="fullScreen">
          <PhotoGallery
            moduleType="gut"
            onClose={() => setShowPhotoGallery(false)}
          />
        </Modal>
      )}
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
    backgroundColor: '#10B981',
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
  photoButton: {
    backgroundColor: '#8B5CF6',
    marginTop: 12,
  },
  photoButtonText: {
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    marginTop: 8,
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
    backgroundColor: '#ECFDF5',
    paddingVertical: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  hydrationButtonText: {
    color: '#10B981',
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

export default GutScreen;