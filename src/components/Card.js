import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import theme from '../styles/theme';

const Card = ({ children, style, padded = true, radius = 'md', ...rest }) => {
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const padding = padded ? (compact ? 12 : 16) : 0;

  return (
    <View
      style={[
        styles.base,
        { padding, borderRadius: theme.radius[radius] || theme.radius.md },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default Card;
