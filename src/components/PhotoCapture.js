import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { BackHandler } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const PhotoCapture = ({ 
  onCapture, 
  onClose, 
  analysisType = 'urine', // 'urine', 'stool', 'skin'
  autoBlur = false,
  guideText = null // Optional guide text for overlays
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    // Auto-blur for sensitive content
    if (analysisType === 'stool' && autoBlur) {
      setShowBlur(true);
    }
  }, [analysisType, autoBlur]);

  // Handle hardware back press to close capture
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onClose) onClose();
      return true;
    });
    return () => sub.remove();
  }, [onClose]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || !cameraReady) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
        skipProcessing: false,
      });

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      
      onCapture({
        uri: photo.uri,
        assetId: asset.id,
        timestamp: new Date().toISOString(),
        analysisType,
        blurred: showBlur
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo: ' + error.message);
    }
  };

  const handleChooseFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        onCapture({
          uri: result.assets[0].uri,
          timestamp: new Date().toISOString(),
          analysisType,
          blurred: showBlur,
          fromLibrary: true
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select photo: ' + error.message);
    }
  };

  const toggleFlash = () => {
    setFlashMode((prev) => (prev === FlashMode.off ? FlashMode.on : FlashMode.off));
  };

  const getAnalysisOverlay = () => {
    switch (analysisType) {
      case 'urine':
        return (
          <View style={styles.overlay}>
            <View style={styles.colorDetectionFrame}>
              <Text style={styles.overlayText}>Position sample here</Text>
              <Text style={styles.overlaySubtext}>Color detection active</Text>
            </View>
          </View>
        );
      case 'stool':
        return (
          <View style={styles.overlay}>
            <View style={styles.analysisFrame}>
              <Text style={styles.overlayText}>Bristol Scale Analysis</Text>
              <Text style={styles.overlaySubtext}>Keep sample in frame</Text>
            </View>
          </View>
        );
      case 'skin':
        return (
          <View style={styles.overlay}>
            <View style={styles.skinGuideFrame}>
              <Text style={styles.overlayText}>Position skin area here</Text>
              <Text style={styles.overlaySubtext}>
                {guideText || 'Ensure good lighting'}
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera access is required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={CameraType.back}
            flashMode={flashMode}
            onCameraReady={() => setCameraReady(true)}
            ratio="4:3"
          >
            {/* Analysis Overlay */}
            {getAnalysisOverlay()}

            {/* Blur Overlay for Privacy */}
            {showBlur && (
              <BlurView intensity={50} style={styles.blurOverlay}>
                <Text style={styles.blurText}>Privacy Mode Active</Text>
                <TouchableOpacity 
                  style={styles.blurToggle}
                  onPress={() => setShowBlur(false)}
                >
                  <Text style={styles.blurToggleText}>Show</Text>
                </TouchableOpacity>
              </BlurView>
            )}
          </Camera>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={onClose}>
              <Text style={styles.controlText}>✕</Text>
            </TouchableOpacity>
            
            <Text style={styles.analysisTypeText}>
              {analysisType === 'urine' ? 'Urine Analysis' : 
               analysisType === 'stool' ? 'Stool Analysis' : 
               'Skin Analysis'}
            </Text>

            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <Text style={styles.controlText}>{flashMode === FlashMode.off ? '🔦' : '💡'}</Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Controls */}
          {analysisType === 'stool' && (
            <View style={styles.privacyControls}>
              <TouchableOpacity 
                style={styles.blurToggleButton}
                onPress={() => setShowBlur(!showBlur)}
              >
                <Text style={styles.blurToggleButtonText}>
                  {showBlur ? '👁️ Show' : '🙈 Privacy Mode'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity 
              style={styles.libraryButton}
              onPress={handleChooseFromLibrary}
            >
              <Text style={styles.libraryButtonText}>📷</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.captureButton, !cameraReady && styles.captureButtonDisabled]}
              onPress={handleTakePhoto}
              disabled={!cameraReady}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={styles.spacer} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: width,
    height: height * 0.75,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorDetectionFrame: {
    width: 200,
    height: 150,
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisFrame: {
    width: 220,
    height: 160,
    borderWidth: 3,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skinGuideFrame: {
    width: 180,
    height: 180,
    borderWidth: 3,
    borderColor: '#4ECDC4',
    borderRadius: 90,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlaySubtext: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  blurToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  blurToggleText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    height: height * 0.25,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  controlButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    color: '#FFF',
    fontSize: 18,
  },
  analysisTypeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacyControls: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  blurToggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  blurToggleButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  libraryButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  libraryButtonText: {
    fontSize: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 30,
  },
  spacer: {
    width: 50,
  },
  permissionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PhotoCapture;
