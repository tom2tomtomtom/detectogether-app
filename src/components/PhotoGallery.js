import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  Share
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';
import { colors, spacing, typography, borderRadius } from '../styles/theme';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - spacing.lg * 3) / 2;

const PhotoGallery = ({ moduleType, onClose }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPhotos, setComparisonPhotos] = useState([]);
  const scrollRef = useRef(null);

  const photoHistory = useStore(state => state.getPhotoHistory(moduleType, 50));
  const removePhotoLog = useStore(state => state.removePhotoLog);
  const clearPhotoLogs = useStore(state => state.clearPhotoLogs);
  const exportPhotoData = useStore(state => state.exportPhotoData);

  const getModuleName = () => {
    switch (moduleType) {
      case 'fluid': return 'Urine Analysis';
      case 'gut': return 'Stool Analysis';
      case 'dermal': return 'Skin Analysis';
      default: return 'Photo Gallery';
    }
  };

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleDeletePhoto = (photoId) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            removePhotoLog(moduleType, photoId);
            setSelectedPhoto(null);
          }
        }
      ]
    );
  };

  const handleBatchDelete = () => {
    Alert.alert(
      'Clear All Photos',
      `Are you sure you want to delete all ${moduleType} photos? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => clearPhotoLogs(moduleType)
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const exportData = exportPhotoData(moduleType, lastMonth.toISOString(), new Date().toISOString());
      
      const dataString = JSON.stringify(exportData, null, 2);
      const title = `${getModuleName()} Data Export`;
      const message = `Export contains ${exportData.length} photos from the last month.`;
      
      await Share.share({
        title,
        message: `${message}\n\n${dataString}`
      });
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export photo data.');
    }
  };

  const handleComparisonMode = () => {
    if (photoHistory.length < 2) {
      Alert.alert('Not Enough Photos', 'You need at least 2 photos to compare.');
      return;
    }
    
    setShowComparison(true);
    setComparisonPhotos([photoHistory[0], photoHistory[1]]);
  };

  const selectComparisonPhoto = (index, photo) => {
    const newComparison = [...comparisonPhotos];
    newComparison[index] = photo;
    setComparisonPhotos(newComparison);
  };

  const renderPhotoItem = ({ photo, onPress, isSelected = false }) => (
    <TouchableOpacity
      key={photo.id}
      style={[styles.photoItem, isSelected && styles.photoItemSelected]}
      onPress={() => onPress(photo)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: photo.uri }} style={styles.photoImage} />
      
      {/* Blur overlay for sensitive content */}
      {photo.blurred && moduleType === 'gut' && (
        <BlurView intensity={30} style={styles.photoBlur}>
          <Text style={styles.blurLabel}>Private</Text>
        </BlurView>
      )}
      
      {/* Photo info overlay */}
      <View style={styles.photoInfo}>
        <Text style={styles.photoDate}>
          {new Date(photo.timestamp).toLocaleDateString()}
        </Text>
        {photo.analysis && (
          <Text style={styles.photoResult} numberOfLines={1}>
            {photo.analysis.hydrationStatus || photo.analysis.condition || photo.analysis.typeDescription || 'Analyzed'}
          </Text>
        )}
      </View>
      
      {/* Confidence indicator */}
      {photo.confidence && (
        <View style={[styles.confidenceBadge, { 
          backgroundColor: photo.confidence > 0.8 ? '#4CAF50' : photo.confidence > 0.6 ? '#FF9800' : '#F44336'
        }]}>
          <Text style={styles.confidenceText}>
            {Math.round(photo.confidence * 100)}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSelectedPhotoModal = () => (
    <Modal visible={!!selectedPhoto} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedPhoto(null)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Photo Details</Text>
            <TouchableOpacity onPress={() => handleDeletePhoto(selectedPhoto.id)}>
              <Text style={styles.modalDeleteButton}>🗑️</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Image source={{ uri: selectedPhoto.uri }} style={styles.modalImage} />
            
            <View style={styles.analysisSection}>
              <Text style={styles.analysisTitle}>Analysis Results</Text>
              <Text style={styles.analysisDate}>
                {new Date(selectedPhoto.timestamp).toLocaleString()}
              </Text>
              
              {selectedPhoto.analysis && (
                <View style={styles.analysisDetails}>
                  {moduleType === 'fluid' && (
                    <>
                      <Text style={styles.analysisItem}>
                        Hydration: {selectedPhoto.analysis.hydrationStatus}
                      </Text>
                      <Text style={styles.analysisItem}>
                        Color Level: {selectedPhoto.analysis.colorLevel}/8
                      </Text>
                      <Text style={styles.analysisRecommendation}>
                        {selectedPhoto.analysis.recommendation}
                      </Text>
                    </>
                  )}
                  
                  {moduleType === 'gut' && (
                    <>
                      <Text style={styles.analysisItem}>
                        Bristol Type: {selectedPhoto.analysis.bristolType}/7
                      </Text>
                      <Text style={styles.analysisItem}>
                        {selectedPhoto.analysis.typeDescription}
                      </Text>
                      <Text style={styles.analysisRecommendation}>
                        {selectedPhoto.analysis.recommendation}
                      </Text>
                    </>
                  )}
                  
                  {moduleType === 'dermal' && (
                    <>
                      <Text style={styles.analysisItem}>
                        Condition: {selectedPhoto.analysis.condition}
                      </Text>
                      <Text style={styles.analysisItem}>
                        Score: {selectedPhoto.analysis.score}/5
                      </Text>
                      {selectedPhoto.analysis.concerns?.length > 0 && (
                        <Text style={styles.analysisItem}>
                          Concerns: {selectedPhoto.analysis.concerns.join(', ')}
                        </Text>
                      )}
                      <Text style={styles.analysisRecommendation}>
                        {selectedPhoto.analysis.recommendation}
                      </Text>
                    </>
                  )}
                  
                  <Text style={styles.confidenceText}>
                    Analysis Confidence: {Math.round(selectedPhoto.confidence * 100)}%
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );

  const renderComparisonModal = () => (
    <Modal visible={showComparison} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowComparison(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Compare Photos</Text>
            <View style={styles.spacer} />
          </View>

          <View style={styles.comparisonContainer}>
            {comparisonPhotos.map((photo, index) => (
              <View key={index} style={styles.comparisonSide}>
                <Text style={styles.comparisonLabel}>
                  {index === 0 ? 'Before' : 'After'}
                </Text>
                
                {photo && (
                  <Image source={{ uri: photo.uri }} style={styles.comparisonImage} />
                )}
                
                <ScrollView horizontal style={styles.photoSelector}>
                  {photoHistory.map((historyPhoto) => (
                    <TouchableOpacity
                      key={historyPhoto.id}
                      onPress={() => selectComparisonPhoto(index, historyPhoto)}
                      style={[
                        styles.selectorPhoto,
                        photo?.id === historyPhoto.id && styles.selectorPhotoSelected
                      ]}
                    >
                      <Image source={{ uri: historyPhoto.uri }} style={styles.selectorImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                {photo?.analysis && (
                  <Text style={styles.comparisonAnalysis}>
                    {new Date(photo.timestamp).toLocaleDateString()}: {
                      photo.analysis.hydrationStatus || 
                      photo.analysis.condition || 
                      photo.analysis.typeDescription
                    }
                  </Text>
                )}
              </View>
            ))}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{getModuleName()}</Text>
          <TouchableOpacity onPress={handleBatchDelete}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleComparisonMode}>
            <Text style={styles.controlButtonText}>📊 Compare</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleExportData}>
            <Text style={styles.controlButtonText}>📤 Export</Text>
          </TouchableOpacity>
        </View>

        {/* Photo Grid */}
        <ScrollView 
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.photoGrid}
          showsVerticalScrollIndicator={false}
        >
          {photoHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No photos yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Take photos during health logging to see them here
              </Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {photoHistory.map((photo) => 
                renderPhotoItem({ 
                  photo, 
                  onPress: handlePhotoPress 
                })
              )}
            </View>
          )}
        </ScrollView>

        {/* Modals */}
        {renderSelectedPhotoModal()}
        {renderComparisonModal()}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  clearButton: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  controlButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  photoGrid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  photoItemSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  photoImage: {
    width: '100%',
    height: '70%',
    backgroundColor: colors.background,
  },
  photoBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  photoInfo: {
    padding: spacing.sm,
    flex: 1,
    justifyContent: 'center',
  },
  photoDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  photoResult: {
    fontSize: 11,
    color: colors.textPrimary,
    marginTop: 2,
  },
  confidenceBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  confidenceText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyStateText: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: typography.md,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCloseButton: {
    fontSize: 20,
    color: '#FFF',
  },
  modalDeleteButton: {
    fontSize: 18,
  },
  modalTitle: {
    fontSize: typography.lg,
    color: '#FFF',
    fontWeight: typography.bold,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
  },
  analysisSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  analysisTitle: {
    fontSize: typography.lg,
    color: '#FFF',
    fontWeight: typography.bold,
    marginBottom: spacing.sm,
  },
  analysisDate: {
    fontSize: typography.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: spacing.md,
  },
  analysisDetails: {
    gap: spacing.sm,
  },
  analysisItem: {
    fontSize: typography.md,
    color: '#FFF',
    lineHeight: 20,
  },
  analysisRecommendation: {
    fontSize: typography.md,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  comparisonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  comparisonSide: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  comparisonLabel: {
    fontSize: typography.md,
    color: '#FFF',
    fontWeight: typography.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  comparisonImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  photoSelector: {
    marginBottom: spacing.md,
  },
  selectorPhoto: {
    width: 60,
    height: 60,
    marginRight: spacing.sm,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  selectorPhotoSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  selectorImage: {
    width: '100%',
    height: '100%',
  },
  comparisonAnalysis: {
    fontSize: typography.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  spacer: {
    width: 24,
  },
});

export default PhotoGallery;
