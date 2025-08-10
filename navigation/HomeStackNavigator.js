import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CardListScreen from '../screens/CardListScreen';
import StudyScreen from '../screens/StudyScreen';

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CardList" 
        component={CardListScreen}
        options={{ 
          headerShown: true,
          title: 'Cards',
          headerBackTitle: 'Back'
        }}
      />
       <Stack.Screen 
        name="StudyScreen" 
        component={StudyScreen}
        options={{ 
          headerShown: false,
          presentation: 'card' // Optional: makes it slide up like a modal
        }}
      />
    </Stack.Navigator>
  );
}