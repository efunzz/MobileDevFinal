import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Import screens and other navigators
import LoginScreen from '../screens/auth/LogInScreen';
import SignupScreen from '../screens/auth/SignUpScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default function StackNavigator({ session }) {
  return (
    <Stack.Navigator 
      initialRouteName={session ? "MainApp" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      {session ? (
        // User is logged in - show main app
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
        />
      ) : (
        // User is not logged in - show auth screens
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="SignUp"
            component={SignupScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}