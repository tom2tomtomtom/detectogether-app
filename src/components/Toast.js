import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const AUTO_HIDE_MS = 4000;

const Toast = ({ message, visible = false, onHide, type = 'info', actionLabel, onAction, durationMs = AUTO_HIDE_MS }) => {
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && message) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      const t = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: 80, duration: 250, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => onHide?.());
      }, durationMs);
      return () => clearTimeout(t);
    }
  }, [visible, message]);

  if (!visible || !message) return null;

  const containerStyle = [
    styles.container,
    type === 'warning' && styles.warning,
    type === 'success' && styles.success,
    type === 'info' && styles.info,
    { transform: [{ translateY }], opacity },
  ];

  return (
    <Animated.View style={containerStyle} pointerEvents="auto">
      <View style={styles.row}>
        <Text style={styles.text} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.85}>
          {message}
        </Text>
        {actionLabel && onAction ? (
          <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#111827',
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  text: { color: 'white', fontWeight: '700', flex: 1, marginRight: 8 },
  actionBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  actionText: { color: 'white', fontWeight: '800' },
  warning: { backgroundColor: '#B91C1C', borderColor: '#FECACA' },
  success: { backgroundColor: '#065F46', borderColor: '#A7F3D0' },
  info: { backgroundColor: '#111827', borderColor: '#E5E7EB' },
});

export default Toast;


