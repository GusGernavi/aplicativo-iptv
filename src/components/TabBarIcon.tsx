import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {TabParamList} from '../types/navigation';

interface TabBarIconProps {
  route: keyof TabParamList;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({route, focused, color, size}) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (route) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'LiveTV':
      iconName = focused ? 'radio' : 'radio-outline';
      break;
    case 'Movies':
      iconName = focused ? 'film' : 'film-outline';
      break;
    case 'Series':
      iconName = focused ? 'tv' : 'tv-outline';
      break;
    case 'Favorites':
      iconName = focused ? 'heart' : 'heart-outline';
      break;
    default:
      iconName = 'help-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

export default TabBarIcon; 