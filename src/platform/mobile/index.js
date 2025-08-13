import { Linking } from 'react-native';

export const platform = 'mobile';

export const openLink = (url) => {
  Linking.openURL(url);
};
