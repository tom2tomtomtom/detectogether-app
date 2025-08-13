import React from 'react';
import { Platform, Modal as RNModal, View, StyleSheet, Pressable } from 'react-native';

const WebModal = ({ visible, onRequestClose, children }) => {
  if (!visible) return null;
  return (
    <View style={styles.overlay} role="dialog" aria-modal="true">
      <Pressable style={styles.backdrop} onPress={onRequestClose} />
      <View style={styles.sheet}>
        {children}
      </View>
    </View>
  );
};

const CrossModal = ({ visible, onRequestClose, children, animationType = 'slide', transparent = true }) => {
  if (Platform.OS === 'web') {
    return <WebModal visible={visible} onRequestClose={onRequestClose}>{children}</WebModal>;
  }
  return (
    <RNModal visible={visible} animationType={animationType} transparent={transparent} onRequestClose={onRequestClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {children}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
});

export default CrossModal;
