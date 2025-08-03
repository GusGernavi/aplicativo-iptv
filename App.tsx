import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'expo-status-bar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LiveTVScreen from './src/screens/LiveTVScreen';
import MoviesScreen from './src/screens/MoviesScreen';
import SeriesScreen from './src/screens/SeriesScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import PlayerScreen from './src/screens/PlayerScreen';

// Components
import TabBarIcon from './src/components/TabBarIcon';

// Types
import {RootStackParamList, TabParamList} from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => (
          <TabBarIcon route={route.name} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopColor: '#2C2C2E',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{title: 'Início'}}
      />
      <Tab.Screen 
        name="LiveTV" 
        component={LiveTVScreen}
        options={{title: 'TV ao Vivo'}}
      />
      <Tab.Screen 
        name="Movies" 
        component={MoviesScreen}
        options={{title: 'Filmes'}}
      />
      <Tab.Screen 
        name="Series" 
        component={SeriesScreen}
        options={{title: 'Séries'}}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{title: 'Favoritos'}}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#1C1C1E" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="Player" 
            component={PlayerScreen}
            options={{
              headerShown: true,
              title: 'Reproduzindo',
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#FFFFFF',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
} 