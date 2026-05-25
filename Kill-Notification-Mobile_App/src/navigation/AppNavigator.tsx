import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SendNotificationScreen from '../screens/SendNotificationScreen';
import BroadcastScreen from '../screens/BroadcastScreen';

export type RootStackParamList = {
  Home: undefined;
  Send: undefined;
  Broadcast: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Send" component={SendNotificationScreen} options={{ title: 'Send Notification' }} />
        <Stack.Screen name="Broadcast" component={BroadcastScreen} options={{ title: 'Send To All' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
