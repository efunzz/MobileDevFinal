import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CardListScreen from '../screens/CardListScreen';
import StudyScreen from '../screens/StudyScreen';
import StudyStatisticsScreen from '../screens/StudyStatisticScreen';

const Stack = createStackNavigator();

// Stack navigation for home section screens
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: '#000000',
        },
        headerBackTitleVisible: false,
        headerBackTitle: '',
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerBackImage: () => (
          <Ionicons
            name="chevron-back"
            size={24}
            color="#000000"
          />
        ),
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CardList" 
        component={CardListScreen}
        options={({ route }) => ({
          headerShown: true,
          title: 'Cards',
          headerStyle: {
            backgroundColor: '#f9fafb',
            shadowColor: 'transparent',
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          },
        })}
      />
      <Stack.Screen 
        name="StudyScreen" 
        component={StudyScreen}
        options={{ 
          headerShown: false,
          presentation: 'card'
        }}
      />
      <Stack.Screen 
        name="StudyStatistics" 
        component={StudyStatisticsScreen}
        options={{ 
          headerShown: false,
          presentation: 'card'
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;