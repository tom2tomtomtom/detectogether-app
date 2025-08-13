import React from 'react';
import { Pressable, Text, StyleSheet, View, Platform, useWindowDimensions } from 'react-native';
import theme from '../styles/theme';

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: '#F3F4F6',
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.radius.lg,
  },
});

const textSizeStyles = StyleSheet.create({
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
});

const Button = ({
  onPress,
  label,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  iconLeft,
  iconRight,
  accessibilityLabel,
  testID,
}) => {
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;
  const finalSize = isNarrow && size === 'md' ? 'sm' : isNarrow && size === 'lg' ? 'md' : size;

  const handleKeyDown = (e) => {
    if (Platform.OS === 'web' && !disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onPress && onPress(e);
    }
  };

  const textColor = variant === 'primary' ? theme.colors.primaryText : '#374151';

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onKeyDown={handleKeyDown}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel || label}
      testID={testID}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[finalSize],
        variantStyles[disabled ? 'disabled' : variant],
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        {iconLeft ? <View style={[styles.icon, { marginRight: 8 }]}>{iconLeft}</View> : null}
        {label ? (
          <Text style={[styles.textBase, textSizeStyles[finalSize], { color: textColor }, textStyle]}>
            {label}
          </Text>
        ) : null}
        {children}
        {iconRight ? <View style={[styles.icon, { marginLeft: 8 }]}>{iconRight}</View> : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.9,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBase: {
    fontWeight: '600',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
