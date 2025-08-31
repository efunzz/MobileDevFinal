import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LogInScreen';
import SignupScreen from '../screens/auth/SignUpScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

// Root navigation handling authentication flow
const StackNavigator = ({ session }) => {
  return (
    <Stack.Navigator 
      initialRouteName={session ? "MainApp" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      {session ? (
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
        />
      ) : (
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
};

export default StackNavigator;