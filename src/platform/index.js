import { Platform } from 'react-native';
import * as Web from './web';
import * as Mobile from './mobile';

const Impl = Platform.OS === 'web' ? Web : Mobile;

export const platform = Impl.platform;
export const openLink = Impl.openLink;
